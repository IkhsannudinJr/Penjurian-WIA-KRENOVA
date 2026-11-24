import { NextResponse } from 'next/server';
import { readStore, writeStore, AppStoreData } from '@/lib/serverStore';
import { JudgeScoreSubmission } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await readStore();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body: Partial<AppStoreData> = await req.json();
    const current = await readStore();

    // Safely update judges and nominators if provided
    const mergedJudges = body.judges && body.judges.length > 0 ? body.judges : current.judges;
    const mergedNominators = body.nominators && body.nominators.length > 0 ? body.nominators : current.nominators;

    // Never overwrite submissions with empty array if existing store already has scores
    let mergedSubmissions = current.submissions;
    if (Array.isArray(body.submissions) && body.submissions.length > 0) {
      const subMap = new Map<string, JudgeScoreSubmission>();
      current.submissions.forEach((s) => subMap.set(`${s.judgeId}-${s.nominatorId}`, s));
      body.submissions.forEach((s) => subMap.set(`${s.judgeId}-${s.nominatorId}`, s));
      mergedSubmissions = Array.from(subMap.values());
    }

    const updatedData: AppStoreData = {
      judges: mergedJudges,
      nominators: mergedNominators,
      submissions: mergedSubmissions,
      lastUpdated: new Date().toISOString()
    };

    await writeStore(updatedData);
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('API /api/state POST error:', error);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui data' }, { status: 500 });
  }
}
