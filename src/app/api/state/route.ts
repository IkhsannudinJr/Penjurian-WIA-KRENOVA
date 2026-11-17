import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = readStore();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    writeStore(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui data' }, { status: 500 });
  }
}
