import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase, collections } from '@/lib/mongodb';
import { NewsletterSubscription } from '@/lib/models';

// Validation schema
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = newsletterSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Save to MongoDB
    const db = await getDatabase();
    const newslettersCollection = db.collection<NewsletterSubscription>(collections.newsletters);
    
    // Check if email already exists
    const existing = await newslettersCollection.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { message: 'This email is already subscribed to our newsletter' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await newslettersCollection.updateOne(
          { email: email.toLowerCase() },
          { $set: { status: 'active', subscribedAt: new Date() } }
        );
        return NextResponse.json({
          message: 'Successfully resubscribed to newsletter!',
          success: true,
        });
      }
    }
    
    // Create new subscription
    const subscription: NewsletterSubscription = {
      email: email.toLowerCase(),
      status: 'active',
      subscribedAt: new Date(),
    };
    
    await newslettersCollection.insertOne(subscription);
    
    console.log('Newsletter subscription saved to database');

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter!',
      success: true,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
