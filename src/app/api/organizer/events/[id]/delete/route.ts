import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongoose';
import Event from '@/models/Event';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Get and validate the ID parameter
    const { id } = await Promise.resolve(context.params);
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
        { error: 'You must be logged in to delete events' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDB();

    // Find the event first to get image URLs
    const event = await Event.findOne({ 
      _id: id,
      organizer: session.user.id
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or you are not authorized to delete it' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    if (event.images && event.images.length > 0) {
      for (const imageUrl of event.images) {
        try {
          // Extract public_id from the URL
          const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
          await cloudinary.uploader.destroy(`events/${publicId}`);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    // Delete the event from database
    await Event.findOneAndDelete({ 
      _id: id,
      organizer: session.user.id
    });

    return NextResponse.json({ 
      message: 'Event and associated images deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
