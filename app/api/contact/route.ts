// @ts-nocheck
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define the schema for the contact form
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);
    
    // In a real application, you would send an email or save to a database here
    // For example:
    // await sendEmail(validatedData);
    // or
    // await saveToDatabase(validatedData);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Message received successfully!',
        data: {
          name: validatedData.name,
          email: validatedData.email,
        }
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process your message',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}