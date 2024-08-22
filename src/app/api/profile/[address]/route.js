import { connectToDatabase } from '../../../../utils/dbConnect';
import { NextResponse } from 'next/server';
export async function generateStaticParams() {
  return [];
}
export async function GET() {
  return new Response('Hello, World!', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}