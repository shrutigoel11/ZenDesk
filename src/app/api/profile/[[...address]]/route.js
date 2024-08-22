import { connectToDatabase } from '../../../../utils/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { address } = params; 

    // Handle case where no address is provided
    if (!address || address.length === 0) {
      return NextResponse.json({ message: 'Address is required' }, { status: 400 }); 
    }

    const db = await connectToDatabase();

    const profile = await db.collection('profiles').findOne({ walletAddress: address[0] }); // Access the first element of the array

    if (profile) {
      return NextResponse.json(profile);
    } else {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching profile', error: error.message }, { status: 500 });
  }
}