import { connectToDatabase } from '../../../../utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    const db = await connectToDatabase();

    // Handle case where no address is provided
    if (!address) {
      const defaultProfile = await db.collection('profiles').findOne({ isDefault: true });
      
      if (defaultProfile) {
        return NextResponse.json(defaultProfile);
      } else {
        return NextResponse.json({ message: 'No default profile found' }, { status: 404 });
      }
    }

    // Fetch profile by address
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