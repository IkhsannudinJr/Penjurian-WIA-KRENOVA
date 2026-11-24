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

// Upstash Redis / Vercel KV Cloud Configuration
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'wia_krenova_store_2026';

// Detect serverless environment (e.g., Vercel, AWS Lambda)
const isServerless = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isServerless ? path.join('/tmp', 'wia-data') : path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DATA_FILE = path.join(DATA_DIR, 'app-store.json');
const BUNDLED_FILE = path.join(process.cwd(), 'data', 'app-store.json');

// In-memory cache to guarantee fast response
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
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  } catch (err) {
    // Gracefully handle read-only environments
  }
}

// Helper to interact with Upstash / Vercel KV REST API
async function readFromKV(): Promise<AppStoreData | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const url = `${KV_URL}/get/${KV_KEY}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
    return parsed as AppStoreData;
  } catch (err) {
    console.error('Failed to read from Cloud KV:', err);
    return null;
  }
}

async function writeToKV(data: AppStoreData): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const url = `${KV_URL}/set/${KV_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to write to Cloud KV:', err);
    return false;
  }
}

export async function readStore(): Promise<AppStoreData> {
  // 1. If Cloud KV is configured (e.g. on Vercel), prioritize it
  if (KV_URL && KV_TOKEN) {
    const cloudData = await readFromKV();
    if (cloudData && cloudData.judges && cloudData.judges.length >= 9) {
      memoryCache = cloudData;
      return cloudData;
    }
  }

  ensureDirectoriesExist();

  try {
    if (!fs.existsSync(DATA_FILE)) {
      let seedData: AppStoreData = getInitialStoreData();
      if (fs.existsSync(BUNDLED_FILE)) {
        try {
          const bundledContent = fs.readFileSync(BUNDLED_FILE, 'utf-8');
          if (bundledContent && bundledContent.trim().length > 0) {
            seedData = JSON.parse(bundledContent);
          }
        } catch (bErr) {
          // fallback
        }
      }
      await writeStore(seedData);
      memoryCache = seedData;
      return seedData;
    }

    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    if (!content || content.trim().length === 0) {
      if (memoryCache && memoryCache.submissions.length > 0) {
        return memoryCache;
      }
      return getInitialStoreData();
    }

    const parsed: AppStoreData = JSON.parse(content);

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

    memoryCache = parsed;

    if (hasChanges) {
      await writeStore(parsed);
    }

    return parsed;
  } catch (err) {
    console.error('Error reading store file, attempting recovery from memory cache:', err);
    if (memoryCache) {
      return memoryCache;
    }
    return getInitialStoreData();
  }
}

export async function writeStore(data: AppStoreData): Promise<void> {
  data.lastUpdated = new Date().toISOString();
  memoryCache = data;

  // 1. Write to Cloud KV if available
  if (KV_URL && KV_TOKEN) {
    await writeToKV(data);
  }

  // 2. Also try writing to local disk or /tmp
  ensureDirectoriesExist();

  try {
    const jsonString = JSON.stringify(data, null, 2);
    const tempFile = `${DATA_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, jsonString, 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);

    const backupFile = path.join(BACKUP_DIR, 'app-store.backup.json');
    fs.writeFileSync(backupFile, jsonString, 'utf-8');
  } catch (err) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (wErr) {
      // Ignored on read-only environments
    }
  }
}

/**
 * Atomic save submission helper
 */
export async function saveSingleSubmission(submission: JudgeScoreSubmission): Promise<AppStoreData> {
  const store = await readStore();

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

  await writeStore(store);
  return store;
}
