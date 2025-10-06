import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const event: ClerkWebhookEvent = await request.json();

    if (event.type === 'user.created') {
      const { data } = event;
      
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, data.id))
        .limit(1);

      if (existingUser.length === 0) {
        // Create new user
        await db.insert(users).values({
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
          notificationsEnabled: true,
        });
      }
    }

    if (event.type === 'user.updated') {
      const { data } = event;
      
      // Update existing user
      await db
        .update(users)
        .set({
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, data.id));
    }

    if (event.type === 'user.deleted') {
      const { data } = event;
      
      // Delete user and related data
      await db.delete(users).where(eq(users.clerkId, data.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}