// import { connectToDatabase } from '../../../../utils/dbConnect';
// import { NextResponse } from 'next/server';

// export async function GET(request, { params }) {
//   try {
//     const { address } = params; 

//     // 1. Handle case where no address is provided
//     if (!address || address.length === 0) {
//       // You can customize this behavior based on your requirements
//       // Option 1: Return an error
//       // return NextResponse.json({ message: 'Address is required' }, { status: 400 }); 

//       // Option 2: Fetch a default or featured profile (if applicable)
//       const db = await connectToDatabase();
//       const defaultProfile = await db.collection('profiles').findOne({ isDefault: true }); // Assuming you have a field to mark a default profile

//       if (defaultProfile) {
//         return NextResponse.json(defaultProfile);
//       } else {
//         return NextResponse.json({ message: 'No default profile found' }, { status: 404 });
//       }
//     }

//     // 2. Fetch profile by address (when address is provided)
//     const db = await connectToDatabase();
//     const profile = await db.collection('profiles').findOne({ walletAddress: address[0] });

//     if (profile) {
//       return NextResponse.json(profile);
//     } else {
//       return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
//     }
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching profile', error: error.message }, { status: 500 });
//   }
// }
