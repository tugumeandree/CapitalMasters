import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const USERS = [
  {
    id: '1',
    email: 'demo@capitalmasters.com',
    name: 'Demo User',
  },
];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-characters'
    );

    try {
      const { payload } = await jwtVerify(token, secret);
      
      // Find user
      const user = USERS.find((u) => u.id === payload.userId);
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
