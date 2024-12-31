import { EnrichedData, EmailContent } from '../types.ts';
import { getBookingTemplates } from './booking.ts';
import { getPackageTemplates } from './package.ts';
import { getSubscriptionTemplates } from './subscription.ts';

export function getEmailTemplates(type: string, data: EnrichedData): { 
  adminEmail: EmailContent;
  customerEmail: EmailContent;
} {
  if (type.startsWith('booking_')) {
    return getBookingTemplates(type, data);
  }
  
  if (type.startsWith('package_')) {
    return getPackageTemplates(type, data);
  }
  
  if (type.startsWith('subscription_')) {
    return getSubscriptionTemplates(type, data);
  }

  throw new Error(`Unknown notification type: ${type}`);
}