-- Sample data for Etheya Fashion Site
-- Run this AFTER running database-setup.sql
-- This will populate your database with sample products for testing

-- Insert sample products
INSERT INTO products (id, title, price, description, pieces, fabric, color, embellishments, fit, season, care_instructions, model_size, category) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Elegant Evening Gown', 25000.00, 'A stunning evening gown perfect for special occasions', '1 piece', 'Silk', 'Navy Blue', 'Beaded embellishments', 'A-line', 'All Season', 'Dry clean only', 'M', 'Evening Wear'),
('550e8400-e29b-41d4-a716-446655440002', 'Casual Summer Dress', 12000.00, 'Light and comfortable dress for everyday wear', '1 piece', 'Cotton', 'Floral Print', 'None', 'Relaxed', 'Summer', 'Machine wash cold', 'L', 'Casual Wear'),
('550e8400-e29b-41d4-a716-446655440003', 'Formal Business Suit', 35000.00, 'Professional business suit for office wear', '2 pieces', 'Wool Blend', 'Charcoal Gray', 'None', 'Tailored', 'All Season', 'Dry clean only', 'L', 'Formal Wear'),
('550e8400-e29b-41d4-a716-446655440004', 'Traditional Shalwar Kameez', 18000.00, 'Beautiful traditional Pakistani outfit', '2 pieces', 'Cotton Silk', 'Emerald Green', 'Embroidery', 'Loose', 'All Season', 'Hand wash', 'M', 'Traditional Wear'),
('550e8400-e29b-41d4-a716-446655440005', 'Party Wear Lehenga', 45000.00, 'Gorgeous lehenga for weddings and parties', '3 pieces', 'Silk', 'Maroon', 'Heavy embroidery and sequins', 'Fitted', 'All Season', 'Dry clean only', 'S', 'Party Wear'),
('550e8400-e29b-41d4-a716-446655440006', 'Casual Trousers', 8000.00, 'Comfortable trousers for everyday wear', '1 piece', 'Cotton', 'Black', 'None', 'Straight', 'All Season', 'Machine wash', 'L', 'Casual Wear'),
('550e8400-e29b-41d4-a716-446655440007', 'Designer Blouse', 15000.00, 'Elegant blouse with intricate design', '1 piece', 'Chiffon', 'Peach', 'Lace work', 'Fitted', 'All Season', 'Dry clean only', 'M', 'Formal Wear'),
('550e8400-e29b-41d4-a716-446655440008', 'Winter Coat', 28000.00, 'Warm and stylish winter coat', '1 piece', 'Wool', 'Camel', 'None', 'Oversized', 'Winter', 'Dry clean only', 'L', 'Winter Wear');

-- Insert product sizes
INSERT INTO product_sizes (product_id, size) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'S'),
('550e8400-e29b-41d4-a716-446655440001', 'M'),
('550e8400-e29b-41d4-a716-446655440001', 'L'),
('550e8400-e29b-41d4-a716-446655440001', 'XL'),
('550e8400-e29b-41d4-a716-446655440002', 'S'),
('550e8400-e29b-41d4-a716-446655440002', 'M'),
('550e8400-e29b-41d4-a716-446655440002', 'L'),
('550e8400-e29b-41d4-a716-446655440002', 'XL'),
('550e8400-e29b-41d4-a716-446655440003', 'M'),
('550e8400-e29b-41d4-a716-446655440003', 'L'),
('550e8400-e29b-41d4-a716-446655440003', 'XL'),
('550e8400-e29b-41d4-a716-446655440004', 'S'),
('550e8400-e29b-41d4-a716-446655440004', 'M'),
('550e8400-e29b-41d4-a716-446655440004', 'L'),
('550e8400-e29b-41d4-a716-446655440004', 'XL'),
('550e8400-e29b-41d4-a716-446655440005', 'S'),
('550e8400-e29b-41d4-a716-446655440005', 'M'),
('550e8400-e29b-41d4-a716-446655440005', 'L'),
('550e8400-e29b-41d4-a716-446655440005', 'XL'),
('550e8400-e29b-41d4-a716-446655440006', 'S'),
('550e8400-e29b-41d4-a716-446655440006', 'M'),
('550e8400-e29b-41d4-a716-446655440006', 'L'),
('550e8400-e29b-41d4-a716-446655440006', 'XL'),
('550e8400-e29b-41d4-a716-446655440007', 'S'),
('550e8400-e29b-41d4-a716-446655440007', 'M'),
('550e8400-e29b-41d4-a716-446655440007', 'L'),
('550e8400-e29b-41d4-a716-446655440007', 'XL'),
('550e8400-e29b-41d4-a716-446655440008', 'M'),
('550e8400-e29b-41d4-a716-446655440008', 'L'),
('550e8400-e29b-41d4-a716-446655440008', 'XL');

-- Insert product images (using placeholder images for now)
INSERT INTO product_images (product_id, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', '/assets/image1.png'),
('550e8400-e29b-41d4-a716-446655440001', '/assets/image2.png'),
('550e8400-e29b-41d4-a716-446655440002', '/assets/image3.jpeg'),
('550e8400-e29b-41d4-a716-446655440002', '/assets/image1.png'),
('550e8400-e29b-41d4-a716-446655440003', '/assets/image2.png'),
('550e8400-e29b-41d4-a716-446655440003', '/assets/image3.jpeg'),
('550e8400-e29b-41d4-a716-446655440004', '/assets/image1.png'),
('550e8400-e29b-41d4-a716-446655440004', '/assets/image2.png'),
('550e8400-e29b-41d4-a716-446655440005', '/assets/image3.jpeg'),
('550e8400-e29b-41d4-a716-446655440005', '/assets/image1.png'),
('550e8400-e29b-41d4-a716-446655440006', '/assets/image2.png'),
('550e8400-e29b-41d4-a716-446655440006', '/assets/image3.jpeg'),
('550e8400-e29b-41d4-a716-446655440007', '/assets/image1.png'),
('550e8400-e29b-41d4-a716-446655440007', '/assets/image2.png'),
('550e8400-e29b-41d4-a716-446655440008', '/assets/image3.jpeg'),
('550e8400-e29b-41d4-a716-446655440008', '/assets/image1.png');
