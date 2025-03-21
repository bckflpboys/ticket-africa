import { NextResponse } from 'next/server';
import EkiliRelay from 'ekilirelay';

const mailer = new EkiliRelay(process.env.EKILI_RELAY_API_KEY!);

// Shared email styles
const emailStyles = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #7C3AED; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
  .content { background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
  .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px; }
  .message-box { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; }
  .button { display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
  .info-row { margin: 10px 0; }
  .info-label { font-weight: bold; color: #4B5563; }
`;

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate the input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Support team notification email
    const supportEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="info-label">From:</span> ${name}
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span> ${email}
              </div>
              <div class="info-row">
                <span class="info-label">Subject:</span> ${subject}
              </div>
              <div class="message-box">
                <span class="info-label">Message:</span><br>
                ${message.replace(/\n/g, '<br>')}
              </div>
              <a href="mailto:${email}" class="button">Reply to ${name}</a>
            </div>
            <div class="footer">
              <p>This message was sent from the Ticket Africa contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // User confirmation email
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You for Contacting Ticket Africa</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
              
              <div class="message-box">
                <h3>Your Message Details:</h3>
                <div class="info-row">
                  <span class="info-label">Subject:</span> ${subject}
                </div>
                <div class="info-row">
                  <span class="info-label">Message:</span><br>
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <p>Our team typically responds within 24 hours during business days.</p>
              
              <p>In the meantime, you can:</p>
              <ul>
                <li>Visit our <a href="https://ticketafrica.com/events" style="color: #7C3AED;">Events Page</a></li>
                <li>Check our <a href="https://ticketafrica.com/faq" style="color: #7C3AED;">FAQ Section</a></li>
                <li>Follow us on social media for updates</li>
              </ul>
            </div>
            <div class="footer">
              <p>Best regards,<br>The Ticket Africa Team</p>
              <small>This is an automated message, please do not reply directly to this email.</small>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to support team
    const response = await mailer.sendEmail(
      process.env.CONTACT_EMAIL!,
      `Contact Form: ${subject}`,
      supportEmailHtml,
      `From: ${name} <${email}>`
    );

    if (response.status === 'success') {
      // Send confirmation email to user
      await mailer.sendEmail(
        email,
        'Thank you for contacting Ticket Africa',
        userEmailHtml,
        'From: Ticket Africa <noreply@ticketafrica.com>'
      );

      return NextResponse.json({ message: 'Email sent successfully' });
    } else {
      throw new Error(response.message || 'Failed to send email');
    }
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
