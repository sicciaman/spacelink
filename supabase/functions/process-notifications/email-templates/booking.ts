import { EnrichedData, EmailContent } from '../types.ts';
import { createHtmlEmail } from './common.ts';
import { formatDate } from '../utils.ts';

export function getBookingTemplates(type: string, data: EnrichedData): {
  adminEmail: EmailContent;
  customerEmail: EmailContent;
} {
  switch (type) {
    case 'booking_created':
      return {
        adminEmail: {
          subject: `New Booking Created - ${data.channel_name}`,
          text: `A new booking has been created:\n\nUser: ${data.user_email}\nChannel: ${data.channel_name}\nDate: ${formatDate(data.booking_date)}\nProduct: ${data.product_link}\n${data.coupon ? `Coupon: ${data.coupon}\n` : ''}Original Price: €${data.start_price}\nDiscounted Price: €${data.discount_price}`,
          html: createHtmlEmail(
            'New Booking Created',
            `<div class="booking-details">
              <p>A new booking has been created:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Channel:</td><td>${data.channel_name}</td></tr>
                <tr><td>Date:</td><td>${formatDate(data.booking_date)}</td></tr>
                <tr><td>Product:</td><td><a href="${data.product_link}">${data.product_link}</a></td></tr>
                ${data.coupon ? `<tr><td>Coupon:</td><td><code>${data.coupon}</code></td></tr>` : ''}
                <tr><td>Original Price:</td><td>€${data.start_price}</td></tr>
                <tr><td>Discounted Price:</td><td>€${data.discount_price}</td></tr>
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: `Booking Confirmation - ${data.channel_name}`,
          text: `Dear Customer,\n\nYour booking has been confirmed:\n\nChannel: ${data.channel_name}\nDate: ${formatDate(data.booking_date)}\nProduct: ${data.product_link}\n${data.coupon ? `Coupon: ${data.coupon}\n` : ''}Price: €${data.discount_price}\n\nThank you for choosing SpaceLink!`,
          html: createHtmlEmail(
            'Booking Confirmation',
            `<div class="booking-details">
              <p>Your booking has been confirmed:</p>
              <table>
                <tr><td>Channel:</td><td>${data.channel_name}</td></tr>
                <tr><td>Date:</td><td>${formatDate(data.booking_date)}</td></tr>
                <tr><td>Product:</td><td><a href="${data.product_link}">${data.product_link}</a></td></tr>
                ${data.coupon ? `<tr><td>Coupon:</td><td><code>${data.coupon}</code></td></tr>` : ''}
                <tr><td>Price:</td><td>€${data.discount_price}</td></tr>
              </table>
            </div>`
          )
        }
      };

    case 'booking_cancelled':
      return {
        adminEmail: {
          subject: `Booking Cancelled - ${data.channel_name}`,
          text: `A booking has been cancelled:\n\nUser: ${data.user_email}\nChannel: ${data.channel_name}\nOriginal Date: ${formatDate(data.booking_date)}\nCancelled At: ${formatDate(data.cancelled_at)}`,
          html: createHtmlEmail(
            'Booking Cancelled',
            `<div class="booking-details alert">
              <p>A booking has been cancelled:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Channel:</td><td>${data.channel_name}</td></tr>
                <tr><td>Original Date:</td><td>${formatDate(data.booking_date)}</td></tr>
                <tr><td>Cancelled At:</td><td>${formatDate(data.cancelled_at)}</td></tr>
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: `Booking Cancellation - ${data.channel_name}`,
          text: `Dear Customer,\n\nYour booking has been cancelled:\n\nChannel: ${data.channel_name}\nOriginal Date: ${formatDate(data.booking_date)}\nCancelled At: ${formatDate(data.cancelled_at)}\n\nThe post slot has been returned to your package.\n\nThank you for choosing SpaceLink!`,
          html: createHtmlEmail(
            'Booking Cancellation',
            `<div class="booking-details alert">
              <p>Your booking has been cancelled:</p>
              <table>
                <tr><td>Channel:</td><td>${data.channel_name}</td></tr>
                <tr><td>Original Date:</td><td>${formatDate(data.booking_date)}</td></tr>
                <tr><td>Cancelled At:</td><td>${formatDate(data.cancelled_at)}</td></tr>
              </table>
              <p>The post slot has been returned to your package.</p>
            </div>`
          )
        }
      };

    case 'booking_updated':
      return {
        adminEmail: {
          subject: `Booking Updated - ${data.channel_name}`,
          text: `A booking has been updated:\n\nUser: ${data.user_email}\nChannel: ${data.channel_name}\nDate: ${formatDate(data.booking_date)}\n\nChanges:\n${Object.entries(data.changes).map(([key, value]: [string, any]) => {
            if (value.old !== value.new) {
              return `${key}: ${value.old || 'none'} → ${value.new || 'none'}`
            }
            return null;
          }).filter(Boolean).join('\n')}`,
          html: createHtmlEmail(
            'Booking Updated',
            `<div class="booking-details warning">
              <p>A booking has been updated:</p>
              <table>
                <tr><td>User:</td><td>${data.user_email}</td></tr>
                <tr><td>Channel:</td><td>${data.channel_name}</td></tr>
                <tr><td>Date:</td><td>${formatDate(data.booking_date)}</td></tr>
              </table>
              <h4 class="mt-4 mb-2">Changes:</h4>
              <table>
                ${Object.entries(data.changes).map(([key, value]: [string, any]) => {
                  if (value.old !== value.new) {
                    return `
                      <tr>
                        <td>${key}:</td>
                        <td>
                          <del>${value.old || 'none'}</del>
                          <ins>${value.new || 'none'}</ins>
                        </td>
                      </tr>
                    `;
                  }
                  return '';
                }).join('')}
              </table>
            </div>`
          )
        },
        customerEmail: {
          subject: `Booking Update - ${data.channel_name}`,
          text: `Dear Customer,\n\nYour booking has been updated:\n\nChannel: ${data.channel_name}\nDate: ${formatDate(data.booking_date)}\n\nUpdated Details:\n${Object.entries(data.changes).map(([key, value]: [string, any]) => {
            if (value.old !== value.new) {
              return `${key}: ${value.new || 'none'}`
            }
            return null;
          }).filter(Boolean).join('\n')}`,
          html: createHtmlEmail(
            'Booking Update',
            `<div class="booking-details warning">
              <p>Your booking has been updated:</p>
              <table>
                <tr><td>Channel:</td><td>${data.channel_name}</td></tr>
                <tr><td>Date:</td><td>${formatDate(data.booking_date)}</td></tr>
              </table>
              <h4 class="mt-4 mb-2">Updated Details:</h4>
              <table>
                ${Object.entries(data.changes).map(([key, value]: [string, any]) => {
                  if (value.old !== value.new) {
                    return `
                      <tr>
                        <td>${key}:</td>
                        <td><span class="highlight">${value.new || 'none'}</span></td>
                      </tr>
                    `;
                  }
                  return '';
                }).join('')}
              </table>
            </div>`
          )
        }
      };

    default:
      throw new Error(`Unknown booking notification type: ${type}`);
  }
}