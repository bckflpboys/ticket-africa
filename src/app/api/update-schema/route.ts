import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDB();

    // Update all existing documents to include the new fields
    const result = await User.collection.updateMany(
      {}, // Match all documents
      {
        $set: {
          phone: '',
          location: '',
          bio: ''
        }
      },
      { upsert: false }
    );

    return NextResponse.json({
      message: 'Schema updated successfully',
      result
    });
  } catch (error) {
    console.error('Error updating schema:', error);
    return NextResponse.json(
      { message: 'Error updating schema' },
      { status: 500 }
    );
  }
}
