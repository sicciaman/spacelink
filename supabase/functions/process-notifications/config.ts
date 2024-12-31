// Configuration constants
export const config = {
  supabase: {
    url: Deno.env.get('SUPABASE_URL') || '',
    serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  },
  smtp: {
    host: Deno.env.get('SMTP_HOST') || '',
    port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
    username: Deno.env.get('SMTP_USERNAME') || '',
    password: Deno.env.get('SMTP_PASSWORD') || '',
    adminEmail: Deno.env.get('ADMIN_EMAIL') || '',
    senderName: 'AlienSales Booking'
  }
};