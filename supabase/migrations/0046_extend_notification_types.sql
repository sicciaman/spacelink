-- Update notification types check constraint
ALTER TABLE admin_notifications 
DROP CONSTRAINT IF EXISTS admin_notifications_type_check;

ALTER TABLE admin_notifications 
ADD CONSTRAINT admin_notifications_type_check 
CHECK (type IN (
  'booking_created',
  'booking_cancelled', 
  'booking_updated',
  'package_purchased',
  'package_expiring_soon',
  'package_expired',
  'subscription_expiring_soon',
  'subscription_expired'
));