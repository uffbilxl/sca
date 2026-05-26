import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json({ events })
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const event = await prisma.event.create({ data })
    return NextResponse.json({ event }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
