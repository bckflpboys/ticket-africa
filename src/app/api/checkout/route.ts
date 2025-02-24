import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, tickets, coolerBox, total } = await req.json();

    const { db } = await connectToDatabase();

    // Fetch event details
    const event = await db.collection('events').findOne({
      _id: new ObjectId(eventId)
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Validate ticket quantities
    for (const [ticketId, quantity] of Object.entries(tickets)) {
      const ticketType = event.ticketTypes.find(
        (t: any) => t._id.toString() === ticketId
      );

      if (!ticketType) {
        return NextResponse.json(
          { error: 'Invalid ticket type' },
          { status: 400 }
        );
      }

      const availableQuantity = ticketType.quantity - (ticketType.quantitySold || 0);
      if (quantity > availableQuantity) {
        return NextResponse.json(
          { error: `Not enough ${ticketType.name} tickets available` },
          { status: 400 }
        );
      }
    }

    // Create order in database
    const order = await db.collection('orders').insertOne({
      userId: session.user.id,
      eventId: new ObjectId(eventId),
      tickets,
      coolerBox,
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Initialize payment with your payment provider
    const paymentProvider = process.env.PAYMENT_PROVIDER || 'paystack';
    let checkoutUrl = '';

    if (paymentProvider === 'stripe') {
      checkoutUrl = `/api/payments/stripe/create-checkout-session?orderId=${order.insertedId}`;
    } else if (paymentProvider === 'paystack') {
      checkoutUrl = `/api/payments/paystack/initialize?orderId=${order.insertedId}`;
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
