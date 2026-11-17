'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CompetitionType } from '@/types';
import { 
  Shield, 
  BarChart3, 
  FileText, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Settings, 
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Download,
  Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const { nominators, judges, submissions } = useApp();
  const [selectedComp, setSelectedComp] = useState<'ALL' | CompetitionType>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<number>(0); // 0 = all, 1 = tim 1, 2 = tim 2, 3 = tim 3
  const [searchNom, setSearchNom] = useState<string>('');

  const totalPossible = nominators.length * 3; // 3 judges per room
  const totalSubmitted = submissions.length;
  const overallPercentage = totalPossible > 0 ? Math.round((totalSubmitted / totalPossible) * 100) : 0;

  const filteredNominators = nominators.filter(n => {
    if (selectedComp !== 'ALL' && n.competition !== selectedComp) return false;
    if (selectedTeam !== 0 && n.teamId !== selectedTeam) return false;
    if (searchNom.trim()) {
      const q = searchNom.toLowerCase();
      return n.name.toLowerCase().includes(q) || (n.title && n.title.toLowerCase().includes(q)) || (n.institution && n.institution.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Panel Administrator & Panitia BAPPERIDA
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Monitoring & Kendali Penjurian WIA & KRENOVA 2026
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Sistem penilaian dengan bobot skor 500 per juri dan akumulasi nilai akhir dari 3 dewan juri (maksimal 1.500 poin).
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/rundown"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-xs border border-white/20 transition-all"
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>Rundown Jam</span>
          </Link>
          <Link
            href="/admin/rekapitulasi"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-amber-400/20 transition-all hover:scale-105"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Lihat Juara & Rekap</span>
          </Link>
          <Link
            href="/admin/berita-acara"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-xs border border-white/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Cetak Berita Acara</span>
          </Link>
          <Link
            href="/admin/kelola"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2.5 rounded-xl font-semibold text-xs border border-white/20 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Kelola</span>
          </Link>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Lembar Nilai</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalSubmitted}</span>
            <span className="text-xs text-slate-400">/ {totalPossible} lembar juri</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">{overallPercentage}% pengisian selesai</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peserta / Nominator</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{nominators.length}</span>
            <span className="text-xs text-slate-400">Nominator Presentasi</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            34 Peserta WIA (7 Kategori) + 10 Peserta Krenova
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3 Ruangan Sidang</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{judges.length}</span>
            <span className="text-xs text-slate-400">Dewan Juri Resmi (3 Tim)</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Ruang Graha Perencana 1, 2, dan 3 BAPPERIDA
          </p>
        </div>
      </div>

      {/* Jury Matrix Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Matriks Penilaian Real-Time (Juri Ruangan vs Nominator)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nilai satu juri maksimal 500 poin • Akumulasi 3 juri maksimal 1.500 poin
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Team/Room Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedTeam(0)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedTeam === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Semua Ruang
              </button>
              <button
                onClick={() => setSelectedTeam(1)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedTeam === 1 ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Tim 1 (Ruang 3)
              </button>
              <button
                onClick={() => setSelectedTeam(2)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedTeam === 2 ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Tim 2 (Ruang 2)
              </button>
              <button
                onClick={() => setSelectedTeam(3)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedTeam === 3 ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Tim 3 (Ruang 1)
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nominator..."
                value={searchNom}
                onChange={(e) => setSearchNom(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th className="px-4 py-3.5 min-w-[220px]">Nominator & Jadwal</th>
                <th className="px-3 py-3.5 text-center min-w-[100px]">Ruangan</th>
                <th className="px-4 py-3.5 text-center min-w-[240px]">Nilai Dewan Juri Ruangan (Maks 500)</th>
                <th className="px-4 py-3.5 text-center min-w-[120px] bg-amber-50/60 border-l border-r border-amber-200">
                  <span className="text-amber-950 font-black">Akumulasi Poin</span>
                  <span className="text-[10px] text-amber-700 font-bold block">(Maks 1.500)</span>
                </th>
                <th className="px-4 py-3.5 text-center min-w-[90px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredNominators.map((nom, idx) => {
                const roomJudges = judges.filter(j => j.teamId === nom.teamId);
                const nomSubmissions = submissions.filter(s => s.nominatorId === nom.id);
                const isFullyEvaluated = roomJudges.every(rj => nomSubmissions.some(s => s.judgeId === rj.id));
                const totalScoreSum = nomSubmissions.reduce((acc, curr) => acc + curr.totalWeightedScore, 0);

                return (
                  <tr key={nom.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">
                        {nom.title ? nom.title : nom.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                          nom.competition === 'WIA' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {nom.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Pukul {nom.timeSlot}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span className="text-[11px] font-semibold text-slate-600 block">
                        Tim {nom.teamId}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {nom.room.split(' ')[2]} {nom.room.split(' ')[3]}
                      </span>
                    </td>

                    {/* Room Judges 3 Column badges */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {roomJudges.map((j, jIdx) => {
                          const scoreItem = submissions.find(s => s.judgeId === j.id && s.nominatorId === nom.id);
                          return (
                            <div key={j.id} className="text-center" title={`${j.name}: ${scoreItem ? scoreItem.totalWeightedScore.toFixed(0) : 'Belum'}`}>
                              <span className="text-[9px] text-slate-400 block font-semibold">Juri {jIdx + 1}</span>
                              {scoreItem ? (
                                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">
                                  {scoreItem.totalWeightedScore.toFixed(0)}
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-xs">
                                  -
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Total Accumulated Score */}
                    <td className="px-4 py-3 text-center bg-amber-50/60 border-l border-r border-amber-200">
                      {totalScoreSum > 0 ? (
                        <span className="font-black text-amber-950 text-sm">{totalScoreSum.toFixed(0)}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 text-center">
                      {isFullyEvaluated ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          3/3 Lengkap
                        </span>
                      ) : nomSubmissions.length > 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                          {nomSubmissions.length}/3 Juri
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-400 font-medium text-[10px]">
                          Belum Ada
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
