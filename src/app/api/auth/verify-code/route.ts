import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import VerificationCode from '@/models/VerificationCode';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the verification code
    const verificationCode = await VerificationCode.findOne({ email });

    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Verification code not found or expired' },
        { status: 400 }
      );
    }

    // Check if the code matches
    if (verificationCode.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Delete the verification code after successful verification
    await VerificationCode.deleteOne({ email });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error: any) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
