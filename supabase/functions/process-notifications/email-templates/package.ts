import { EnrichedData, EmailContent } from '../types.ts';
import { createHtmlEmail } from './common.ts';
import { formatDate } from '../utils.ts';

export function getPackageTemplates(type: string, data: EnrichedData): {
  adminEmail: EmailContent;
  customerEmail: EmailContent;
} {
  switch (type) {
    case 'package_purchased':
      return {
        adminEmail: {
          subject: `New Package Purchase - ${data.package_name}`,
          text: `A new package has been purchased:\n\nUser: ${data.user_email}\nPackage: ${data.package_name}\nAmount Paid: €${data.amount_paid}\nPosts: ${data.posts_remaining}`,
          html: createHtmlEmail(
            'New Package Purchase',
            `<div class="package-details">
              <p>A new package has been purchased:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Package:</td><td>${data.package_name}</td></tr>
                <tr><td>Amount Paid:</td><td>€${data.amount_paid}</td></tr>
                <tr><td>Posts:</td><td>${data.posts_remaining}</td></tr>
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: `Package Purchase Confirmation - ${data.package_name}`,
          text: `Dear Customer,\n\nThank you for your purchase!\n\nPackage: ${data.package_name}\nAmount Paid: €${data.amount_paid}\nAvailable Posts: ${data.posts_remaining}\n\nYou can now start booking your posts using this package.\nThank you for choosing SpaceLink!`,
          html: createHtmlEmail(
            'Package Purchase Confirmation',
            `<div class="package-details">
              <p>Thank you for your purchase!</p>
              <table>
                <tr><td>Package:</td><td>${data.package_name}</td></tr>
                <tr><td>Amount Paid:</td><td>€${data.amount_paid}</td></tr>
                <tr><td>Available Posts:</td><td>${data.posts_remaining}</td></tr>
              </table>
              <p>You can now start booking your posts using this package.</p>
            </div>`
          )
        }
      };

    case 'package_expiring_soon':
      return {
        adminEmail: {
          subject: `Package Expiring Soon - ${data.package_name}`,
          text: `A package is expiring soon:\n\nUser: ${data.user_email}\nPackage: ${data.package_name}\nPosts Remaining: ${data.posts_remaining}\nExpires: ${formatDate(data.expires_at)}`,
          html: createHtmlEmail(
            'Package Expiring Soon',
            `<div class="package-details warning">
              <p>A package is expiring soon:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Package:</td><td>${data.package_name}</td></tr>
                <tr><td>Posts Remaining:</td><td>${data.posts_remaining}</td></tr>
                <tr><td>Expires:</td><td>${formatDate(data.expires_at)}</td></tr>
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: 'Your Package is Expiring Soon',
          text: `Dear Customer,\n\nYour ${data.package_name} package with ${data.posts_remaining} posts remaining will expire on ${formatDate(data.expires_at)}.\n\nMake sure to use your remaining posts before they expire!\n\nThank you for choosing SpaceLink!`,
          html: createHtmlEmail(
            'Your Package is Expiring Soon',
            `<div class="package-details warning">
              <p>Your package is expiring soon:</p>
              <table>
                <tr><td>Package:</td><td>${data.package_name}</td></tr>
                <tr><td>Posts Remaining:</td><td>${data.posts_remaining}</td></tr>
                <tr><td>Expires:</td><td>${formatDate(data.expires_at)}</td></tr>
              </table>
              <p>Make sure to use your remaining posts before they expire!</p>
            </div>`
          )
        }
      };

    case 'package_expired':
      return {
        adminEmail: {
          subject: `Package Expired - ${data.package_name}`,
          text: `A package has expired:\n\nUser: ${data.user_email}\nPackage: ${data.package_name}\nUnused Posts: ${data.remaining_posts}\nExpired: ${formatDate(data.expired_at)}`,
          html: createHtmlEmail(
            'Package Expired',
            `<div class="package-details alert">
              <p>A package has expired:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Package:</td><td>${data.package_name}</td></tr>
                <tr><td>Unused Posts:</td><td>${data.remaining_posts}</td></tr>
                <tr><td>Expired:</td><td>${formatDate(data.expired_at)}</td></tr>
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: 'Your Package Has Expired',
          text: `Dear Customer,\n\nYour ${data.package_name} package has expired with ${data.remaining_posts} unused posts.\n\nTo continue posting, please purchase a new package.\n\nThank you for choosing SpaceLink!`,
          html: createHtmlEmail(
            'Your Package Has Expired',
            `<div class="package-details alert">
              <p>Your package has expired:</p>
              <table>
                <tr><td>Package:</td><td>${data.package_name}</td></tr>
                <tr><td>Unused Posts:</td><td>${data.remaining_posts}</td></tr>
                <tr><td>Expired:</td><td>${formatDate(data.expired_at)}</td></tr>
              </table>
              <p>To continue posting, please purchase a new package.</p>
            </div>`
          )
        }
      };

    default:
      throw new Error(`Unknown package notification type: ${type}`);
  }
}