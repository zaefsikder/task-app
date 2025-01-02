# Tutorial 4: Usage Limits (Triggers)

If we want to be able to have free/premium tiers based on app usage, we'll need a way to track customer usage, and to limit access based on that.

The goal of this section is to implement usage limits and enforcement for task creation:

* Free users can create 100 tasks per month
* Premium users can create 10,000 tasks per month.

## Usage Tracking Strategy

One possible way to track usage is by using a field in the user's profile (e.g. `tasks_created`), which is reset once a month. It's a simpler model, but I have two issues with that: 

1. Resetting usage to 0 is a destructive operation (we lose history of previous month usage).
2. It doesn't scale well with number of users (even inactive ones).

So instead, I've decided to use a separate table to store usage information. It will use a primary key of `(user_id, year_month)`, so for any given month, we can instantly check a customer's usage in O(1) time. We also don't need to reset the counters, because over time the `year_month` portion will already serve that function for us. Data will accumulate over time, but it's likely not going to be our scaling bottleneck.

## SQL Migration: Usage Tracking Table

First, we will create a new table to track task usage (see `supabase/migrations/4_init_usage_tracking.sql`).

```sql
create table public.usage_tracking (
  user_id uuid references public.profiles on delete cascade,
  year_month text,
  tasks_created integer default 0,
  primary key (user_id, year_month)
);
```

We also also apply some rules and triggers:

* Users can read their own usage tracking data (to show how many tasks they've used), but cannot modify it themselves. Only the service role (our server) will be able to modify it.
* Whenever a user creates a task, the usage value for that period (YYYY-MM) is incremented.

## SQL Migration: Task Limits

Our next migration `supabase/migrations/5_init_task_limit_triggers.sql` will enforce that when a user is at their limit, they are not able to create new tasks.

It will query the `usage_tracking` table for the current's month usage, and compare it against the `tasks_limit` that we store in the user's `profiles` table.

## SQL Migration: Account Tier Triggers

Finally, we will create a trigger so that whenever the user's `subscription_plan` field changes, it will also update the limit. This way, if we want to implement any free/premium products, we only need to worry about changing one field in one place.

* Changing from `free` to `premium` sets `tasks_limit` to `10_000`.
* Changing from `premium` to `free` sets `tasks_limit` to `100`.

This is a simple, straightforward trigger. But it does have some opportunities for extension. For example, what happens when the user's subscription expires mid-month (e.g. mid April)? The `tasks_created` are bucketed into months, so they might have 500 tasks created so far, and then suddenly see their limit reset to 100, making them unable to create tasks for the rest of April. 

One easy solution is to also make the trigger reset `tasks_created` to 0. But that would that cause any secondary issues?

