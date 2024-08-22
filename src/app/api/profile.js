import { connectToDatabase } from '../../utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { address } = params || {};

    // 1. Handle case where no address is provided
    if (!address || address.length === 0) {
      const db = await connectToDatabase();
      const defaultProfile = await db.collection('profiles').findOne({ isDefault: true });

      if (defaultProfile) {
        return NextResponse.json(defaultProfile);
      } else {
        return NextResponse.json({ message: 'No default profile found' }, { status: 404 });
      }
    }

    // 2. Fetch profile by address (when address is provided)
    const db = await connectToDatabase();
    const profile = await db.collection('profiles').findOne({ walletAddress: address[0] });

    if (profile) {
      return NextResponse.json(profile);
    } else {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching profile', error: error.message }, { status: 500 });
  }
}