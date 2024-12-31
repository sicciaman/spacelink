import { EnrichedData, EmailContent } from '../types.ts';
import { createHtmlEmail } from './common.ts';
import { formatDate } from '../utils.ts';

export function getSubscriptionTemplates(type: string, data: EnrichedData): {
  adminEmail: EmailContent;
  customerEmail: EmailContent;
} {
  switch (type) {
    case 'subscription_expiring_soon':
      return {
        adminEmail: {
          subject: `Prime Subscription Expiring Soon - ${data.user_email}`,
          text: `A Prime subscription is expiring soon:\n\nUser: ${data.user_email}\nExpires: ${formatDate(data.expires_at)}`,
          html: createHtmlEmail(
            'Prime Subscription Expiring Soon',
            `<div class="subscription-details warning">
              <p>A Prime subscription is expiring soon:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Expires:</td><td>${formatDate(data.expires_at)}</td></tr>
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: 'Your SpaceLink Prime Subscription is Expiring Soon',
          text: `Dear Customer,\n\nYour SpaceLink Prime subscription will expire on ${formatDate(data.expires_at)}.\n\nTo continue enjoying Prime benefits and bundle discounts, please renew your subscription.\n\nThank you for choosing SpaceLink!`,
          html: createHtmlEmail(
            'Your Prime Subscription is Expiring Soon',
            `<div class="subscription-details warning">
              <p>Your SpaceLink Prime subscription will expire on <strong>${formatDate(data.expires_at)}</strong>.</p>
              <p>Renew now to continue enjoying these Prime benefits:</p>
              <ul>
                <li>Access to cost-saving bundles</li>
                <li>Priority booking slots</li>
                <li>Extended scheduling options</li>
                <li>Premium support</li>
              </ul>
            </div>`
          )
        }
      };

    case 'subscription_expired':
      return {
        adminEmail: {
          subject: `Prime Subscription Expired - ${data.user_email}`,
          text: `A Prime subscription has expired:\n\nUser: ${data.user_email}\nExpired: ${formatDate(data.expired_at)}`,
          html: createHtmlEmail(
            'Prime Subscription Expired',
            `<div class="subscription-details alert">
              <p>A Prime subscription has expired:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Expired:</td><td>${formatDate(data.expired_at)}</td></tr>
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: 'Your SpaceLink Prime Subscription Has Expired',
          text: `Dear Customer,\n\nYour SpaceLink Prime subscription has expired. You will no longer have access to bundle pricing and priority features.\n\nRenew your subscription to continue enjoying these benefits.\n\nThank you for choosing SpaceLink!`,
          html: createHtmlEmail(
            'Your Prime Subscription Has Expired',
            `<div class="subscription-details alert">
              <p>Your SpaceLink Prime subscription has expired. You no longer have access to:</p>
              <ul>
                <li>Bundle pricing</li>
                <li>Priority booking</li>
                <li>Extended scheduling options</li>
                <li>Premium support</li>
              </ul>
              <p>Renew your subscription to regain access to all Prime features.</p>
            </div>`
          )
        }
      };

    default:
      throw new Error(`Unknown subscription notification type: ${type}`);
  }
}