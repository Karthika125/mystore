DO $$ 
BEGIN
    -- Check if cart_items table exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cart_items') THEN
        CREATE TABLE cart_items (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            product_id UUID NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            price DECIMAL(10,2) NOT NULL,
            name TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
        
        -- Create index only if table was just created
        CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
    END IF;

    -- Check if user_carts table exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_carts') THEN
        CREATE TABLE user_carts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            cart_items JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
        
        -- Create index only if table was just created
        CREATE INDEX idx_user_carts_user_id ON user_carts(user_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_carts ENABLE ROW LEVEL SECURITY;

-- Create or replace policies (this will overwrite existing ones if they exist)
DO $$ 
BEGIN
    -- Cart Items policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cart_items') THEN
        DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
        
        CREATE POLICY "Users can view their own cart items" ON cart_items FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own cart items" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own cart items" ON cart_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own cart items" ON cart_items FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- User Carts policies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_carts') THEN
        DROP POLICY IF EXISTS "Users can view their own cart" ON user_carts;
        DROP POLICY IF EXISTS "Users can insert their own cart" ON user_carts;
        DROP POLICY IF EXISTS "Users can update their own cart" ON user_carts;
        DROP POLICY IF EXISTS "Users can delete their own cart" ON user_carts;
        
        CREATE POLICY "Users can view their own cart" ON user_carts FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own cart" ON user_carts FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own cart" ON user_carts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own cart" ON user_carts FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$; 