import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { type, body, email } = await req.json()
    if (!body?.trim()) return NextResponse.json({ error: 'Body required' }, { status: 400 })
    const feedback = await prisma.feedback.create({ data: { type: type ?? 'general', body, email } })
    return NextResponse.json({ feedback }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ feedback })
}
