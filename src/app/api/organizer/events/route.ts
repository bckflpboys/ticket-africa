import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import Event from '@/models/Event';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    console.log('Fetching organizer events...');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', { 
      authenticated: !!session, 
      userId: session?.user?.id,
      email: session?.user?.email 
    });

    if (!session?.user) {
      console.log('No authenticated user found');
      return NextResponse.json(
        { error: 'You must be logged in to view your events' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDB();
    console.log('Connected to database');

    // Find all events for this organizer
    const events = await Event.find({ 
      organizer: session.user.id 
    }).sort({ createdAt: -1 });

    console.log(`Found ${events.length} events for organizer`);

    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error in /api/organizer/events:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error.message },
      { status: 500 }
    );
  }
}
