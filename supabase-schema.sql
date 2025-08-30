-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  product_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
  id BIGSERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  button_text TEXT NOT NULL,
  content_position TEXT NOT NULL CHECK (content_position IN ('left', 'right')),
  active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT USING (bucket_id IN ('product-images', 'category-images', 'hero-images'));

CREATE POLICY "Admins can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('product-images', 'category-images', 'hero-images') AND
  auth.uid() IN (SELECT id FROM admin_users)
);

CREATE POLICY "Admins can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('product-images', 'category-images', 'hero-images') AND
  auth.uid() IN (SELECT id FROM admin_users)
);

CREATE POLICY "Admins can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('product-images', 'category-images', 'hero-images') AND
  auth.uid() IN (SELECT id FROM admin_users)
);

-- RLS policies for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products" ON products
FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- RLS policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON categories
FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- RLS policies for hero_images
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hero images" ON hero_images
FOR SELECT USING (true);

CREATE POLICY "Admins can manage hero images" ON hero_images
FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- RLS policies for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users" ON admin_users
FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can manage admin users" ON admin_users
FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON hero_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default hero images
INSERT INTO hero_images (src, alt, title, subtitle, button_text, content_position, order_index) VALUES
('/assets/image3.jpeg', 'Hero background with models in South Asian clothing - Image 1', 'Elegance Redefined', 'Discover our exquisite collection of modern South Asian fashion', 'Shop Now', 'right', 1),
('/assets/image2.png', 'Hero background with models in South Asian clothing - Image 2', 'Timeless Beauty', 'Experience the perfect blend of tradition and contemporary style', 'Explore Collection', 'left', 2)
ON CONFLICT DO NOTHING;
