import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { Types } from 'mongoose';

interface Ticket {
  _id: Types.ObjectId;
  ticketType: string;
  quantity: number;
  price: number;
  isScanned: boolean;
  scannedAt?: Date;
  scannedBy?: string;
}

interface OrderDocument {
  _id: Types.ObjectId;
  userId: string;
  eventId: Types.ObjectId;
  tickets: Ticket[];
  total: number;
  paymentReference: string;
  paymentStatus: string;
  paymentProvider: string;
  metadata: Record<string, any>;
  save(): Promise<OrderDocument>;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketId } = await req.json();
    
    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    // Parse the QR code content (format: orderId-paymentReference)
    const [orderId, paymentReference] = ticketId.split('-');

    if (!orderId || !paymentReference) {
      return NextResponse.json({ error: 'Invalid ticket format' }, { status: 400 });
    }

    await connectToDB();

    // Find order using both orderId and paymentReference
    const order = await Order.findOne({
      _id: orderId,
      paymentReference: paymentReference
    }) as OrderDocument | null;

    if (!order) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Check if payment is completed
    if (order.paymentStatus !== 'completed') {
      return NextResponse.json({ 
        error: 'Payment not completed for this ticket',
        paymentStatus: order.paymentStatus
      }, { status: 400 });
    }

    // Find an unscanned ticket in the order
    const ticket = order.tickets.find(t => !t.isScanned);

    if (!ticket) {
      return NextResponse.json({ 
        error: 'All tickets in this order have been scanned',
      }, { status: 400 });
    }

    // Update ticket status
    ticket.isScanned = true;
    ticket.scannedAt = new Date();
    ticket.scannedBy = session.user.email || '';
    await order.save();

    return NextResponse.json({ 
      success: true,
      message: 'Ticket successfully scanned',
      ticketDetails: {
        eventId: order.eventId.toString(),
        ticketType: ticket.ticketType,
        scannedAt: ticket.scannedAt,
        scannedBy: ticket.scannedBy
      }
    });

  } catch (error) {
    console.error('Error scanning ticket:', error);
    return NextResponse.json({ error: 'Failed to scan ticket' }, { status: 500 });
  }
}
