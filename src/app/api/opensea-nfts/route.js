import { NextResponse } from 'next/server';

export async function GET() {
  const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
  console.log('API Key:', OPENSEA_API_KEY); // Remove this in production

  try {
    console.log('Fetching from OpenSea...');
    const response = await fetch(
      'https://api.opensea.io/v2/orders/ethereum/seaport/listings?limit=20',
      {
        headers: {
          'X-API-KEY': OPENSEA_API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    console.log('OpenSea response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSea error response:', errorText);
      throw new Error(`Failed to fetch NFTs from OpenSea: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenSea data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json({ error: 'Failed to fetch NFTs' }, { status: 500 });
  }
}