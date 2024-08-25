import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/dbConnect';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ tokens: user.tokens || 0 });
}

export async function POST(request) {
  const { email, amount } = await request.json();

  const db = await connectToDatabase();
  const result = await db.collection('users').updateOne(
    { email },
    { $inc: { tokens: amount } },
    { upsert: true }
  );

  if (result.modifiedCount === 1 || result.upsertedCount === 1) {
    return NextResponse.json({ message: 'Tokens updated successfully' });
  } else {
    return NextResponse.json({ error: 'Failed to update tokens' }, { status: 500 });
  }
}