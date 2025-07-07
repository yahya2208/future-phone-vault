-- Create avatars bucket
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;

-- Set up RLS policies for avatars bucket
create policy "Public Access" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload their own avatars" on storage.objects 
  for insert with check (bucket_id = 'avatars' AND (auth.role() = 'authenticated'));
create policy "Users can update their own avatars" on storage.objects 
  for update using (bucket_id = 'avatars' AND (auth.role() = 'authenticated'));
