import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { User } from '@/lib/models';

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
      
      // Fetch user from database
      const db = await getDatabase();
      const usersCollection = db.collection<User>(collections.users);
      const user = await usersCollection.findOne({ _id: new ObjectId(payload.userId as string) });
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      // Return user without password
      const { password: _, _id, ...userWithoutPassword } = user;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Verify returning user:', { id: _id.toString(), ...userWithoutPassword });
      }
      
      return NextResponse.json({ 
        user: {
          id: _id.toString(),
          ...userWithoutPassword,
        }
      });
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
