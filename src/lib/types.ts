export interface Booking {
  id: string;
  user_id: string;
  purchase_id: string;
  channel_id: string;
  booking_date: string;
  status: string;
  product_link: string;
  coupon?: string;
  start_price: number;
  discount_price: number;
  created_at: string;
}

export type BookingStep = 'channel' | 'package' | 'datetime' | 'product';

export interface ChannelStats {
  member_count: number;
  avg_views_24h: number;
  engagement_rate: number;
}

export interface ChannelTag {
  id: string;
  name: string;
  color: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  package_id: string;
  payment_id?: string;
  payment_status: string;
  amount_paid: number;
  posts_remaining: number;
  expires_at: string;
  created_at: string;
}

export interface Package {
  id: string;
  channel_id: string;
  name: string;
  status: 'active' | 'cancelled' | 'expired';
  post_count: number;
  price: number;
  savings: number | null;
  requires_subscription: boolean;
  created_at: string;
}

export interface ChannelBadge {
  type: 'top' | 'trending' | 'new';
  label: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  telegram_url: string;
  type: string;
  logo_url: string | null;
  featured: boolean;
  created_at: string;
  stats?: ChannelStats;
  tags?: ChannelTag[];
  badges?: ChannelBadge[];
}