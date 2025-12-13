-- Enable insert for authenticated users
create policy "Enable insert for authenticated users only"
on "public"."compromissos"
as permissive
for insert
to authenticated
with check (
  (auth.uid() = user_id)
);

-- Enable select for authenticated users (if not already present)
create policy "Enable select for authenticated users only"
on "public"."compromissos"
as permissive
for select
to authenticated
using (
  (auth.uid() = user_id)
);

-- Enable update for authenticated users
create policy "Enable update for authenticated users only"
on "public"."compromissos"
as permissive
for update
to authenticated
using (
  (auth.uid() = user_id)
)
with check (
  (auth.uid() = user_id)
);

-- Enable delete for authenticated users
create policy "Enable delete for authenticated users only"
on "public"."compromissos"
as permissive
for delete
to authenticated
using (
  (auth.uid() = user_id)
);
