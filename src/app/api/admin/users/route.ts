import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    await connectToDB();
    
    let query = User.find({});

    // Apply search filter
    if (search) {
      query = query.or([
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]);
    }

    // Apply role filter
    if (role && role !== 'all') {
      query = query.where('role').equals(role);
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Apply pagination
    const users = await query
      .select('name email phone image createdAt role tickets lastLogin')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Calculate tickets purchased for each user
    const usersWithStats = users.map(user => ({
      ...user,
      ticketsPurchased: user.tickets?.length || 0
    }));

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
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
