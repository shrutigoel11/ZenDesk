import { NextResponse } from 'next/server';

export async function GET() {
  const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
  
  try {
    const response = await fetch(
      'https://api.opensea.io/api/v1/assets?order_direction=desc&limit=20&include_orders=true',
      {
        headers: {
          'X-API-KEY': OPENSEA_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch NFTs from OpenSea');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json({ error: 'Failed to fetch NFTs' }, { status: 500 });
  }
}