import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { connectToDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import Event from '@/models/Event';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log('No user session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    // Try both string ID and ObjectId in the query
    const userId = session.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const orders = await Order.find({
      $or: [
        { userId: userId },
        { userId: userObjectId }
      ],
      paymentStatus: 'completed'
    }).populate({
      path: 'eventId',
      model: Event,
      select: 'name date venue'
    }).lean();

    console.log('Query with both ID types:', { 
      stringId: userId, 
      objectId: userObjectId.toString(),
      orderCount: orders.length 
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ tickets: [] });
    }

    // Transform orders to include event details with tickets
    const tickets = orders.map((order: any) => ({
      orderId: order._id.toString(),
      orderDate: order.createdAt,
      event: order.eventId ? {
        _id: order.eventId._id.toString(),
        name: order.eventId.name,
        date: order.eventId.date,
        venue: order.eventId.venue,
      } : null,
      tickets: order.tickets,
      total: order.total,
      paymentReference: order.paymentReference,
      paymentStatus: order.paymentStatus
    }));

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}
