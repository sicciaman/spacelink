import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { NotificationService } from './notification-service.ts';
import { EmailService } from './email-service.ts';
import { getEmailTemplates } from './email-templates/index.ts';

const notificationService = new NotificationService();
const emailService = new EmailService();

serve(async () => {
  try {
    const notifications = await notificationService.getPendingNotifications();

    if (!notifications.length) {
      return new Response(
        JSON.stringify({ message: 'No notifications to process' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const results = await Promise.all(
      notifications.map(async (notification) => {
        try {
          // Enrich notification data
          const enrichedData = await notificationService.enrichNotificationData(notification);

          // Get email templates
          const templates = getEmailTemplates(notification.type, enrichedData);

          // Send emails and collect any errors
          const errors = await emailService.sendNotificationEmails(
            templates.adminEmail,
            templates.customerEmail,
            enrichedData.user_email
          );

          // Mark notification as processed
          await notificationService.markNotificationProcessed(notification.id, errors);

          return {
            id: notification.id,
            status: errors.length ? 'partial_success' : 'success',
            errors: errors.length ? errors : undefined
          };
        } catch (error) {
          console.error('Error processing notification:', error);
          await notificationService.markNotificationProcessed(notification.id, [error.message]);
          return { 
            id: notification.id, 
            status: 'error', 
            error: error.message 
          };
        }
      })
    );

    return new Response(
      JSON.stringify({ processed: results }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});