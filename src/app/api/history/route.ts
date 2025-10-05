import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET: Fetch user's history
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = await db
      .select()
      .from(userHistory)
      .where(eq(userHistory.userId, userId))
      .orderBy(desc(userHistory.createdAt));

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Clear all user's history
export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db
      .delete(userHistory)
      .where(eq(userHistory.userId, userId));

    return NextResponse.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}