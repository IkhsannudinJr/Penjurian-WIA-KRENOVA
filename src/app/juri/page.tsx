'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CompetitionType } from '@/types';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Award, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  ChevronRight,
  MapPin,
  Calendar,
  AlertCircle,
  User
} from 'lucide-react';

export default function JuriDashboard() {
  const { currentJudge, judges, setCurrentJudge, nominators, submissions } = useApp();
  const [selectedCompetition, setSelectedCompetition] = useState<'ALL' | CompetitionType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyMyTeam, setOnlyMyTeam] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // If judge is not selected, display judge selection prompt grouped by 3 teams
  if (!currentJudge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
          <div className="text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Pilih Identitas Dewan Juri
            </h2>
            <p className="mt-2 text-slate-500 text-xs sm:text-sm">
              Sesuai Surat Keputusan Kepala BAPPERIDA Kab. Wonogiri No. B/1208/000.9/XI/2026. Silakan pilih nama Anda pada tim ruangan yang bersangkutan:
            </p>
          </div>

          {/* Grouped by 3 Teams */}
          <div className="mt-8 space-y-6">
            {[1, 2, 3].map((tId) => {
              const teamJudges = judges.filter(j => j.teamId === tId);
              const roomName = tId === 1 
                ? 'Ruang Graha Perencana 1 (OPD, Kecamatan, BUMD)'
                : tId === 2 
                ? 'Ruang Graha Perencana 2 (Korwil, Puskesmas, SMP)'
                : 'Ruang Graha Perencana 3 (Krenova Pelajar, Masyarakat, Desa)';

              return (
                <div key={tId} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      tId === 1 ? 'bg-blue-600 text-white' : tId === 2 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      TIM JURI {tId}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {roomName}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {teamJudges.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => setCurrentJudge(j)}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group flex flex-col justify-between shadow-sm hover:shadow"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">
                            {j.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1">{j.role}</p>
                          {j.institution && (
                            <p className="text-[10px] text-blue-600 font-medium mt-0.5">{j.institution}</p>
                          )}
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                          <span>Pilih & Mulai</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            Identitas yang Anda pilih akan tersimpan otomatis di perangkat ini selama sesi penjurian.
          </div>
        </div>
      </div>
    );
  }

  // Filter nominators
  const filteredNominators = nominators.filter((nom) => {
    if (onlyMyTeam && currentJudge.teamId && nom.teamId !== currentJudge.teamId) {
      return false;
    }
    if (selectedCompetition !== 'ALL' && nom.competition !== selectedCompetition) {
      return false;
    }
    if (selectedCategory !== 'ALL' && nom.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = nom.name.toLowerCase().includes(q);
      const matchTitle = nom.title ? nom.title.toLowerCase().includes(q) : false;
      const matchInst = nom.institution ? nom.institution.toLowerCase().includes(q) : false;
      return matchName || matchTitle || matchInst;
    }
    return true;
  });

  // Calculate judge specific stats
  const targetNominators = onlyMyTeam 
    ? nominators.filter(n => n.teamId === currentJudge.teamId)
    : nominators;

  const judgeSubmissions = submissions.filter((s) => s.judgeId === currentJudge.id);
  const evaluatedCount = judgeSubmissions.length;
  const totalCount = targetNominators.length;
  const completionPercentage = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
      {/* Judge Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20 shrink-0">
            {currentJudge.teamId}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                TIM JURI {currentJudge.teamId}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>{currentJudge.room}</span>
              </span>
              <button
                onClick={() => setCurrentJudge(null)}
                className="text-xs text-slate-400 hover:text-blue-600 underline font-medium ml-1"
              >
                Ganti Juri
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {currentJudge.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {currentJudge.role} {currentJudge.institution && `— ${currentJudge.institution}`}
            </p>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:min-w-[260px]">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">Progres Ruangan Anda</span>
            <span className="text-blue-600 font-bold">{evaluatedCount} / {totalCount} ({completionPercentage}%)</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Rabu, 25 Nov 2026</span>
            <div className="flex items-center gap-3">
              <Link href="/timer" className="text-rose-600 hover:underline font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Timer</span>
              </Link>
              <Link href="/rundown" className="text-blue-600 hover:underline font-semibold">
                Rundown
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Room filter toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 text-xs font-bold">
            <button
              onClick={() => setOnlyMyTeam(true)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                onlyMyTeam ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ruangan Tim Saya ({targetNominators.length})
            </button>
            <button
              onClick={() => setOnlyMyTeam(false)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                !onlyMyTeam ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Ruangan ({nominators.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama instansi, judul inovasi, atau peserta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Nominators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNominators.map((nom) => {
          const submission = submissions.find(
            (s) => s.judgeId === currentJudge.id && s.nominatorId === nom.id
          );
          const isEvaluated = !!submission;

          return (
            <div
              key={nom.id}
              className={`bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between hover:shadow-lg ${
                isEvaluated
                  ? 'border-emerald-200 bg-gradient-to-b from-white to-emerald-50/20'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      nom.competition === 'WIA'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {nom.categoryLabel}
                  </span>

                  {isEvaluated ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{submission.totalWeightedScore.toFixed(0)} / 500</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Belum Dinilai</span>
                    </span>
                  )}
                </div>

                {/* Schedule Time Badge */}
                <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Jadwal: {nom.timeSlot}</span>
                  <span className="text-slate-300">•</span>
                  <span>Urutan #{nom.scheduleOrder}</span>
                </div>

                {/* Main Content */}
                {nom.title ? (
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {nom.title}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
                      <User className="w-3 h-3 shrink-0" />
                      <span>{nom.name}</span>
                    </p>
                    {nom.institution && (
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {nom.institution}
                      </p>
                    )}
                    {nom.description && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed italic bg-slate-50 p-2 rounded-lg">
                        "{nom.description}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {nom.name}
                    </h3>
                    {nom.institution && (
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {nom.institution}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link
                  href={`/juri/nilai/${nom.id}`}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isEvaluated
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  <span>{isEvaluated ? 'Ubah / Review Nilai' : 'Beri Nilai Presentasi'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
