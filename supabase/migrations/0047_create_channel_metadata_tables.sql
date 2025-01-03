-- Create channel_stats table
CREATE TABLE channel_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  member_count INTEGER NOT NULL DEFAULT 0,
  avg_views_24h INTEGER NOT NULL DEFAULT 0,
  engagement_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (channel_id)
);

-- Create channel_tags table
CREATE TABLE channel_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create channel_tag_mappings table
CREATE TABLE channel_tag_mappings (
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES channel_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (channel_id, tag_id)
);

-- Create channel_badges table
CREATE TABLE channel_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('top', 'trending', 'new')),
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (channel_id, type)
);

-- Add new columns to channels table
ALTER TABLE channels 
ADD COLUMN featured BOOLEAN DEFAULT false,
ADD COLUMN logo_url TEXT;

-- Enable RLS
ALTER TABLE channel_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_tag_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON channel_stats FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON channel_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON channel_tag_mappings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON channel_badges FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial data
INSERT INTO channel_tags (id, name, color) VALUES
  (gen_random_uuid(), 'Deals', '#2563eb'),
  (gen_random_uuid(), 'Shopping', '#059669'),
  (gen_random_uuid(), 'Coupons', '#dc2626'),
  (gen_random_uuid(), 'Promos', '#7c3aed'),
  (gen_random_uuid(), 'Tech', '#3b82f6'),
  (gen_random_uuid(), 'Electronics', '#6366f1'),
  (gen_random_uuid(), 'Fashion', '#ec4899'),
  (gen_random_uuid(), 'Style', '#f43f5e'),
  (gen_random_uuid(), 'Home', '#84cc16'),
  (gen_random_uuid(), 'Furniture', '#ca8a04');

-- Update channels with metadata
UPDATE channels SET 
  featured = true,
  logo_url = 'https://raw.githubusercontent.com/your-username/spacelink/main/assets/aliensales.png'
WHERE name = 'AlienSales';

UPDATE channels SET 
  featured = true,
  logo_url = 'https://raw.githubusercontent.com/your-username/spacelink/main/assets/spacecoupon.png'
WHERE name = 'SpaceCoupon';

-- Insert channel stats
INSERT INTO channel_stats (channel_id, member_count, avg_views_24h, engagement_rate)
SELECT id, 
  CASE 
    WHEN name = 'AlienSales' THEN 730000
    WHEN name = 'SpaceCoupon' THEN 130000
    WHEN name = 'CosmoTech' THEN 85000
    WHEN name = 'Abbigliamento Spaziale' THEN 45000
    ELSE 35000
  END,
  CASE 
    WHEN name = 'AlienSales' THEN 150000
    WHEN name = 'SpaceCoupon' THEN 45000
    WHEN name = 'CosmoTech' THEN 25000
    WHEN name = 'Abbigliamento Spaziale' THEN 15000
    ELSE 12000
  END,
  CASE 
    WHEN name = 'AlienSales' THEN 15.8
    WHEN name = 'SpaceCoupon' THEN 12.4
    WHEN name = 'CosmoTech' THEN 10.2
    WHEN name = 'Abbigliamento Spaziale' THEN 8.5
    ELSE 7.8
  END
FROM channels;

-- Insert channel badges
INSERT INTO channel_badges (channel_id, type, label)
SELECT id, 'top', '#1 Channel'
FROM channels
WHERE name = 'AlienSales';

-- Grant permissions
GRANT ALL ON channel_stats TO authenticated;
GRANT ALL ON channel_tags TO authenticated;
GRANT ALL ON channel_tag_mappings TO authenticated;
GRANT ALL ON channel_badges TO authenticated;