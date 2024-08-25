import { google } from 'googleapis';
import { connectToDatabase } from '../../utils/dbConnect';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/adsense/callback'
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: req.query.email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.adsenseToken) {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/adsense.readonly']
      });
      return res.status(200).json({ authUrl });
    }

    oauth2Client.setCredentials(user.adsenseToken);
    const adsense = google.adsense({ version: 'v2', auth: oauth2Client });

    try {
      const response = await adsense.accounts.reports.generate({
        account: 'accounts/YOUR_ACCOUNT_ID',
        dateRange: 'LAST_7_DAYS',
        metrics: ['IMPRESSIONS', 'CLICKS', 'EARNINGS']
      });

      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching AdSense data:', error);
      return res.status(500).json({ error: 'Error fetching AdSense data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}