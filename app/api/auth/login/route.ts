import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase, collections } from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(collections.users);

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-characters'
    );

    const token = await new SignJWT({ 
      userId: user._id.toString(),
      email: user.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Return user info (without password) and token
    const { password: _, _id, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: {
        id: _id.toString(),
        ...userWithoutPassword,
      },
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
