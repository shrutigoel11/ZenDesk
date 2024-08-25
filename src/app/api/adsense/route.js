import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { connectToDatabase } from '../../../utils/dbConnect';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/adsense/callback'
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.adsenseToken) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/adsense.readonly']
    });
    return NextResponse.json({ authUrl });
  }

  oauth2Client.setCredentials(user.adsenseToken);
  const adsense = google.adsense({ version: 'v2', auth: oauth2Client });

  try {
    const response = await adsense.accounts.reports.generate({
      account: 'accounts/YOUR_ACCOUNT_ID',
      dateRange: 'LAST_7_DAYS',
      metrics: ['IMPRESSIONS', 'CLICKS', 'EARNINGS']
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching AdSense data:', error);
    return NextResponse.json({ error: 'Error fetching AdSense data' }, { status: 500 });
  }
}