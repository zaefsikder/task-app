# Tutorial 3: Storage (Image Uploads)

If we want to store any user data that isn't fit for a database (e.g. images, files, large documents, etc) we need to have a storage system. We'll now implement that using Supabase storage buckets.

### Objectives

- **Image Uploads**: Users can upload an image attachment
- **Upload Constraints**: Limit uploads to 1MB file size, and only to images.
- **Image Preview**: Users can see a preview of their image on the task page.
- **Automated Clean Up**: Deleting a task should also automatically remove any attached image.

## Apply Storage SQL Migrations

We don't need to do anything in our Supabase dashboard/project to enable Storage. We can just run a migration to create the resources for us directly. Refer to `supabase/migrations/3_init_storage_schema.sql`.

We will create a [storage](https://supabase.com/docs/guides/storage) bucket named `task-attachments`. This will also set a limit for the file size (1MB) and file types (images only).

```sql
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'task-attachments',
  'task-attachments',
  true,
  1000000, -- 1MB in bytes
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
);
```

**Important Note**: For the purposes of this tutorial I've made it a public bucket so that images are easy to display. However for production use cases, I recommend making it private/secure, and using pre-signed URLs to access storage items.

Further in the `3_init_storage_schema` file, you'll find SQL statements to apply:

- Security policy: Public can view attachments
- Security policy: Users can upload their own attachments
- Security policy: Users can delete their own attachments
- Trigger: Delete attachment when a task is deleted

## Apply Storage SQL Migrations

If you run this, it should apply the migration on top of any previous migrations.

```sh
supabase db push
```

Or nuke the project and apply it from zero.

```sh
supabase db reset --linked
```

Normally, our previous command won't work anymore because the storage bucket isn't actually covered in the scope of the reset. This will make the storage bucket creation fail, because the bucket already exists.

So we have to first explicitly delete the bucket, _then_ reset. We do that in the SQL file itself.

```sql
delete from storage.buckets where id = 'task-attachments';
```

But in case you don't have to have that statement (to prevent accident storage wipeout), you can also remove the storage via CLI.

```sh
# Manually delete the `task-attachments` bucket.
supabase storage rm ss:///task-attachments -r --experimental

# Then run the DB reset command.
supabase db reset --linked
```

In production, you probably want to be careful with any kind of delete/removal operation (and likely avoid them altogether).
