import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { opportunityId, body, authorName, anonymous } = await req.json()
    if (!body?.trim() || !opportunityId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const comment = await prisma.comment.create({
      data: {
        body: body.trim(),
        authorName: anonymous ? null : (authorName?.trim() || null),
        anonymous: Boolean(anonymous),
        approved: false,
        opportunityId,
      },
    })
    return NextResponse.json({ comment }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const opportunityId = searchParams.get('opportunityId')
  const comments = await prisma.comment.findMany({
    where: { opportunityId: opportunityId ?? undefined, approved: true },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ comments })
}
