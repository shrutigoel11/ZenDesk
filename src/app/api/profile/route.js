// import { connectToDatabase } from '../../../utils/dbConnect';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { walletAddress, name, email, phone, about, profileImage } = await request.json();
//     const db = await connectToDatabase();
    
//     await db.collection('profiles').updateOne(
//       { walletAddress },
//       { $set: { name, email, phone, about, profileImage } },
//       { upsert: true }
//     );

//     return NextResponse.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });
//   }
// }