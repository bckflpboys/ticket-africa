import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import Event from '@/models/Event';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    // Get all completed orders for the user with populated event details
    const orders = await Order.find({
      userId: session.user.id,
      paymentStatus: 'completed'
    }).populate({
      path: 'eventId',
      model: Event,
      select: 'name date venue image description'
    }).sort({ createdAt: -1 }); // Most recent orders first

    // Transform orders to include event details with tickets
    const tickets = orders.map(order => ({
      orderId: order._id,
      orderDate: order.createdAt,
      event: {
        _id: order.eventId._id,
        name: order.eventId.name,
        date: order.eventId.date,
        venue: order.eventId.venue,
        image: order.eventId.image,
        description: order.eventId.description
      },
      tickets: order.tickets,
      total: order.total,
      paymentReference: order.paymentReference
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
