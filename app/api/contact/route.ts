import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase, collections } from '@/lib/mongodb';
import { ContactSubmission } from '@/lib/models';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validationResult.data;

    // Save to MongoDB
    const db = await getDatabase();
    const contactsCollection = db.collection<ContactSubmission>(collections.contacts);
    
    const submission: ContactSubmission = {
      name,
      email,
      phone,
      subject,
      message,
      status: 'new',
      createdAt: new Date(),
    };
    
    await contactsCollection.insertOne(submission);

    // TODO: Send email notification
    console.log('Contact form submission saved to database');

    return NextResponse.json({
      message: 'Thank you for contacting us. We will get back to you soon!',
      success: true,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
