import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating likes count:', error);
    return NextResponse.json(
      { error: 'Failed to increment likes count' },
      { status: 500 }
    );
  }
}
