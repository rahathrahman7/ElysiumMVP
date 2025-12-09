import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/database/prisma';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  preferences: z.record(z.any()).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        addresses: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, dateOfBirth, preferences } = profileSchema.parse(body);

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name }
      });
    }

    // Update or create customer profile
    if (phone || dateOfBirth || preferences) {
      await prisma.customerProfile.upsert({
        where: { userId: session.user.id },
        update: {
          phone,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          preferences: preferences as any,
        },
        create: {
          userId: session.user.id,
          phone,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          preferences: preferences as any,
        }
      });
    }

    // Fetch updated user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
