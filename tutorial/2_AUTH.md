# Tutorial 2: User Authentication

Every SaaS app needs to have user authentication. This will let us implement security boundaries (e.g. Alice can't read Bob's data), and other thing that are important to our business (like usage tracking, payments, account recovery, etc).

The goal of this tutorial is to implement authentication for our SaaS.

### Objectives

- **Google Integration (OAuth)**: Managing our own auth is hard. I generally recommend to just use some other 3rd party (like Google) and hook it into our system. This way we don't need to deal with things like password recovery and privacy policies around user data.
- **Email/Password**: We'll implement these in our project as well for learning purposes. But I wouldn't normally enable this in a production system, unless it was big enough or had a good reason to have it.
- **User/Auth Triggers**: Wire up our DB so a new profile is created whenever a new "auth user" enters our system. Inversely, make sure that profiles/tasks are deleted when their owning auth user is deleted.
- **Database Security**: Set security boundaries for tasks and profiles. Users cannot edit their profile information (we control that). Users can CRUD their own tasks. Add security policies and enable "Row Level Security" to our tables.
- **Auth Based Routing**: Our app should re-direct to the login page if the user is not signed in. Otherwise, go to the dashboard.

## Enable Auth in Supabase

### Email Auth Setup

1. Go to Supabase Dashboard > Authentication > Providers.
2. Click "Email" tab (it should already be enabled).
3. Disable "Confirm email".
4. Save changes.

We disabled the "confirmation email" so it's easier to test. But if you want to use it in production, it's probably good to have it on. You'll just have to modify the tests to work with that.

### Google Auth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing.
3. Enable Google OAuth API: Go to **API and Services > Credentials**.
4. Create OAuth credentials:
   - Application type: `Web application`.
   - Add authorized redirect URI: `https://[PROJECT_ID].supabase.co/auth/v1/callback`.
5. Copy Client ID and Secret
6. In Supabase **Dashboard > Authentication > Providers**:
   - Click "Google" tab.
   - Enable provider.
   - Paste Client ID and Secret.
   - Save changes.

## Apply Auth SQL Migrations

Next we need to apply some changes to our database. You'll find all the changes in `supabase/migrations/2_init_auth.sql`.

- Trigger to automatically create a new **profile** whenever a new user signs up (or joins from OAuth).
- Security policy so that users can only _read_ their profile (but not modify it). This is because we want to later store usage and subscription information in the profile.
- Security policy so that users can perform any CRUD operations on their own tasks.
- Row Level Security: the `user_id` of a row has to match the authenticated user for them to be able to perform any operations (including read) on it.
- A index based on `user_id` and `created_at` time. This is an optimization so that when users view X most recent tasks on their dashboard, it's a fast query.

Apply all migrations (you can optionally reset it as well, to clear all previous data).

```sh
supabase db reset --linked
```

### Test User Creation Trigger

At this stage, you can quickly test the user creation trigger. Go to your Supabase dashboard **Authentication > Add User > Create New User** and create one.

This will create a user in Supabase's built-in **Users** (auth.users) table. This is not the same as our profile table.

But we _did_ create a trigger so that a new profile will be created whenever a new `auth.user` is created.

Go to your table and verify that a new profile was automatically created: **Table Editor > Profiles**.
