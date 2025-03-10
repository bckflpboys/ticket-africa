import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { connectToDB } from '@/lib/mongoose';
import Event from '@/models/Event';

export async function PATCH(
  request: Request,
  context: {
    params: {
      id: string;
    }
  }
) {
  try {
    // Get and validate the ID parameter
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to activate events' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDB();

    // Find and update the event status to active
    const event = await Event.findOneAndUpdate(
      { 
        _id: id,
        organizer: session.user.id,
        status: 'draft'
      },
      { 
        $set: { 
          status: 'active',
          updatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or you are not authorized to activate it' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Event activated successfully',
      event: {
        _id: event._id,
        status: event.status
      }
    });
  } catch (error) {
    console.error('Error activating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
