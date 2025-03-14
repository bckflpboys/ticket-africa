import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

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

    await connectToDB();

    const order = await Order.findOne({ 'paymentReference': ticketId });

    if (!order) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (order.tickets[0].isScanned) {
      return NextResponse.json({ 
        error: 'Ticket already scanned',
        scannedAt: order.tickets[0].scannedAt,
        scannedBy: order.tickets[0].scannedBy
      }, { status: 400 });
    }

    // Update ticket status
    order.tickets[0].isScanned = true;
    order.tickets[0].scannedAt = new Date();
    order.tickets[0].scannedBy = session.user.email;
    await order.save();

    return NextResponse.json({ 
      success: true,
      message: 'Ticket successfully scanned',
      ticketDetails: {
        eventId: order.eventId,
        ticketType: order.tickets[0].ticketType,
        scannedAt: order.tickets[0].scannedAt,
        scannedBy: order.tickets[0].scannedBy
      }
    });

  } catch (error) {
    console.error('Error scanning ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
