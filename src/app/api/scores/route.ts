import { NextResponse } from 'next/server';
import { saveSingleSubmission } from '@/lib/serverStore';
import { JudgeScoreSubmission } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const submission: JudgeScoreSubmission = await req.json();
    if (!submission.judgeId || !submission.nominatorId) {
      return NextResponse.json({ success: false, error: 'Data juri atau nominator tidak lengkap' }, { status: 400 });
    }

    const updatedStore = saveSingleSubmission(submission);
    return NextResponse.json({ success: true, submission, totalSubmissions: updatedStore.submissions.length });
  } catch (err) {
    console.error('API /api/scores error:', err);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan nilai' }, { status: 500 });
  }
}
