/*
  # Initial Schema Setup

  1. Tables
    - channels: Telegram channels for posting
      - id: Primary key
      - name: Channel name
      - description: Channel description
      - telegram_url: Channel URL
      - type: Channel type (main/specialized)
      - created_at: Creation timestamp

    - packages: Available post packages
      - id: Primary key
      - channel_id: Reference to channels
      - name: Package name
      - post_count: Number of posts included
      - price: Package price
      - savings: Amount saved compared to single posts
      - requires_subscription: Whether subscription is required
      - created_at: Creation timestamp

  2. Security
    - RLS enabled on all tables
    - Public read access for channels and packages
*/

-- Create tables
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  telegram_url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id),
  name TEXT NOT NULL,
  post_count INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  savings DECIMAL(10,2),
  requires_subscription BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to channels"
  ON channels FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to packages"
  ON packages FOR SELECT
  TO public
  USING (true);