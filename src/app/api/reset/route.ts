import { NextResponse } from 'next/server';
import { getInitialStoreData, writeStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function POST() {
  const initial = getInitialStoreData();
  writeStore(initial);
  return NextResponse.json({ success: true, message: 'Data berhasil direset ke setelan awal', data: initial });
}
