-- Create cart_items table
create table cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table cart_items enable row level security;

-- Create policies
create policy "Users can view their own cart items"
  on cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on cart_items for delete
  using (auth.uid() = user_id);

-- Create function to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_cart_items_updated_at
  before update on cart_items
  for each row
  execute function update_updated_at_column(); 