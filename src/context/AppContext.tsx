'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { CompetitionType, Judge, JudgeScoreSubmission, Nominator, CategorySummary } from '../types';
import { INITIAL_JUDGES, INITIAL_NOMINATORS } from '../data/initialData';
import { AppStoreData } from '../lib/serverStore';
import { calculateTotalScore } from '../lib/scoring';

interface AppContextType {
  judges: Judge[];
  nominators: Nominator[];
  submissions: JudgeScoreSubmission[];
  currentJudge: Judge | null;
  setCurrentJudge: (judge: Judge | null) => void;
  saveScore: (submission: JudgeScoreSubmission) => Promise<boolean>;
  getSubmission: (judgeId: string, nominatorId: string) => JudgeScoreSubmission | undefined;
  getNominatorById: (id: string) => Nominator | undefined;
  getCategorySummary: (competition: CompetitionType, category: string) => CategorySummary;
  refreshData: () => Promise<void>;
  resetData: () => Promise<void>;
  importData: (data: AppStoreData) => Promise<boolean>;
  isLoading: boolean;
  addJudge: (judge: Omit<Judge, 'id'>) => Promise<void>;
  addNominator: (nominator: Omit<Nominator, 'id' | 'orderNumber'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [judges, setJudges] = useState<Judge[]>(INITIAL_JUDGES);
  const [nominators, setNominators] = useState<Nominator[]>(INITIAL_NOMINATORS);
  const [submissions, setSubmissions] = useState<JudgeScoreSubmission[]>([]);
  const [currentJudge, setCurrentJudgeState] = useState<Judge | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isInitialLoad = useRef(true);

  // Load active judge from localStorage on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedJudgeId = localStorage.getItem('wia_active_judge_id_2026');
      if (savedJudgeId) {
        const found = judges.find(j => j.id === savedJudgeId);
        if (found) setCurrentJudgeState(found);
      }
    }
  }, [judges]);

  const setCurrentJudge = (judge: Judge | null) => {
    setCurrentJudgeState(judge);
    if (typeof window !== 'undefined') {
      if (judge) {
        localStorage.setItem('wia_active_judge_id_2026', judge.id);
      } else {
        localStorage.removeItem('wia_active_judge_id_2026');
      }
    }
  };

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const data: AppStoreData = await res.json();
        if (data.judges && data.judges.length >= 9) setJudges(data.judges);
        if (data.nominators && data.nominators.length > 0) setNominators(data.nominators);
        if (data.submissions) {
          // Normalize any submissions to hundreds scale if they were saved in the old <=100 scale
          const fixedSubs = data.submissions.map((sub) => {
            if (sub.scores && Object.keys(sub.scores).length > 0 && sub.totalWeightedScore <= 100) {
              const recalculated = calculateTotalScore(sub.competition, sub.category, sub.scores);
              return { ...sub, totalWeightedScore: recalculated.total };
            }
            return sub;
          });

          // Merge with local state to ensure no locally saved items are lost
          setSubmissions((prev) => {
            const map = new Map<string, JudgeScoreSubmission>();
            prev.forEach((s) => map.set(`${s.judgeId}-${s.nominatorId}`, s));
            fixedSubs.forEach((s) => map.set(`${s.judgeId}-${s.nominatorId}`, s));
            return Array.from(map.values());
          });
        }
      }
    } catch (err) {
      console.warn('API error, relying on local state', err);
    } finally {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const saveScore = async (submission: JudgeScoreSubmission): Promise<boolean> => {
    // 1. Immediately update React state
    setSubmissions((prev) => {
      const idx = prev.findIndex(
        (s) => s.judgeId === submission.judgeId && s.nominatorId === submission.nominatorId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = submission;
        return copy;
      }
      return [...prev, submission];
    });

    // 2. Save to client localStorage as offline fallback
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `wia_sub_${submission.judgeId}_${submission.nominatorId}`,
          JSON.stringify(submission)
        );
      } catch (err) {
        console.warn('localStorage full, skipping local cache', err);
      }
    }

    // 3. Send to server
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to save score on server:', err);
      return false;
    }
  };

  const getSubmission = useCallback(
    (judgeId: string, nominatorId: string) => {
      const found = submissions.find((s) => s.judgeId === judgeId && s.nominatorId === nominatorId);
      if (found) {
        if (found.scores && Object.keys(found.scores).length > 0 && found.totalWeightedScore <= 100) {
          const recalculated = calculateTotalScore(found.competition, found.category, found.scores);
          return { ...found, totalWeightedScore: recalculated.total };
        }
        return found;
      }

      // Check client localStorage fallback
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem(`wia_sub_${judgeId}_${nominatorId}`);
        if (local) {
          try {
            return JSON.parse(local) as JudgeScoreSubmission;
          } catch (e) {
            // invalid json
          }
        }
      }

      return undefined;
    },
    [submissions]
  );

  const getNominatorById = useCallback(
    (id: string) => {
      return nominators.find((n) => n.id === id);
    },
    [nominators]
  );

  const getCategorySummary = useCallback(
    (competition: CompetitionType, category: string): CategorySummary => {
      const categoryNominators = nominators.filter(
        (n) => n.competition === competition && n.category === category
      );

      const firstNom = categoryNominators[0];
      const categoryLabel = firstNom?.categoryLabel || category.toUpperCase();
      const teamId = firstNom?.teamId || 1;
      const room = firstNom?.room || 'Ruang Graha Perencana BAPPERIDA';

      // 3 Judges assigned to this specific team / room
      const categoryJudges = judges.filter((j) => j.teamId === teamId);

      const nominatorsWithScores = categoryNominators.map((nom) => {
        const nomSubmissions = submissions.filter((s) => s.nominatorId === nom.id);
        const judgeScores = nomSubmissions.map((s) => {
          let scoreVal = s.totalWeightedScore;
          // Ensure scale is hundreds (Maks 500)
          if (s.scores && Object.keys(s.scores).length > 0 && scoreVal <= 100) {
            scoreVal = calculateTotalScore(s.competition, s.category, s.scores).total;
          }
          return {
            judgeId: s.judgeId,
            judgeName: s.judgeName,
            totalScore: scoreVal, // Max 500 per judge
            scores: s.scores,
            notes: s.notes
          };
        });

        // Filter relevant scores from assigned judges
        const relevantScores = judgeScores.filter((js) =>
          categoryJudges.some((cj) => cj.id === js.judgeId)
        );

        // Total akumulasi nilai dari 3 juri (Maksimal 1.500)
        const totalAccumulatedScore = relevantScores.reduce((acc, curr) => acc + curr.totalScore, 0);

        return {
          nominator: nom,
          judgeScores,
          totalAccumulatedScore: Number(totalAccumulatedScore.toFixed(0)),
          averageScore:
            relevantScores.length > 0
              ? Number((totalAccumulatedScore / relevantScores.length).toFixed(1))
              : 0,
          rank: 0
        };
      });

      // Sort descending by totalAccumulatedScore (akumulasi poin 3 juri) to assign rank
      nominatorsWithScores.sort((a, b) => b.totalAccumulatedScore - a.totalAccumulatedScore);
      nominatorsWithScores.forEach((item, index) => {
        item.rank = index + 1;
      });

      return {
        category,
        categoryLabel,
        competition,
        room,
        teamId,
        judges: categoryJudges,
        nominators: nominatorsWithScores
      };
    },
    [nominators, judges, submissions]
  );

  const resetData = async () => {
    // 1. Immediately wipe all cached submissions and drafts from browser localStorage
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('wia_sub_') || key.startsWith('wia_draft_'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (e) {
        console.warn('Failed to clear localStorage keys', e);
      }
    }

    // 2. Clear in-memory React state immediately
    setSubmissions([]);

    // 3. Request server to reset
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const importData = async (data: AppStoreData): Promise<boolean> => {
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  };

  const addJudge = async (judgeData: Omit<Judge, 'id'>) => {
    const newJudge: Judge = {
      ...judgeData,
      id: `juri-${Date.now()}`
    };
    const updated = [...judges, newJudge];
    setJudges(updated);
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judges: updated }),
    });
  };

  const addNominator = async (nomData: Omit<Nominator, 'id' | 'orderNumber'>) => {
    const existingCount = nominators.filter(
      (n) => n.competition === nomData.competition && n.category === nomData.category
    ).length;
    const newNom: Nominator = {
      ...nomData,
      id: `nom-${Date.now()}`,
      orderNumber: existingCount + 1
    };
    const updated = [...nominators, newNom];
    setNominators(updated);
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nominators: updated }),
    });
  };

  const value = useMemo(
    () => ({
      judges,
      nominators,
      submissions,
      currentJudge,
      setCurrentJudge,
      saveScore,
      getSubmission,
      getNominatorById,
      getCategorySummary,
      refreshData,
      resetData,
      importData,
      isLoading,
      addJudge,
      addNominator,
    }),
    [
      judges,
      nominators,
      submissions,
      currentJudge,
      isLoading,
      getSubmission,
      getNominatorById,
      getCategorySummary,
      refreshData
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
