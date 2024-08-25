import { connectToDatabase } from '../../utils/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ message: 'Address is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const profile = await db.collection('profiles').findOne({ walletAddress: address });

    if (profile) {
      return NextResponse.json({ ipfsHash: profile.ipfsHash });
    } else {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { walletAddress, ipfsHash } = await request.json();
    const { db } = await connectToDatabase();

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