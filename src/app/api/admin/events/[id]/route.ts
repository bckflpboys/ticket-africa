import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import Event from '@/models/Event';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    await connectToDB();

    // Find the event first to get its images
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    const deletePromises = event.images.map(async (imageUrl: string) => {
      try {
        // Extract public_id from the Cloudinary URL
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`events/${publicId}`);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with deletion even if image deletion fails
      }
    });

    // Wait for all image deletions to complete
    await Promise.all(deletePromises);

    // Delete the event from the database
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: 'Event deleted successfully',
      deletedEventId: id
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
