import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { jwtVerify } from 'jose';
import { getDatabase, collections } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { ObjectId } from 'mongodb';

// Profile update validation schema
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).optional(),
});

async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-characters'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, address, riskTolerance } = validationResult.data;

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(collections.users);

    // Build update object (only include provided fields)
    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (name) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (riskTolerance) updateFields.riskTolerance = riskTolerance;

    // Update user profile
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user info (without password)
    const { password, _id, ...userWithoutPassword } = result;

    return NextResponse.json({
      message: 'Profile updated successfully',
      success: true,
      user: {
        id: _id.toString(),
        ...userWithoutPassword,
      },
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(collections.users);

    // Fetch user profile
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user info (without password)
    const { password, _id, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: {
        id: _id.toString(),
        ...userWithoutPassword,
      },
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
