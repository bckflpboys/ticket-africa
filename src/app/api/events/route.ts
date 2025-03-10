import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import Event from '@/models/Event';
import { authOptions } from '../auth/[...nextauth]/auth.config';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  let requestBody: any;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to create an event' },
        { status: 401 }
      );
    }

    requestBody = await req.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'endTime', 'location', 'category', 'images', 'ticketTypes'];
    const missingFields = requiredFields.filter(field => !requestBody[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate images array
    if (!Array.isArray(requestBody.images)) {
      return NextResponse.json(
        { error: 'Images must be an array' },
        { status: 400 }
      );
    }

    // Filter out any null or invalid image URLs
    requestBody.images = requestBody.images.filter((url: string | null) => typeof url === 'string' && url.startsWith('http'));

    if (requestBody.images.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid image URL is required' },
        { status: 400 }
      );
    }

    if (requestBody.images.length > 6) {
      return NextResponse.json(
        { error: 'Maximum of 6 images allowed' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDB();

    // Create new event
    const event = await Event.create({
      ...requestBody,
      organizer: session.user.id,
      status: 'draft',
    });

    return NextResponse.json({
      id: event._id.toString(),
      ...event.toJSON()
    });
  } catch (error: any) {
    console.error('Error creating event:', {
      message: error.message,
      name: error.name,
      errors: error.errors,
      body: requestBody
    });

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    // Log the full error for debugging
    console.error('Full error:', error);

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
