'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getCriteriaForNominator, calculateTotalScore } from '@/lib/scoring';
import { JudgeScoreSubmission } from '@/types';
import { 
  ArrowLeft, 
  Award, 
  Sparkles, 
  CheckCircle, 
  Save, 
  Info, 
  FileText, 
  Lock, 
  Unlock,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  Clock,
  MapPin
} from 'lucide-react';

export default function NilaiPage() {
  const params = useParams();
  const router = useRouter();
  const nominatorId = params?.id as string;
  const { currentJudge, getNominatorById, getSubmission, saveScore, nominators } = useApp();

  const nominator = getNominatorById(nominatorId);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load existing submission if any
  useEffect(() => {
    if (currentJudge && nominatorId) {
      const existing = getSubmission(currentJudge.id, nominatorId);
      if (existing) {
        setScores(existing.scores || {});
        setNotes(existing.notes || '');
        setIsLocked(existing.isLocked || false);
      }
    }
  }, [currentJudge, nominatorId, getSubmission]);

  if (!nominator) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Nominator tidak ditemukan</h2>
        <Link href="/juri" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-semibold">
          Kembali ke daftar nominator
        </Link>
      </div>
    );
  }

  if (!currentJudge) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Sesi Juri Belum Dipilih</h2>
        <p className="text-sm text-slate-500 mt-2">Silakan pilih profil dewan juri terlebih dahulu.</p>
        <Link href="/juri" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow">
          Pilih Juri
        </Link>
      </div>
    );
  }

  const criteria = getCriteriaForNominator(nominator.competition, nominator.category);
  const { total, breakdown, maxPossible } = calculateTotalScore(nominator.competition, nominator.category, scores);

  // Check how many items have been scored
  let totalItemsToScore = 0;
  let scoredItemsCount = 0;

  criteria.forEach(c => {
    if (c.subCriteria && c.subCriteria.length > 0) {
      c.subCriteria.forEach(sub => {
        totalItemsToScore++;
        if (scores[sub.id] && scores[sub.id] > 0) scoredItemsCount++;
      });
    } else {
      totalItemsToScore++;
      if (scores[c.id] && scores[c.id] > 0) scoredItemsCount++;
    }
  });

  const isComplete = totalItemsToScore > 0 && scoredItemsCount === totalItemsToScore;

  const handleScoreChange = (id: string, value: number) => {
    if (isLocked) return;
    setScores(prev => ({ ...prev, [id]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async (lockSubmission: boolean = false) => {
    setIsSaving(true);
    const submissionData: JudgeScoreSubmission = {
      id: `sub-${currentJudge.id}-${nominator.id}`,
      judgeId: currentJudge.id,
      judgeName: currentJudge.name,
      nominatorId: nominator.id,
      competition: nominator.competition,
      category: nominator.category,
      scores,
      notes,
      totalWeightedScore: total, // Scale 0..500
      submittedAt: new Date().toISOString(),
      isLocked: lockSubmission
    };

    const success = await saveScore(submissionData);
    setIsSaving(false);
    if (success) {
      setIsLocked(lockSubmission);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  // Find next nominator in same room
  const sameRoomNominators = nominators.filter(n => n.teamId === nominator.teamId);
  const currentIndex = sameRoomNominators.findIndex(n => n.id === nominator.id);
  const nextNominator = currentIndex >= 0 && currentIndex < sameRoomNominators.length - 1 ? sameRoomNominators[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/juri"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-sm self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Peserta</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-900">{currentJudge.name}</span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-600 font-semibold">Tim {currentJudge.teamId}</span>
        </div>
      </div>

      {/* Nominator Information Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              nominator.competition === 'WIA'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {nominator.competition} 2026 • {nominator.categoryLabel}
          </span>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Pukul {nominator.timeSlot} (Urutan #{nominator.scheduleOrder})</span>
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{nominator.room}</span>
          </span>
          {isLocked && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              <span>Nilai Terkunci</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {nominator.title ? nominator.title : nominator.name}
        </h1>

        {nominator.title ? (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-bold text-blue-700">
              Inovator: {nominator.name}
              {nominator.teamMembers && nominator.teamMembers.length > 0 && (
                <span className="font-normal text-slate-600">
                  {' '}bersama {nominator.teamMembers.join(', ')}
                </span>
              )}
            </p>
            {nominator.institution && (
              <p className="text-xs font-medium text-slate-500">
                Asal / Lembaga: {nominator.institution}
              </p>
            )}
            {nominator.description && (
              <div className="mt-3 bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-blue-900 mb-0.5">Deskripsi / Gagasan Inovasi:</p>
                <p>{nominator.description}</p>
              </div>
            )}
          </div>
        ) : (
          nominator.institution && (
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Wilayah / Induk: {nominator.institution}
            </p>
          )
        )}
      </div>

      {/* Floating / Sticky Live Score Summary */}
      <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-400 text-slate-950 font-black flex flex-col items-center justify-center shadow-md shrink-0">
            <span className="text-xl font-black leading-none">{total.toFixed(0)}</span>
            <span className="text-[9px] font-bold opacity-75">/ 500</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">TOTAL POIN DEWAN JURI</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                Maksimal 500 Poin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kalkulasi: Σ (Skor 1..5 × Bobot). Progres: <strong className="text-white">{scoredItemsCount} dari {totalItemsToScore}</strong> kriteria terisi.
            </p>
          </div>
        </div>

        {/* Action buttons inside bar */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-800 sm:border-t-0">
          {isLocked ? (
            <button
              onClick={() => setIsLocked(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Kunci</span>
            </button>
          ) : (
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Draf'}</span>
            </button>
          )}

          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || !isComplete}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isComplete
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci & Kirim Nilai</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            Nilai untuk {nominator.title || nominator.name} berhasil tersimpan ke sistem penjurian! Total Poin: <strong>{total.toFixed(0)} / 500</strong>.
          </p>
        </div>
      )}

      {/* Scoring Rubric Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Rubrik & Kriteria Penilaian Teknis</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            Skala Nilai: 1 (Buruk) s/d 5 (Sangat Baik)
          </span>
        </div>

        {/* Criteria List */}
        {criteria.map((crit, idx) => {
          const breakdownItem = breakdown.find(b => b.criterionId === crit.id);

          return (
            <div
              key={crit.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm transition-all"
            >
              {/* Criterion Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      {crit.name}
                    </h3>
                  </div>
                  {crit.description && (
                    <p className="text-xs text-slate-500 mt-1 pl-8">
                      {crit.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto pl-8 sm:pl-0">
                  <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
                    Bobot: {crit.weight}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Poin Terbobot (Skor × Bobot)</span>
                    <span className="text-sm font-black text-slate-900">
                      {breakdownItem ? breakdownItem.weightedScore.toFixed(0) : '0'} / {crit.weight * 5}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-criteria or Direct Criterion Scoring */}
              {crit.subCriteria && crit.subCriteria.length > 0 ? (
                <div className="mt-5 space-y-5">
                  {crit.subCriteria.map((sub) => {
                    const currentScore = scores[sub.id] || 0;
                    return (
                      <div
                        key={sub.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                              {sub.name}
                            </h4>
                            {sub.description && (
                              <p className="text-xs text-slate-500 mt-0.5">{sub.description}</p>
                            )}
                          </div>
                          {currentScore > 0 && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                              Skor: {currentScore} / 5
                            </span>
                          )}
                        </div>

                        {/* 1 - 5 Rating Buttons */}
                        <div className="grid grid-cols-5 gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = currentScore === val;
                            const labels = ['Buruk (1)', 'Kurang (2)', 'Cukup (3)', 'Baik (4)', 'Sangat Baik (5)'];
                            return (
                              <button
                                key={val}
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleScoreChange(sub.id, val)}
                                className={`py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600 ring-offset-2'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                } ${isLocked ? 'cursor-not-allowed opacity-75' : ''}`}
                              >
                                <span className="text-base font-black">{val}</span>
                                <span className="text-[10px] hidden sm:block opacity-80">
                                  {labels[val - 1].split(' ')[0]}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      Pilih Nilai (1 s/d 5):
                    </span>
                    {scores[crit.id] && scores[crit.id] > 0 && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Skor: {scores[crit.id]} / 5 (Poin: {scores[crit.id] * crit.weight})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = scores[crit.id] === val;
                      const labels = ['1 - Buruk', '2 - Kurang', '3 - Cukup', '4 - Baik', '5 - Sangat Baik'];
                      return (
                        <button
                          key={val}
                          type="button"
                          disabled={isLocked}
                          onClick={() => handleScoreChange(crit.id, val)}
                          className={`py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600 ring-offset-2'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          } ${isLocked ? 'cursor-not-allowed opacity-75' : ''}`}
                        >
                          <span className="text-lg font-black">{val}</span>
                          <span className="text-[10px] hidden sm:block opacity-80">
                            {labels[val - 1].split(' - ')[1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Qualitative Notes Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Catatan, Evaluasi & Rekomendasi Dewan Juri
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Berikan masukan kualitatif, apresiasi poin inovasi terkuat, atau catatan tindak lanjut untuk nominator.
          </p>

          <textarea
            rows={4}
            disabled={isLocked}
            placeholder="Tuliskan catatan, pertimbangan nilai, atau rekomendasi untuk peserta di sini..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-y"
          />
        </div>
      </div>

      {/* Bottom Completion Banner & Next Button */}
      <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-lg font-bold">
            {isComplete ? 'Seluruh Aspek Penilaian Telah Terisi Lengkap!' : 'Lengkapi Seluruh Kriteria Penilaian'}
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Total Poin Dewan Juri: <span className="font-black text-amber-300 text-base">{total.toFixed(0)} / 500 Poin</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || !isComplete}
            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
              isComplete
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/20'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Kunci & Simpan Nilai</span>
          </button>

          {nextNominator && (
            <Link
              href={`/juri/nilai/${nextNominator.id}`}
              className="px-4 py-3 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Nominator Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
