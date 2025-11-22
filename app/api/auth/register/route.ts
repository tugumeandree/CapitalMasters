import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getDatabase, collections } from '@/lib/mongodb';
import { User } from '@/lib/models';

// Registration validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  accountType: z.enum(['individual', 'corporate', 'institutional'], {
    message: 'Invalid account type',
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  // Corporate-specific fields
  companyName: z.string().optional(),
  taxId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name, accountType, phone, address, companyName, taxId } = validationResult.data;

    // Connect to database
    const db = await getDatabase();
    const usersCollection = db.collection<User>(collections.users);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const newUser: User = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: accountType === 'corporate' && companyName ? companyName : name,
      accountType,
      riskTolerance: 'moderate', // Default value, can be updated later
      memberSince: new Date(),
      phone,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);

    // Create empty portfolio for new user
    const portfoliosCollection = db.collection(collections.portfolios);
    await portfoliosCollection.insertOne({
      userId: result.insertedId,
      totalValue: 0,
      totalGain: 0,
      totalGainPercent: 0,
      holdings: [],
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: 'Account created successfully! Please log in.',
      success: true,
      user: {
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name,
        accountType: newUser.accountType,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
