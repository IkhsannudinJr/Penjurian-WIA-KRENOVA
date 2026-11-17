import fs from 'fs';
import path from 'path';
import { Judge, JudgeScoreSubmission, Nominator } from '../types';
import { INITIAL_JUDGES, INITIAL_NOMINATORS } from '../data/initialData';
import { calculateTotalScore } from './scoring';

export interface AppStoreData {
  judges: Judge[];
  nominators: Nominator[];
  submissions: JudgeScoreSubmission[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'app-store.json');

export function getInitialStoreData(): AppStoreData {
  return {
    judges: INITIAL_JUDGES,
    nominators: INITIAL_NOMINATORS,
    submissions: [],
    lastUpdated: new Date().toISOString()
  };
}

export function readStore(): AppStoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialStoreData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed: AppStoreData = JSON.parse(content);
    
    // Sync 9 judges if needed
    if (!parsed.judges || parsed.judges.length < 9) {
      parsed.judges = INITIAL_JUDGES;
      parsed.nominators = INITIAL_NOMINATORS;
    }

    // Auto-recalculate any submissions that still have old scale (<= 100)
    let hasChanges = false;
    if (parsed.submissions && parsed.submissions.length > 0) {
      parsed.submissions.forEach((sub) => {
        if (sub.scores && Object.keys(sub.scores).length > 0 && sub.totalWeightedScore <= 100) {
          const recalculated = calculateTotalScore(sub.competition, sub.category, sub.scores);
          sub.totalWeightedScore = recalculated.total;
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }

    return parsed;
  } catch (err) {
    console.error('Error reading store file, fallback to initial data:', err);
    return getInitialStoreData();
  }
}

export function writeStore(data: AppStoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file:', err);
  }
}
