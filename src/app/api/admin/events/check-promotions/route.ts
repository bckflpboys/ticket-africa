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
        { 
          isFeatured: true,
          featuredEndDate: { $lt: currentDate }
        },
        { 
          isBanner: true,
          bannerEndDate: { $lt: currentDate }
        }
      ]
    });

    // Update each expired promotion
    const updatePromises = expiredPromotions.map(async (event) => {
      const updateFields: any = {};

      // Check and update featured promotion
      if (event.isFeatured && event.featuredEndDate && new Date(event.featuredEndDate) < new Date(currentDate)) {
        const startDate = new Date(event.featuredStartDate || currentDate);
        const endDate = new Date(event.featuredEndDate);
        const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        
        updateFields.isFeatured = false;
        updateFields.featuredStartDate = null;
        updateFields.featuredEndDate = null;
        updateFields.wasFeatured = true;
        updateFields.lastFeaturedDate = currentDate;
        updateFields.totalFeaturedDuration = (event.totalFeaturedDuration || 0) + durationInDays;

        // Add to promotion history
        updateFields.$push = {
          promotionHistory: {
            type: 'featured',
            startDate: startDate,
            endDate: endDate,
            duration: durationInDays
          }
        };
      }

      // Check and update banner promotion
      if (event.isBanner && event.bannerEndDate && new Date(event.bannerEndDate) < new Date(currentDate)) {
        const startDate = new Date(event.bannerStartDate || currentDate);
        const endDate = new Date(event.bannerEndDate);
        const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        
        updateFields.isBanner = false;
        updateFields.bannerStartDate = null;
        updateFields.bannerEndDate = null;
        updateFields.wasBanner = true;
        updateFields.lastBannerDate = currentDate;
        updateFields.totalBannerDuration = (event.totalBannerDuration || 0) + durationInDays;

        // Add to promotion history
        if (!updateFields.$push) {
          updateFields.$push = { promotionHistory: [] };
        }
        updateFields.$push.promotionHistory.push({
          type: 'banner',
          startDate: startDate,
          endDate: endDate,
          duration: durationInDays
        });
      }

      // Only update if there are changes
      if (Object.keys(updateFields).length === 0) {
        return event;
      }

      return Event.findByIdAndUpdate(
        event._id,
        updateFields,
        { new: true }
      );
    });

    const updatedEvents = await Promise.all(updatePromises);
    const actuallyUpdated = updatedEvents.filter(event => 
      (!event.isFeatured && event.wasFeatured) || (!event.isBanner && event.wasBanner)
    );

    // Log the results
    console.log(`[${new Date().toISOString()}] Promotion check completed: ${actuallyUpdated.length} promotions expired`);
    
    return NextResponse.json({
      message: 'Promotion check completed',
      expiredCount: actuallyUpdated.length,
      updatedEvents: actuallyUpdated.map(event => ({
        id: event._id,
        title: event.title,
        previousStatus: {
          wasFeatured: event.wasFeatured,
          wasBanner: event.wasBanner
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
