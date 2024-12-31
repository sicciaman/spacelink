/*
  # Initial Data Seeding

  1. Data
    - Telegram channels with descriptions
    - Post packages with pricing
*/

-- Insert channels
INSERT INTO channels (name, description, telegram_url, type) VALUES
  ('AlienSales', '#1 Online shopping channel in Italy', 'https://t.me/+rxNKXCHebOQxMGNk', 'main'),
  ('SpaceCoupon', 'More than 130.000 members', 'https://t.me/+he_qviXVbjYzYTE0', 'main'),
  ('CosmoTech', 'Only tech & electronics deals', 'https://t.me/+kuVqkdUPS545ZDM8', 'specialized'),
  ('Abbigliamento Spaziale', 'Only style and clothes deals', 'https://t.me/+O4jxj6D55fwzZGM0', 'specialized'),
  ('AstroHouse', 'Only house furniture & accessories deals', 'https://t.me/+bVFMYKRCsRA5MzM0', 'specialized');

-- Insert packages
INSERT INTO packages (channel_id, name, post_count, price, savings, requires_subscription) VALUES
  ((SELECT id FROM channels WHERE name = 'AlienSales'), 'Single Post', 1, 68.00, 0, false),
  ((SELECT id FROM channels WHERE name = 'AlienSales'), '3 Posts Bundle', 3, 150.00, 54.00, true),
  ((SELECT id FROM channels WHERE name = 'AlienSales'), '5 Posts Bundle', 5, 250.00, 90.00, true),
  
  ((SELECT id FROM channels WHERE name = 'SpaceCoupon'), 'Single Post', 1, 27.00, 0, false),
  ((SELECT id FROM channels WHERE name = 'SpaceCoupon'), '3 Posts Bundle', 3, 58.00, 23.00, true),
  ((SELECT id FROM channels WHERE name = 'SpaceCoupon'), '5 Posts Bundle', 5, 94.00, 41.00, true),
  
  ((SELECT id FROM channels WHERE name = 'CosmoTech'), 'Single Post', 1, 15.00, 0, false),
  ((SELECT id FROM channels WHERE name = 'CosmoTech'), '3 Posts Bundle', 3, 33.00, 12.00, true),
  ((SELECT id FROM channels WHERE name = 'CosmoTech'), '5 Posts Bundle', 5, 54.00, 21.00, true),
  
  ((SELECT id FROM channels WHERE name = 'AstroHouse'), 'Single Post', 1, 10.00, 0, false),
  ((SELECT id FROM channels WHERE name = 'AstroHouse'), '3 Posts Bundle', 3, 22.00, 8.00, true),
  ((SELECT id FROM channels WHERE name = 'AstroHouse'), '5 Posts Bundle', 5, 36.00, 14.00, true);