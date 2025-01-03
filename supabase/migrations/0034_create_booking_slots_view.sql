-- Create a view for booking slots
CREATE VIEW booking_slots AS
SELECT 
  channel_id,
  booking_date
FROM bookings
WHERE status != 'cancelled';

-- Grant access to the view
GRANT SELECT ON booking_slots TO authenticated;

-- Update the unique constraint to ignore cancelled bookings
DROP INDEX IF EXISTS bookings_channel_booking_date_key;
CREATE UNIQUE INDEX bookings_active_slot_idx ON bookings (channel_id, booking_date) 
WHERE status != 'cancelled';