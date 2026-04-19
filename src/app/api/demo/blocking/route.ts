import { NextResponse } from 'next/server';

export async function POST() {
  // Simulate a blocking operation or delay if needed
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return NextResponse.json({ message: 'Blocking request completed' });
}
