-- Convert existing prices from USD to INR (multiply by 83)
UPDATE products
SET price = price * 83;

-- Add 10 new products across different categories
INSERT INTO products (id, name, description, price, images, category_id, inventory_count, created_at)
VALUES
  -- Home Decor Category
  (uuid_generate_v4(), 'Handwoven Cotton Throw', 'Soft and cozy handwoven cotton throw blanket perfect for your living room', 2499, ARRAY['https://example.com/throw.jpg'], (SELECT id FROM categories WHERE name = 'Home Decor' LIMIT 1), 25, NOW()),
  (uuid_generate_v4(), 'Ceramic Vase Set', 'Set of 3 contemporary ceramic vases in varying sizes', 1899, ARRAY['https://example.com/vases.jpg'], (SELECT id FROM categories WHERE name = 'Home Decor' LIMIT 1), 15, NOW()),

  -- Fashion Category
  (uuid_generate_v4(), 'Silk Scarf', 'Elegant hand-painted silk scarf with traditional Indian motifs', 1299, ARRAY['https://example.com/scarf.jpg'], (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1), 30, NOW()),
  (uuid_generate_v4(), 'Leather Tote Bag', 'Handcrafted genuine leather tote bag with brass hardware', 3999, ARRAY['https://example.com/tote.jpg'], (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1), 20, NOW()),

  -- Jewelry Category
  (uuid_generate_v4(), 'Silver Anklet', 'Sterling silver anklet with traditional bell charms', 899, ARRAY['https://example.com/anklet.jpg'], (SELECT id FROM categories WHERE name = 'Jewelry' LIMIT 1), 40, NOW()),
  (uuid_generate_v4(), 'Gemstone Earrings', 'Handcrafted earrings featuring natural semi-precious stones', 1499, ARRAY['https://example.com/earrings.jpg'], (SELECT id FROM categories WHERE name = 'Jewelry' LIMIT 1), 25, NOW()),

  -- Art Category
  (uuid_generate_v4(), 'Madhubani Painting', 'Traditional Madhubani painting on handmade paper', 4999, ARRAY['https://example.com/madhubani.jpg'], (SELECT id FROM categories WHERE name = 'Art' LIMIT 1), 10, NOW()),
  (uuid_generate_v4(), 'Bronze Sculpture', 'Contemporary bronze sculpture inspired by Indian mythology', 7999, ARRAY['https://example.com/sculpture.jpg'], (SELECT id FROM categories WHERE name = 'Art' LIMIT 1), 5, NOW()),

  -- Wellness Category
  (uuid_generate_v4(), 'Ayurvedic Gift Set', 'Complete set of traditional Ayurvedic self-care products', 2999, ARRAY['https://example.com/ayurveda.jpg'], (SELECT id FROM categories WHERE name = 'Wellness' LIMIT 1), 30, NOW()),
  (uuid_generate_v4(), 'Meditation Cushion Set', 'Organic cotton meditation cushion with matching mat', 1799, ARRAY['https://example.com/meditation.jpg'], (SELECT id FROM categories WHERE name = 'Wellness' LIMIT 1), 20, NOW()); 