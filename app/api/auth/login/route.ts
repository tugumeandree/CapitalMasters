import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase, collections } from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(collections.users);

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (process.env.NODE_ENV === 'development') {
      console.log(`Login attempt for: ${email.toLowerCase()} - userFound=${!!user}`);
    }
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password - ensure stored password exists
    if (!user.password || typeof user.password !== 'string') {
      console.error('Login error: user has no password hash stored', { userId: user._id });
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-characters'
    );

    const tokenPayload = { userId: user._id.toString(), email: user.email, role: (user as any).role || 'user' };
    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Return user info (without password) and token. Also set HttpOnly cookie for convenience.
    const { password: _, _id, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      {
        user: {
          id: _id.toString(),
          ...userWithoutPassword,
        },
        token,
        message: 'Login successful',
      },
      { status: 200 }
    );

    try {
      // Set secure cookie in production, HttpOnly to protect from XSS
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    } catch (cookieErr) {
      // Non-fatal: log but don't block response
      console.warn('Could not set cookie on response:', cookieErr);
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    // In development, include the error message/stack to aid debugging.
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { message: 'Internal server error', error: (error as Error).message, stack: (error as Error).stack },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
