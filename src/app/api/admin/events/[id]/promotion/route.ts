import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import Event from '@/models/Event';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin role
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { isFeatured, isBanner, promotionStartDate, promotionEndDate } = await request.json();
    
    console.log('Received promotion update request:', {
      id,
      isFeatured,
      isBanner,
      promotionStartDate,
      promotionEndDate
    });

    await connectToDB();
    
    // Get the current event state
    const currentEvent = await Event.findById(id);
    
    if (!currentEvent) {
      console.log('Event not found:', id);
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    console.log('Current event state:', {
      id: currentEvent._id,
      isFeatured: currentEvent.isFeatured,
      isBanner: currentEvent.isBanner,
      promotionStartDate: currentEvent.promotionStartDate,
      promotionEndDate: currentEvent.promotionEndDate
    });

    // Update fields
    let updateFields: any = {
      $set: {
        isFeatured,
        isBanner,
        promotionStartDate,
        promotionEndDate,
        lastUpdated: new Date().toISOString()
      }
    };

    // Handle Featured status change
    if (currentEvent.isFeatured && !isFeatured) {
      const startDate = new Date(currentEvent.promotionStartDate || currentEvent.promotionHistory?.[currentEvent.promotionHistory.length - 1]?.startDate || new Date());
      const endDate = new Date();
      const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      updateFields.$set.wasFeatured = true;
      updateFields.$set.lastFeaturedDate = new Date().toISOString();
      updateFields.$set.totalFeaturedDuration = (currentEvent.totalFeaturedDuration || 0) + durationInDays;
    }

    // Handle Banner status change
    if (currentEvent.isBanner && !isBanner) {
      const startDate = new Date(currentEvent.promotionStartDate || currentEvent.promotionHistory?.[currentEvent.promotionHistory.length - 1]?.startDate || new Date());
      const endDate = new Date();
      const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      updateFields.$set.wasBanner = true;
      updateFields.$set.lastBannerDate = new Date().toISOString();
      updateFields.$set.totalBannerDuration = (currentEvent.totalBannerDuration || 0) + durationInDays;
    }

    // Add new promotion to history if starting a new promotion
    if ((!currentEvent.isFeatured && isFeatured) || (!currentEvent.isBanner && isBanner)) {
      const newPromotion = {
        type: isFeatured ? 'featured' : 'banner',
        startDate: promotionStartDate,
        endDate: promotionEndDate,
        duration: Math.ceil((new Date(promotionEndDate).getTime() - new Date(promotionStartDate).getTime()) / (1000 * 60 * 60 * 24))
      };

      updateFields.$push = {
        promotionHistory: newPromotion
      };
    }

    console.log('Update fields:', updateFields);

    // Update the event with promotion details
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedEvent) {
      console.log('Failed to update event:', id);
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    console.log('Event updated successfully:', {
      id: updatedEvent._id,
      isFeatured: updatedEvent.isFeatured,
      isBanner: updatedEvent.isBanner,
      promotionStartDate: updatedEvent.promotionStartDate,
      promotionEndDate: updatedEvent.promotionEndDate
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating promotion status:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion status' },
      { status: 500 }
    );
  }
}
