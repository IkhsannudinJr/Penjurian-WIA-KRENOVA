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
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DATA_FILE = path.join(DATA_DIR, 'app-store.json');

// In-memory cache to guarantee data is never wiped out during concurrent reads/writes
let memoryCache: AppStoreData | null = null;

export function getInitialStoreData(): AppStoreData {
  return {
    judges: INITIAL_JUDGES,
    nominators: INITIAL_NOMINATORS,
    submissions: [],
    lastUpdated: new Date().toISOString()
  };
}

function ensureDirectoriesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

export function readStore(): AppStoreData {
  ensureDirectoriesExist();

  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = memoryCache || getInitialStoreData();
      writeStore(initial);
      memoryCache = initial;
      return initial;
    }

    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    if (!content || content.trim().length === 0) {
      if (memoryCache && memoryCache.submissions.length > 0) {
        return memoryCache;
      }
      return getInitialStoreData();
    }

    const parsed: AppStoreData = JSON.parse(content);

    // Sync judges & nominators if empty
    if (!parsed.judges || parsed.judges.length < 9) {
      parsed.judges = INITIAL_JUDGES;
    }
    if (!parsed.nominators || parsed.nominators.length === 0) {
      parsed.nominators = INITIAL_NOMINATORS;
    }
    if (!parsed.submissions) {
      parsed.submissions = [];
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

    // Keep memory cache updated
    memoryCache = parsed;

    if (hasChanges) {
      writeStore(parsed);
    }

    return parsed;
  } catch (err) {
    console.error('Error reading store file, attempting recovery from memory cache:', err);
    if (memoryCache) {
      return memoryCache;
    }
    // Check if backup exists
    try {
      const backupFile = path.join(BACKUP_DIR, 'app-store.backup.json');
      if (fs.existsSync(backupFile)) {
        const backupContent = fs.readFileSync(backupFile, 'utf-8');
        const backupParsed: AppStoreData = JSON.parse(backupContent);
        memoryCache = backupParsed;
        return backupParsed;
      }
    } catch (bErr) {
      console.error('Backup recovery failed:', bErr);
    }
    return getInitialStoreData();
  }
}

export function writeStore(data: AppStoreData): void {
  ensureDirectoriesExist();

  try {
    data.lastUpdated = new Date().toISOString();
    memoryCache = data;

    const jsonString = JSON.stringify(data, null, 2);

    // Safe atomic write: write to temp file then rename
    const tempFile = `${DATA_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, jsonString, 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);

    // Also update a persistent rolling backup
    const backupFile = path.join(BACKUP_DIR, 'app-store.backup.json');
    fs.writeFileSync(backupFile, jsonString, 'utf-8');
  } catch (err) {
    console.error('Error writing store file, attempting direct write:', err);
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (wErr) {
      console.error('Direct write also failed:', wErr);
    }
  }
}

/**
 * Atomic save submission helper to prevent multi-judge race conditions
 */
export function saveSingleSubmission(submission: JudgeScoreSubmission): AppStoreData {
  const store = readStore();

  const existingIndex = store.submissions.findIndex(
    (s) => s.judgeId === submission.judgeId && s.nominatorId === submission.nominatorId
  );

  const submissionToSave: JudgeScoreSubmission = {
    ...submission,
    id: submission.id || `sub-${submission.judgeId}-${submission.nominatorId}`,
    submittedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    store.submissions[existingIndex] = submissionToSave;
  } else {
    store.submissions.push(submissionToSave);
  }

  writeStore(store);
  return store;
}
