export interface NotificationData {
  id: string;
  type: 'booking_created' | 'booking_cancelled' | 'booking_updated' | 'package_purchased' | 
        'subscription_expiring_soon' | 'subscription_expired' | 'package_expiring_soon' | 'package_expired';
  data: Record<string, any>;
  created_at: string;
  sent_at: string | null;
  error: string | null;
}

export interface EnrichedData extends Record<string, any> {
  user_email?: string;
  channel_name?: string;
  package_name?: string;
}

export interface EmailContent {
  subject: string;
  text: string;
  html?: string;
}