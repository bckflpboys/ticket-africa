import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { connectToDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import Event from '@/models/Event';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    // Get the order with populated event details
    const order = await Order.findOne({
      _id: params.id,
      userId: session.user.id // Ensure user can only access their own tickets
    }).populate({
      path: 'eventId',
      model: Event,
      select: 'name date venue image description'
    });

    if (!order) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Transform order data
    const ticket = {
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
      paymentReference: order.paymentReference,
      paymentStatus: order.paymentStatus
    };

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}
