import nodemailer from 'npm:nodemailer@6.9.10';
import { config } from './config.ts';
import { EmailContent } from './types.ts';

export class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.username,
        pass: config.smtp.password,
      },
    });
  }

  private async sendEmail(to: string, content: EmailContent): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: {
          name: config.smtp.senderName,
          address: config.smtp.username
        },
        to,
        subject: content.subject,
        text: content.text,
        html: content.html // Add HTML content
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendNotificationEmails(adminEmail: EmailContent, customerEmail: EmailContent, userEmail?: string): Promise<string[]> {
    const errors: string[] = [];
    
    // Send admin notification
    try {
      await this.sendEmail(config.smtp.adminEmail, adminEmail);
    } catch (error) {
      errors.push(`Failed to send admin email: ${error.message}`);
    }

    // Send customer notification if email exists
    if (userEmail) {
      try {
        await this.sendEmail(userEmail, customerEmail);
      } catch (error) {
        errors.push(`Failed to send customer email: ${error.message}`);
      }
    }

    return errors;
  }
}