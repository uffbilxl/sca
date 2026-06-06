import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.opportunity.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const opportunity = await prisma.opportunity.update({
      where: { id: params.id },
      data: { status: body.status },
      include: { company: true },
    })
    return NextResponse.json(opportunity)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
