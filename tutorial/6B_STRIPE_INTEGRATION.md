# Tutorial 6B: Stripe Integration

This tutorial implements Stripe subscriptions in our TaskApp, building on the Stripe setup from Tutorial 6A. We'll create the database schema, implement edge functions for payment processing, and wire everything up to our frontend.

## Apply Database Migrations

First, we'll apply two SQL migrations that set up our Stripe integration:

```bash
supabase db push
```

### Understanding the Migrations

#### 1. Stripe Integration (7_init_stripe_integration.sql)
- Creates Stripe wrapper and foreign data tables
- Implements triggers for automatic Stripe customer creation/deletion
- Sets up security policies for Stripe data access

#### 2. Secrets Configuration (8_init_secrets.sql)
```sql
insert into vault.secrets (name, secret)
select 'stripe', 'sk_test_xxx'
where not exists (
    select 1 from vault.secrets where name = 'stripe'
)
returning key_id;
```

Update the secret with your actual Stripe API secret key from Tutorial 6A.This migration will add a new field into the `vaults.secrets` which is a pre-existing Supabase DB. You only need to run this once, and it will make the secret key available for your trigger to use.

However, do NOT commit this secret key to your repo — just run it once and delete the file, or undo it back into this 'sk_test_xxx' placeholder after you run the migration once.
