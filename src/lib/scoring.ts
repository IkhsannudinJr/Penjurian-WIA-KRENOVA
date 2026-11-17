import { Criterion, CompetitionType } from '../types';
import { WIA_CRITERIA, KRENOVA_PELAJAR_CRITERIA, KRENOVA_MASYARAKAT_CRITERIA } from '../data/initialData';

export function getCriteriaForNominator(competition: CompetitionType, category: string): Criterion[] {
  if (competition === 'WIA') {
    return WIA_CRITERIA;
  }
  if (category === 'pelajar') {
    return KRENOVA_PELAJAR_CRITERIA;
  }
  return KRENOVA_MASYARAKAT_CRITERIA;
}

export function calculateTotalScore(
  competition: CompetitionType,
  category: string,
  scores: Record<string, number>
): {
  total: number; // Max 500 (Score 1..5 * Weight, sum of weights = 100 -> Max = 5 * 100 = 500)
  maxPossible: number;
  breakdown: {
    criterionId: string;
    criterionName: string;
    weight: number;
    subScores: { id: string; name: string; score: number }[];
    avgScore: number;
    weightedScore: number; // avgScore * weight (Max = 5 * weight)
    maxCriterionScore: number; // 5 * weight
  }[];
} {
  const criteria = getCriteriaForNominator(competition, category);
  let total = 0;
  let maxPossible = 0;

  const breakdown = criteria.map((crit) => {
    const maxCriterionScore = 5 * crit.weight;
    maxPossible += maxCriterionScore;

    if (crit.subCriteria && crit.subCriteria.length > 0) {
      const subScores = crit.subCriteria.map((sub) => ({
        id: sub.id,
        name: sub.name,
        score: scores[sub.id] || 0
      }));

      const sum = subScores.reduce((acc, curr) => acc + curr.score, 0);
      const avgScore = sum > 0 ? sum / subScores.length : 0;
      // Formula sesuai ketentuan: Skor rata-rata (1..5) dikali Bobot
      // Jika maks (5) x bobot: e.g. 5 x 20 = 100
      const weightedScore = avgScore * crit.weight;
      total += weightedScore;

      return {
        criterionId: crit.id,
        criterionName: crit.name,
        weight: crit.weight,
        subScores,
        avgScore: Number(avgScore.toFixed(2)),
        weightedScore: Number(weightedScore.toFixed(2)),
        maxCriterionScore
      };
    } else {
      const score = scores[crit.id] || 0;
      // Formula: Skor (1..5) dikali Bobot (misal 5 x 15 = 75, 5 x 25 = 125, dst)
      const weightedScore = score * crit.weight;
      total += weightedScore;

      return {
        criterionId: crit.id,
        criterionName: crit.name,
        weight: crit.weight,
        subScores: [],
        avgScore: score,
        weightedScore: Number(weightedScore.toFixed(2)),
        maxCriterionScore
      };
    }
  });

  return {
    total: Number(total.toFixed(2)),
    maxPossible: 500,
    breakdown
  };
}
