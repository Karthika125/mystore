-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- Create RLS policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own cart items
CREATE POLICY "Users can view their own cart items"
    ON cart_items
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy for users to insert their own cart items
CREATE POLICY "Users can insert their own cart items"
    ON cart_items
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own cart items
CREATE POLICY "Users can update their own cart items"
    ON cart_items
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own cart items
CREATE POLICY "Users can delete their own cart items"
    ON cart_items
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id); 