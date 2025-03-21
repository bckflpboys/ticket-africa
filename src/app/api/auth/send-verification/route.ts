import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import VerificationCode from '@/models/VerificationCode';
import EkiliRelay from 'ekilirelay';
import User from '@/models/User';

const mailer = new EkiliRelay(process.env.EKILI_RELAY_API_KEY!);

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const emailStyles = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #7C3AED; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
  .content { background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
  .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px; }
  .code { font-size: 32px; font-weight: bold; text-align: center; color: #7C3AED; margin: 20px 0; letter-spacing: 4px; }
`;

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Save code to database
    await VerificationCode.findOneAndUpdate(
      { email },
      { code },
      { upsert: true, new: true }
    );

    // Send verification email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Verify Your Email Address</h2>
            </div>
            <div class="content">
              <p>Hello${name ? ' ' + name : ''},</p>
              <p>Thank you for signing up with Ticket Africa. To complete your registration, please use the following verification code:</p>
              
              <div class="code">${code}</div>
              
              <p>This code will expire in 10 minutes for security reasons.</p>
              <p>If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>The Ticket Africa Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await mailer.sendEmail(
      email,
      'Verify Your Email - Ticket Africa',
      emailHtml,
      'From: Ticket Africa <noreply@ticketafrica.com>'
    );

    if (response.status !== 'success') {
      throw new Error('Failed to send verification email');
    }

    return NextResponse.json({ message: 'Verification code sent' });
  } catch (error: any) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
