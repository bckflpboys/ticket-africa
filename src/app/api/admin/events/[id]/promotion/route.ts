import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import Event from '@/models/Event';
import mongoose from 'mongoose';

export async function PATCH(
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
    const body = await request.json();
    
    console.log('Received promotion update request:', {
      id,
      isFeatured: body.isFeatured,
      isBanner: body.isBanner,
      featuredStartDate: body.featuredStartDate,
      featuredEndDate: body.featuredEndDate,
      bannerStartDate: body.bannerStartDate,
      bannerEndDate: body.bannerEndDate
    });

    await connectToDB();

    // Get the current event state
    const currentEvent = await Event.findById(id).lean() as any;
    
    if (!currentEvent) {
      console.log('Event not found:', id);
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Update promotion fields directly on the existing event
    const result = await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          isFeatured: body.isFeatured,
          isBanner: body.isBanner,
          featuredStartDate: body.featuredStartDate,
          featuredEndDate: body.featuredEndDate,
          bannerStartDate: body.bannerStartDate,
          bannerEndDate: body.bannerEndDate
        }
      },
      { new: true }
    );

    if (!result) {
      console.log('Failed to update event:', id);
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    // Handle Featured status
    if (body.isFeatured && body.featuredStartDate && body.featuredEndDate) {
      const duration = Math.ceil((new Date(body.featuredEndDate).getTime() - new Date(body.featuredStartDate).getTime()) / (1000 * 60 * 60 * 24));
      
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            'currentPromotion.type': 'featured',
            'currentPromotion.startDate': new Date(body.featuredStartDate),
            'currentPromotion.endDate': new Date(body.featuredEndDate),
            'currentPromotion.duration': duration
          }
        }
      );

      // Add to promotion history
      const newPromotion = {
        type: 'featured',
        startDate: new Date(body.featuredStartDate),
        endDate: new Date(body.featuredEndDate),
        duration
      };

      await Event.findByIdAndUpdate(
        id,
        {
          $push: {
            promotionHistory: newPromotion
          }
        }
      );
    } else if (body.isFeatured === false) {
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            isFeatured: false,
            'currentPromotion.type': null,
            'currentPromotion.startDate': null,
            'currentPromotion.endDate': null,
            'currentPromotion.duration': null
          }
        }
      );
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            wasFeatured: true,
            lastFeaturedDate: new Date()
          }
        }
      );
    }

    // Handle Banner status
    if (body.isBanner && body.bannerStartDate && body.bannerEndDate) {
      const duration = Math.ceil((new Date(body.bannerEndDate).getTime() - new Date(body.bannerStartDate).getTime()) / (1000 * 60 * 60 * 24));
      
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            'currentPromotion.type': 'banner',
            'currentPromotion.startDate': new Date(body.bannerStartDate),
            'currentPromotion.endDate': new Date(body.bannerEndDate),
            'currentPromotion.duration': duration
          }
        }
      );

      // Add to promotion history
      const newPromotion = {
        type: 'banner',
        startDate: new Date(body.bannerStartDate),
        endDate: new Date(body.bannerEndDate),
        duration
      };

      await Event.findByIdAndUpdate(
        id,
        {
          $push: {
            promotionHistory: newPromotion
          }
        }
      );
    } else if (body.isBanner === false) {
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            isBanner: false,
            'currentPromotion.type': null,
            'currentPromotion.startDate': null,
            'currentPromotion.endDate': null,
            'currentPromotion.duration': null
          }
        }
      );
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            wasBanner: true,
            lastBannerDate: new Date()
          }
        }
      );
    }

    // Set defaults for undefined values
    if (body.isFeatured === undefined) {
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            isFeatured: false
          }
        }
      );
    }
    if (body.isBanner === undefined) {
      await Event.findByIdAndUpdate(
        id,
        {
          $set: {
            isBanner: false
          }
        }
      );
    }

    console.log('Event updated successfully:', {
      id: result._id,
      isFeatured: result.isFeatured,
      isBanner: result.isBanner,
      featuredStartDate: result.featuredStartDate,
      featuredEndDate: result.featuredEndDate,
      bannerStartDate: result.bannerStartDate,
      bannerEndDate: result.bannerEndDate
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in promotion update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
