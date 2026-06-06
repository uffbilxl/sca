import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(events, { headers: CORS })
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const event = await prisma.event.create({ data })
    return NextResponse.json({ event }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
