import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import mongoose from 'mongoose';

interface CartItem {
  eventId: string;
  name?: string;
  ticketType?: string;
  quantity?: number;
  price: number;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reference = req.nextUrl.searchParams.get('reference');
    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
    }

    await connectToDB();

    // Check if order already exists
    const existingOrder = await Order.findOne({ paymentReference: reference });
    if (existingOrder) {
      return NextResponse.json({
        status: existingOrder.paymentStatus === 'completed' ? 'success' : 'error',
        message: `Payment ${existingOrder.paymentStatus}`,
        order: existingOrder
      });
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment with Paystack');
    }

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      // Get metadata from Paystack response
      const metadata = data.data.metadata || {};
      const items = JSON.parse(metadata.items || '[]') as CartItem[];
      const amount = data.data.amount / 100; // Convert from kobo to ZAR

      // Get the first item's eventId (assuming all items are for the same event)
      const eventId = items[0]?.eventId;
      if (!eventId) {
        throw new Error('Event ID not found in payment metadata');
      }

      // Create order with completed status
      const order = await Order.create({
        userId: session.user.id,
        eventId: new mongoose.Types.ObjectId(eventId),
        tickets: items.map((item: CartItem) => ({
          ticketType: item.name || item.ticketType || 'Unknown',
          quantity: item.quantity || 1,
          price: item.price
        })),
        total: amount,
        paymentReference: reference,
        paymentStatus: 'completed',
        paymentProvider: 'paystack',
        metadata: data.data.metadata
      });

      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        order
      });
    } else {
      // Payment failed, create order with failed status
      const metadata = data.data.metadata || {};
      const items = JSON.parse(metadata.items || '[]') as CartItem[];
      const amount = data.data.amount / 100;
      const eventId = items[0]?.eventId;

      if (!eventId) {
        throw new Error('Event ID not found in payment metadata');
      }

      const order = await Order.create({
        userId: session.user.id,
        eventId: new mongoose.Types.ObjectId(eventId),
        tickets: items.map((item: CartItem) => ({
          ticketType: item.name || item.ticketType || 'Unknown',
          quantity: item.quantity || 1,
          price: item.price
        })),
        total: amount,
        paymentReference: reference,
        paymentStatus: 'failed',
        paymentProvider: 'paystack',
        metadata: data.data.metadata
      });

      return NextResponse.json({
        status: 'error',
        message: 'Payment verification failed',
        order
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
