import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/serverStore';
import { JudgeScoreSubmission } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const submission: JudgeScoreSubmission = await req.json();
    const store = readStore();

    // Check if score already exists for this judge & nominator
    const existingIndex = store.submissions.findIndex(
      (s) => s.judgeId === submission.judgeId && s.nominatorId === submission.nominatorId
    );

    if (existingIndex >= 0) {
      store.submissions[existingIndex] = {
        ...submission,
        submittedAt: new Date().toISOString()
      };
    } else {
      store.submissions.push({
        ...submission,
        id: submission.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        submittedAt: new Date().toISOString()
      });
    }

    writeStore(store);
    return NextResponse.json({ success: true, submission });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal menyimpan nilai' }, { status: 500 });
  }
}
