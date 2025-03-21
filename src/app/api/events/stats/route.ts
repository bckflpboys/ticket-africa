import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

interface ViewHistoryItem {
  timestamp: Date;
  visitorId: string;
  sessionId: string;
}

interface EventStatsDocument extends mongoose.Document {
  eventId: string;
  totalViews: number;
  uniqueVisitors: number;
  viewHistory: ViewHistoryItem[];
}

// Define the schema for event stats
const eventStatsSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  totalViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  viewHistory: [{
    timestamp: { type: Date, default: Date.now },
    visitorId: String,
    sessionId: String
  }]
}, { timestamps: true });

// Get the model, preventing re-compilation error
const EventStats = mongoose.models.EventStats || mongoose.model<EventStatsDocument>('EventStats', eventStatsSchema);

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();
    console.log('Stats API called for event:', eventId);
    await connectDB();
    
    // Get visitor info
    const session = await getServerSession(authOptions);
    const visitorId = session?.user?.email || 'anonymous';
    const sessionId = Math.random().toString(36).substring(7);
    console.log('Visitor info:', { visitorId, sessionId });

    // Get or create initial stats document
    let stats = await EventStats.findOne({ eventId });
    console.log('Existing stats:', stats);

    if (!stats) {
      console.log('Creating new stats document');
      stats = await EventStats.create({
        eventId,
        totalViews: 1,
        uniqueVisitors: 1,
        viewHistory: [{
          timestamp: new Date(),
          visitorId,
          sessionId
        }]
      });
      console.log('New stats created:', stats);
      return NextResponse.json({
        totalViews: stats.totalViews,
        uniqueVisitors: stats.uniqueVisitors
      });
    }

    // Check if this is a new visitor
    const isNewVisitor = !stats.viewHistory.some(
      (view: ViewHistoryItem) => view.visitorId === visitorId
    );
    console.log('Is new visitor:', isNewVisitor);

    // Update the document
    const updatedStats = await EventStats.findOneAndUpdate(
      { eventId },
      {
        $inc: { 
          totalViews: 1,
          ...(isNewVisitor ? { uniqueVisitors: 1 } : {})
        },
        $push: {
          viewHistory: {
            timestamp: new Date(),
            visitorId,
            sessionId
          }
        }
      },
      { new: true }
    );
    console.log('Updated stats:', updatedStats);

    return NextResponse.json({
      totalViews: updatedStats.totalViews,
      uniqueVisitors: updatedStats.uniqueVisitors
    });
  } catch (error) {
    console.error('Error updating event stats:', error);
    return NextResponse.json({ error: 'Failed to update event stats' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    await connectDB();
    console.log('Fetching stats for event:', eventId);
    const stats = await EventStats.findOne(
      { eventId },
      { totalViews: 1, uniqueVisitors: 1, _id: 0 }
    );
    console.log('Fetched stats:', stats);
    
    return NextResponse.json(stats || { totalViews: 0, uniqueVisitors: 0 });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return NextResponse.json({ error: 'Failed to fetch event stats' }, { status: 500 });
  }
}
