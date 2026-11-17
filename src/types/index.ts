export type CompetitionType = 'WIA' | 'KRENOVA';

export type WIACategory = 
  | 'opd'
  | 'kecamatan'
  | 'korwilcambidik'
  | 'pelajar'
  | 'puskesmas'
  | 'desa'
  | 'bumd';

export type KrenovaCategory = 'pelajar' | 'masyarakat';

export interface Criterion {
  id: string;
  name: string;
  weight: number; // in percent
  description?: string;
  subCriteria?: {
    id: string;
    name: string;
    description?: string;
  }[];
}

export interface Nominator {
  id: string;
  competition: CompetitionType;
  category: string;
  categoryLabel: string;
  orderNumber: number;
  name: string;
  institution?: string;
  title?: string;
  teamMembers?: string[];
  description?: string;
  // Rundown specifics
  room: string;
  teamId: number; // 1 | 2 | 3
  timeSlot: string;
  scheduleOrder: number;
}

export interface Judge {
  id: string;
  name: string;
  role: string;
  institution?: string;
  teamId: number; // 1, 2, or 3
  room: string;
  assignedCategories: string[];
  avatarColor?: string;
}

export interface ScoreItem {
  criterionId: string;
  subCriterionId?: string;
  score: number; // 1 to 5
}

export interface JudgeScoreSubmission {
  id: string;
  judgeId: string;
  judgeName: string;
  nominatorId: string;
  competition: CompetitionType;
  category: string;
  scores: Record<string, number>;
  notes?: string;
  totalWeightedScore: number; // 0 to 500 (Score 1..5 * Weight)
  submittedAt: string;
  isLocked: boolean;
}

export interface CategorySummary {
  category: string;
  categoryLabel: string;
  competition: CompetitionType;
  room: string;
  teamId: number;
  judges: Judge[];
  nominators: {
    nominator: Nominator;
    judgeScores: {
      judgeId: string;
      judgeName: string;
      totalScore: number; // Max 500
      scores: Record<string, number>;
      notes?: string;
    }[];
    totalAccumulatedScore: number; // Sum of 3 judges (Max 1500)
    averageScore: number; // Average per judge (Max 500)
    rank: number;
  }[];
}
