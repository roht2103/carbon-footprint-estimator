import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET: Fetch current user profile
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      preferredTransportMode,
      preferredDietType,
      carbonFootprintGoal,
      notificationsEnabled,
    } = body;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length === 0) {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          preferredTransportMode,
          preferredDietType,
          carbonFootprintGoal,
          notificationsEnabled,
        })
        .returning();

      return NextResponse.json(newUser[0]);
    } else {
      // Update existing user
      const updatedUser = await db
        .update(users)
        .set({
          email: clerkUser.emailAddresses[0]?.emailAddress || existingUser[0].email,
          firstName: clerkUser.firstName || existingUser[0].firstName,
          lastName: clerkUser.lastName || existingUser[0].lastName,
          imageUrl: clerkUser.imageUrl || existingUser[0].imageUrl,
          preferredTransportMode: preferredTransportMode || existingUser[0].preferredTransportMode,
          preferredDietType: preferredDietType || existingUser[0].preferredDietType,
          carbonFootprintGoal: carbonFootprintGoal || existingUser[0].carbonFootprintGoal,
          notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : existingUser[0].notificationsEnabled,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, userId))
        .returning();

      return NextResponse.json(updatedUser[0]);
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      preferredTransportMode,
      preferredDietType,
      carbonFootprintGoal,
      notificationsEnabled,
    } = body;

    const updatedUser = await db
      .update(users)
      .set({
        preferredTransportMode,
        preferredDietType,
        carbonFootprintGoal,
        notificationsEnabled,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}