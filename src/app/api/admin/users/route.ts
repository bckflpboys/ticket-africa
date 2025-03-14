import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    
    const users = await User.find({})
      .select('name email phone image createdAt role tickets')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate tickets purchased for each user
    const usersWithStats = users.map(user => ({
      ...user,
      ticketsPurchased: user.tickets?.length || 0
    }));

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can modify user roles.' },
        { status: 401 }
      );
    }

    const { userId, newRole } = await request.json();

    if (!userId || !newRole || !['user', 'admin', 'organizer', 'staff', 'scanner'].includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid request. User ID and valid role are required.' },
        { status: 400 }
      );
    }

    await connectToDB();
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.role = newRole;
    await user.save();

    return NextResponse.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
