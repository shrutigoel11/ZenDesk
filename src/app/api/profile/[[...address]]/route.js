import { connectToDatabase } from '../../../../utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { address } = params;
    const db = await connectToDatabase();
    
    const profile = await db.collection('profiles').findOne({ walletAddress: address });

    if (profile) {
      return NextResponse.json(profile);
    } else {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching profile', error: error.message }, { status: 500 });
  }
}