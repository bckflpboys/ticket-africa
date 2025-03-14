import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import Event from '@/models/Event';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { v2 as cloudinary } from 'cloudinary';

interface TicketType {
  name: string;
  price: number;
  quantity: number;
  quantitySold: number;
}

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
    
    const events = await Event.find({})
      .sort({ date: -1 })
      .lean();

    // Calculate tickets sold for each event
    const eventsWithStats = events.map(event => {
      const totalTickets = event.ticketTypes.reduce((sum: number, type: TicketType) => 
        sum + type.quantity, 0
      );
      const ticketsSold = event.ticketTypes.reduce((sum: number, type: TicketType) => 
        sum + (type.quantitySold || 0), 0
      );

      return {
        ...event,
        ticketsSold,
        totalTickets
      };
    });

    return NextResponse.json(eventsWithStats);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    const data = await request.json();

    const newEvent = new Event({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newEvent.save();

    return NextResponse.json({ 
      message: 'Event created successfully',
      eventId: newEvent._id 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
