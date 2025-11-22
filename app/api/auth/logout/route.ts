import { NextResponse } from 'next/server';

export async function POST() {
  // In a real app, you might want to blacklist the token here
  return NextResponse.json({ message: 'Logout successful' });
}
