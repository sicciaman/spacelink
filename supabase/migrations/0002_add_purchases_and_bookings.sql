/*
  # Purchases and Bookings Schema

  1. Tables
    - purchases: User package purchases
      - id: Primary key
      - user_id: Reference to auth.users
      - package_id: Reference to packages
      - payment_id: Payment reference
      - payment_status: Payment status
      - amount_paid: Amount paid
      - posts_remaining: Remaining posts
      - expires_at: Package expiration
      - created_at: Creation timestamp

    - bookings: Post scheduling
      - id: Primary key
      - user_id: Reference to auth.users
      - purchase_id: Reference to purchases
      - channel_id: Reference to channels
      - booking_date: Scheduled date/time
      - status: Booking status
      - product_link: Product URL
      - coupon: Coupon code
      - start_price: Original price
      - discount_price: Discounted price
      - created_at: Creation timestamp

  2. Security
    - RLS enabled
    - Authenticated users can manage their own data
*/

-- Create tables
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  package_id UUID REFERENCES packages(id),
  payment_id TEXT,
  payment_status TEXT NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  posts_remaining INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  purchase_id UUID REFERENCES purchases(id),
  channel_id UUID REFERENCES channels(id),
  booking_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  product_link TEXT NOT NULL,
  coupon TEXT,
  start_price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');