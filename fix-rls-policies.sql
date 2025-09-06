-- Fix Row Level Security (RLS) policies for existing database
-- Run this if you already have tables but are getting RLS policy errors

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON products;
DROP POLICY IF EXISTS "Products are updatable by authenticated users" ON products;

DROP POLICY IF EXISTS "Product sizes are viewable by everyone" ON product_sizes;
DROP POLICY IF EXISTS "Product sizes are insertable by authenticated users" ON product_sizes;
DROP POLICY IF EXISTS "Product sizes are updatable by authenticated users" ON product_sizes;

DROP POLICY IF EXISTS "Product images are viewable by everyone" ON product_images;
DROP POLICY IF EXISTS "Product images are insertable by authenticated users" ON product_images;
DROP POLICY IF EXISTS "Product images are updatable by authenticated users" ON product_images;

DROP POLICY IF EXISTS "Customers are insertable by everyone" ON customers;
DROP POLICY IF EXISTS "Customers are viewable by everyone" ON customers;
DROP POLICY IF EXISTS "Customers are updatable by everyone" ON customers;

DROP POLICY IF EXISTS "Orders are insertable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are viewable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are updatable by everyone" ON orders;

DROP POLICY IF EXISTS "Order items are insertable by everyone" ON order_items;
DROP POLICY IF EXISTS "Order items are viewable by everyone" ON order_items;
DROP POLICY IF EXISTS "Order items are updatable by everyone" ON order_items;

-- Create RLS policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for product_sizes (public read access)
CREATE POLICY "Product sizes are viewable by everyone" ON product_sizes
    FOR SELECT USING (true);

CREATE POLICY "Product sizes are insertable by authenticated users" ON product_sizes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product sizes are updatable by authenticated users" ON product_sizes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for product_images (public read access)
CREATE POLICY "Product images are viewable by everyone" ON product_images
    FOR SELECT USING (true);

CREATE POLICY "Product images are insertable by authenticated users" ON product_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product images are updatable by authenticated users" ON product_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for customers (allow anonymous inserts for orders)
CREATE POLICY "Customers are insertable by everyone" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers are viewable by everyone" ON customers
    FOR SELECT USING (true);

CREATE POLICY "Customers are updatable by everyone" ON customers
    FOR UPDATE USING (true);

-- Create RLS policies for orders (allow anonymous inserts)
CREATE POLICY "Orders are insertable by everyone" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are viewable by everyone" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Orders are updatable by everyone" ON orders
    FOR UPDATE USING (true);

-- Create RLS policies for order_items (allow anonymous inserts)
CREATE POLICY "Order items are insertable by everyone" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Order items are viewable by everyone" ON order_items
    FOR SELECT USING (true);

CREATE POLICY "Order items are updatable by everyone" ON order_items
    FOR UPDATE USING (true);

-- Grant permissions
GRANT ALL ON products TO authenticated;
GRANT ALL ON product_sizes TO authenticated;
GRANT ALL ON product_images TO authenticated;
GRANT ALL ON customers TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;

-- For public access to products (read-only for anonymous users)
GRANT SELECT ON products TO anon;
GRANT SELECT ON product_sizes TO anon;
GRANT SELECT ON product_images TO anon;

-- Allow anonymous users to insert into customers, orders, and order_items
GRANT INSERT ON customers TO anon;
GRANT INSERT ON orders TO anon;
GRANT INSERT ON order_items TO anon;
GRANT SELECT ON customers TO anon;
GRANT SELECT ON orders TO anon;
GRANT SELECT ON order_items TO anon;
