-- Store Stripe API key in vault if it doesn't exist
-- Update the key to your actual Stripe API key.
insert into vault.secrets (name, secret)
select 'stripe', 'sk_test_xxx'
where not exists (
    select 1 from vault.secrets where name = 'stripe'
)
returning key_id;