import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Document, Types } from 'mongoose';

interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  image: string | null;
  role: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserResponse {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  image: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return data in the same format as PUT endpoint
    return NextResponse.json({
      message: 'Profile fetched successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        image: user.image || ''
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Error fetching profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    console.log('Received data:', data);

    await connectToDB();
    console.log('Connected to DB');

    // Update using updateOne
    const result = await User.updateOne(
      { email: session.user.email },
      {
        $set: {
          name: data.name,
          phone: data.phone || null,
          location: data.location || null,
          bio: data.bio || null,
          updatedAt: new Date()
        }
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch the updated user
    const updatedUser = await User.findOne({ email: session.user.email });
    console.log('Updated user:', updatedUser);

    if (!updatedUser) {
      return NextResponse.json({ message: 'Error fetching updated user' }, { status: 500 });
    }

    // Return the updated user data
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        location: updatedUser.location || '',
        bio: updatedUser.bio || '',
        image: updatedUser.image || ''
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Error updating profile' },
      { status: 500 }
    );
  }
}
