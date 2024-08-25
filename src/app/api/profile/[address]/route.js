// app/api/profile/[address]/route.js
import { connectToDatabase } from '../../../../utils/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { address } = params;
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