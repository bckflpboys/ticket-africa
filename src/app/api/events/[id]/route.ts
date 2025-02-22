import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Event from '@/models/Event';

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await connectToDB();
    
    const event = await Event.findById(id)
      .populate('organizer', 'name email image')
      .exec();

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
