import { NextResponse } from 'next/server';

export async function GET() {
  const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
  console.log('API Key (last 4 chars):', OPENSEA_API_KEY.slice(-4)); // Log last 4 characters of API key

  try {
    console.log('Fetching from OpenSea...');
    const response = await fetch(
      'https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20',
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
    console.log('OpenSea data:', JSON.stringify(data, null, 2));

    // Transform the data to match the expected structure
    const transformedData = {
      assets: data.orders.map(order => ({
        id: order.order_hash,
        name: order.maker_asset_bundle.assets[0].name,
        image_url: order.maker_asset_bundle.assets[0].image_url,
        description: order.maker_asset_bundle.assets[0].description,
        permalink: order.maker_asset_bundle.assets[0].permalink,
        collection: {
          name: order.maker_asset_bundle.assets[0].collection.name
        },
        last_sale: {
          payment_token: {
            eth_price: order.current_price / (10 ** 18) // Convert from wei to ETH
          }
        }
      }))
    };

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}