import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getInitialStoreData, readStore, writeStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const current = readStore();
    
    // Create safety backup before reset
    const backupDir = path.join(process.cwd(), 'data', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, `backup-before-reset-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(current, null, 2), 'utf-8');

    const initial = getInitialStoreData();
    writeStore(initial);
    return NextResponse.json({ 
      success: true, 
      message: 'Data berhasil direset ke setelan awal. Salinan cadangan telah dibuat.', 
      data: initial 
    });
  } catch (err) {
    console.error('API /api/reset error:', err);
    return NextResponse.json({ success: false, error: 'Gagal mereset data' }, { status: 500 });
  }
}
