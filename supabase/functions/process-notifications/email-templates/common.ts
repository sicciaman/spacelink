export function createHtmlEmail(title: string, content: string, ctaText?: string, ctaUrl?: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6; 
            color: #1F2937;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            background-color: #F3F4F6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            padding: 24px;
            background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
            border-radius: 12px;
          }
          .content { 
            background: #fff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .footer { 
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #E5E7EB;
            font-size: 12px;
            color: #6B7280;
          }
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 20px 0;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #E5E7EB;
            vertical-align: top;
          }
          td:first-child {
            font-weight: 600;
            width: 140px;
            color: #4B5563;
          }
          .button {
            display: inline-block;
            background: #2563EB;
            color: white;
            padding: 14px 28px;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 24px;
            font-weight: 500;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          .button:hover {
            background: #1D4ED8;
          }
          .warning {
            border-left: 4px solid #FBBF24;
            padding: 16px 20px;
            background: #FFFBEB;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
          }
          .alert {
            border-left: 4px solid #EF4444;
            padding: 16px 20px;
            background: #FEF2F2;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
          }
          code {
            background: #F3F4F6;
            padding: 3px 6px;
            border-radius: 4px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.9em;
          }
          del {
            color: #DC2626;
            background: #FEE2E2;
            padding: 2px 4px;
            border-radius: 4px;
            text-decoration: line-through;
          }
          ins {
            color: #059669;
            background: #ECFDF5;
            padding: 2px 4px;
            border-radius: 4px;
            text-decoration: none;
          }
          ul {
            margin: 16px 0;
            padding-left: 24px;
          }
          li {
            margin: 8px 0;
            color: #4B5563;
            padding-left: 8px;
          }
          .highlight {
            background: #DBEAFE;
            padding: 2px 4px;
            border-radius: 4px;
            font-weight: 500;
          }
          @media (max-width: 600px) {
            .container {
              padding: 12px;
            }
            .content {
              padding: 20px;
            }
            td {
              display: block;
              width: 100%;
            }
            td:first-child {
              padding-bottom: 4px;
              border-bottom: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #1E3A8A; margin: 0; font-size: 24px;">${title}</h1>
          </div>
          <div class="content">
            ${content}
            ${ctaText && ctaUrl ? `
              <div style="text-align: center; margin-top: 32px;">
                <a href="${ctaUrl}" class="button">${ctaText}</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} SpaceLink. All rights reserved.</p>
            <p style="color: #9CA3AF; margin-top: 8px;">
              This email was sent by SpaceLink. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}