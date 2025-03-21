import { NextResponse } from 'next/server';
import EkiliRelay from 'ekilirelay';

const mailer = new EkiliRelay(process.env.EKILI_RELAY_API_KEY!);

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

    // Create HTML message
    const htmlMessage = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Send email
    const response = await mailer.sendEmail(
      process.env.CONTACT_EMAIL!, // Your company's email address
      `Contact Form: ${subject}`,
      htmlMessage,
      `From: ${name} <${email}>`
    );

    if (response.status === 'success') {
      // Send confirmation email to the user
      await mailer.sendEmail(
        email,
        'Thank you for contacting Ticket Africa',
        `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Here's a copy of your message:</p>
          <hr>
          <p><strong>Subject:</strong> ${subject}</p>
          <p>${message}</p>
          <hr>
          <p>Best regards,</p>
          <p>The Ticket Africa Team</p>
        `,
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
