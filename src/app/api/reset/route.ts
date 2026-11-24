import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getInitialStoreData, readStore, writeStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const current = await readStore();

    // Create safety backup before reset if filesystem permits
    try {
      const isServerless = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
      const backupDir = isServerless 
        ? path.join('/tmp', 'wia-data', 'backups') 
        : path.join(process.cwd(), 'data', 'backups');

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const backupFile = path.join(backupDir, `backup-before-reset-${Date.now()}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(current, null, 2), 'utf-8');
    } catch (bErr) {
      // Ignored if in read-only environment
    }

    const initial = getInitialStoreData();
    await writeStore(initial);

    return NextResponse.json({ 
      success: true, 
      message: 'Data berhasil direset ke setelan awal.', 
      data: initial 
    });
  } catch (err) {
    console.error('API /api/reset error:', err);
    // Still return success so client can reset its local state
    const initial = getInitialStoreData();
    return NextResponse.json({ success: true, message: 'Reset lokal berhasil.', data: initial });
  }
}
