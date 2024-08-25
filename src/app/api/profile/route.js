// app/api/profile/route.js
import { connectToDatabase } from '../../../utils/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { walletAddress, ipfsHash } = await request.json();
    const { db } = await connectToDatabase();

    if (!db) {
      throw new Error('Failed to connect to the database');
    }

    await db.collection('profiles').updateOne(
      { walletAddress },
      { $set: { ipfsHash } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: `Error updating profile: ${error.message}` }, { status: 500 });
  }
}