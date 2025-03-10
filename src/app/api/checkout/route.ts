import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Event from '@/models/Event';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, tickets, coolerBox, total } = await req.json();

    await connectToDB();

    // Fetch event details
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Validate ticket quantities
    for (const [ticketId, quantity] of Object.entries(tickets as { [key: string]: number })) {
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
      if (Number(quantity) > availableQuantity) {
        return NextResponse.json(
          { error: `Not enough ${ticketType.name} tickets available` },
          { status: 400 }
        );
      }
    }

    // Create order in database
    const order = await Order.create({
      userId: session.user.id,
      eventId,
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
      checkoutUrl = `/api/payments/stripe/create-checkout-session?orderId=${order._id}`;
    } else if (paymentProvider === 'paystack') {
      checkoutUrl = `/api/payments/paystack/initialize?orderId=${order._id}`;
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
