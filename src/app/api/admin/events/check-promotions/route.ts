import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';
import Event from '@/models/Event';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';

// Function to validate requests
async function validateRequest(request: NextRequest) {
  // Check if it's a cron job request
  const cronSecret = request.headers.get('x-vercel-cron-secret');
  if (cronSecret === process.env.CRON_SECRET) {
    return true;
  }

  // If not a cron job, check for admin authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }

  const user = await User.findOne({ email: session.user.email });
  return user?.role === 'admin';
}

// Handler for both GET (cron job) and POST (manual check) requests
async function handleRequest(request: NextRequest) {
  try {
    // Validate the request
    const isValid = await validateRequest(request);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();
    const currentDate = new Date().toISOString();
    
    // Find all events with active promotions that have expired
    const expiredPromotions = await Event.find({
      $or: [
        { isFeatured: true },
        { isBanner: true }
      ],
      promotionEndDate: {
        $lt: currentDate
      }
    });

    // Update each expired promotion
    const updatePromises = expiredPromotions.map(async (event) => {
      const updateFields: any = {
        isFeatured: false,
        isBanner: false,
        promotionEndDate: null,
        promotionStartDate: null
      };

      // Calculate duration for featured events
      if (event.isFeatured) {
        const startDate = new Date(event.promotionStartDate || event.promotionHistory?.[event.promotionHistory.length - 1]?.startDate || currentDate);
        const endDate = new Date();
        const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        
        updateFields.wasFeatured = true;
        updateFields.lastFeaturedDate = currentDate;
        updateFields.totalFeaturedDuration = (event.totalFeaturedDuration || 0) + durationInDays;
      }

      // Calculate duration for banner events
      if (event.isBanner) {
        const startDate = new Date(event.promotionStartDate || event.promotionHistory?.[event.promotionHistory.length - 1]?.startDate || currentDate);
        const endDate = new Date();
        const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        
        updateFields.wasBanner = true;
        updateFields.lastBannerDate = currentDate;
        updateFields.totalBannerDuration = (event.totalBannerDuration || 0) + durationInDays;
      }

      return Event.findByIdAndUpdate(
        event._id,
        { $set: updateFields },
        { new: true }
      );
    });

    const updatedEvents = await Promise.all(updatePromises);

    // Log the results
    console.log(`[${new Date().toISOString()}] Promotion check completed: ${expiredPromotions.length} promotions expired`);
    
    return NextResponse.json({
      message: 'Promotion check completed',
      expiredCount: expiredPromotions.length,
      updatedEvents: updatedEvents.map(event => ({
        id: event._id,
        title: event.title,
        previousStatus: {
          featured: event.wasFeatured,
          banner: event.wasBanner
        }
      }))
    });
  } catch (error) {
    console.error('Error checking promotions:', error);
    return NextResponse.json(
      { error: 'Failed to check promotions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}
