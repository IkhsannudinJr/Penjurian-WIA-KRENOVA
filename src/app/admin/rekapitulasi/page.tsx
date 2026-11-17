'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CompetitionType } from '@/types';
import { 
  Trophy, 
  Medal, 
  Award, 
  ArrowLeft, 
  Printer, 
  FileSpreadsheet, 
  MapPin, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface CategoryTab {
  id: string;
  competition: CompetitionType;
  category: string;
  label: string;
  teamId: number;
}

const CATEGORY_TABS: CategoryTab[] = [
  // Tim 1 (Graha Perencana 3)
  { id: 'wia-opd', competition: 'WIA', category: 'opd', label: 'WIA - OPD', teamId: 1 },
  { id: 'wia-kecamatan', competition: 'WIA', category: 'kecamatan', label: 'WIA - Kecamatan', teamId: 1 },
  { id: 'wia-bumd', competition: 'WIA', category: 'bumd', label: 'WIA - BUMD', teamId: 1 },

  // Tim 2 (Graha Perencana 2)
  { id: 'wia-korwil', competition: 'WIA', category: 'korwilcambidik', label: 'WIA - Korwil Pendidikan', teamId: 2 },
  { id: 'wia-puskesmas', competition: 'WIA', category: 'puskesmas', label: 'WIA - Puskesmas', teamId: 2 },
  { id: 'wia-pelajar', competition: 'WIA', category: 'pelajar', label: 'WIA - SMP / Pelajar', teamId: 2 },

  // Tim 3 (Graha Perencana 1)
  { id: 'krenova-pelajar', competition: 'KRENOVA', category: 'pelajar', label: 'Krenova - Pelajar', teamId: 3 },
  { id: 'krenova-masyarakat', competition: 'KRENOVA', category: 'masyarakat', label: 'Krenova - Masyarakat', teamId: 3 },
  { id: 'wia-desa', competition: 'WIA', category: 'desa', label: 'WIA - Desa / Kelurahan', teamId: 3 },
];

export default function RekapitulasiPage() {
  const { getCategorySummary } = useApp();
  const [activeTabId, setActiveTabId] = useState<string>('wia-opd');

  const activeTab = CATEGORY_TABS.find(t => t.id === activeTabId) || CATEGORY_TABS[0];
  const summary = getCategorySummary(activeTab.competition, activeTab.category);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>JUARA I</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded-full text-xs font-black shadow-sm">
            <Medal className="w-3.5 h-3.5 text-slate-500 fill-slate-400" />
            <span>JUARA II</span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-black shadow-sm">
            <Medal className="w-3.5 h-3.5 text-amber-700 fill-amber-600" />
            <span>JUARA III</span>
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full text-xs font-black shadow-sm">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>HARAPAN I</span>
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 border border-indigo-300 px-3 py-1 rounded-full text-xs font-black shadow-sm">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>HARAPAN II</span>
          </span>
        );
      default:
        return <span className="text-xs text-slate-400 font-medium">Peringkat {rank}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Peringkat', 
      'Nama / Judul Inovasi', 
      'Instansi / Inovator', 
      ...summary.judges.map(j => `Juri (${j.name.split(',')[0]} - Maks 500)`), 
      'Akumulasi Total Poin (Maks 1500)', 
      'Penetapan Juara'
    ];
    const rows = summary.nominators.map(n => {
      const judgeScores = summary.judges.map(j => {
        const found = n.judgeScores.find(js => js.judgeId === j.id);
        return found ? found.totalScore.toFixed(0) : '-';
      });
      const titleOrName = n.nominator.title ? `"${n.nominator.title}"` : `"${n.nominator.name}"`;
      const instOrNom = n.nominator.title ? `"${n.nominator.name} (${n.nominator.institution || ''})"` : `"${n.nominator.institution || ''}"`;
      const predikat = n.rank === 1 ? 'Juara I' : n.rank === 2 ? 'Juara II' : n.rank === 3 ? 'Juara III' : n.rank === 4 ? 'Harapan I' : n.rank === 5 ? 'Harapan II' : `Peringkat ${n.rank}`;
      return [
        n.rank, 
        titleOrName, 
        instOrNom, 
        ...judgeScores, 
        n.totalAccumulatedScore.toFixed(0), 
        predikat
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapitulasi_${activeTab.label.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV / Excel</span>
          </button>

          <Link
            href="/admin/berita-acara"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara</span>
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>Rekapitulasi Nilai & Penetapan Juara</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1 text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{summary.room}</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
            TIM JURI {summary.teamId}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Hasil Penjurian: {summary.categoryLabel}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Penetapan <strong>Juara I, Juara II, Juara III, Harapan I, dan Harapan II</strong> berdasarkan Akumulasi Jumlah Poin dari 3 Dewan Juri (Maksimal 1.500 Poin).
        </p>

        {/* Assigned 3 Judges Mini List */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">3 Dewan Juri Penilai:</span>
          {summary.judges.map((j, idx) => (
            <span key={j.id} className="bg-white/10 text-white px-2.5 py-1 rounded-lg font-semibold">
              {idx + 1}. {j.name}
            </span>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print">
        {CATEGORY_TABS.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 opacity-60 text-[10px]">T{tab.teamId}</span>
            </button>
          );
        })}
      </div>

      {/* PODIUM UTAMA: JUARA 1, JUARA 2, JUARA 3 */}
      {summary.nominators.length >= 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Podium Juara Utama (I, II, III)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* Juara 2 */}
            {summary.nominators[1] && (
              <div className="order-2 md:order-1 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm text-center relative overflow-hidden">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xl mb-3 shadow-inner">
                  2
                </div>
                <span className="text-xs font-black uppercase px-3 py-1 bg-slate-100 text-slate-800 rounded-full border border-slate-300">
                  JUARA II
                </span>
                <h3 className="font-extrabold text-slate-900 mt-3 text-base line-clamp-2">
                  {summary.nominators[1].nominator.title || summary.nominators[1].nominator.name}
                </h3>
                {summary.nominators[1].nominator.title && (
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    {summary.nominators[1].nominator.name}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-3xl font-black text-slate-800">
                    {summary.nominators[1].totalAccumulatedScore > 0 ? summary.nominators[1].totalAccumulatedScore.toFixed(0) : '-'}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">
                    Akumulasi Poin (Maks 1.500)
                  </span>
                </div>
              </div>
            )}

            {/* Juara 1 */}
            {summary.nominators[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white rounded-3xl border-2 border-amber-400 p-7 shadow-lg text-center relative overflow-hidden -translate-y-2">
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Peringkat Tertinggi
                </div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl mb-3 shadow-md shadow-amber-400/30">
                  <Trophy className="w-8 h-8 fill-slate-950 text-slate-950" />
                </div>
                <span className="text-xs font-black uppercase px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  JUARA I (EMAS)
                </span>
                <h3 className="font-black text-slate-900 mt-3 text-lg line-clamp-2">
                  {summary.nominators[0].nominator.title || summary.nominators[0].nominator.name}
                </h3>
                {summary.nominators[0].nominator.title && (
                  <p className="text-xs text-blue-700 font-bold mt-1">
                    {summary.nominators[0].nominator.name}
                  </p>
                )}
                <div className="mt-5 pt-4 border-t border-amber-200">
                  <span className="text-4xl font-black text-amber-600">
                    {summary.nominators[0].totalAccumulatedScore > 0 ? summary.nominators[0].totalAccumulatedScore.toFixed(0) : '-'}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5 font-bold uppercase tracking-wider">
                    Akumulasi Poin (Maks 1.500)
                  </span>
                </div>
              </div>
            )}

            {/* Juara 3 */}
            {summary.nominators[2] && (
              <div className="order-3 bg-white rounded-3xl border-2 border-amber-200/80 p-6 shadow-sm text-center relative overflow-hidden">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-black text-xl mb-3 shadow-inner">
                  3
                </div>
                <span className="text-xs font-black uppercase px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                  JUARA III
                </span>
                <h3 className="font-extrabold text-slate-900 mt-3 text-base line-clamp-2">
                  {summary.nominators[2].nominator.title || summary.nominators[2].nominator.name}
                </h3>
                {summary.nominators[2].nominator.title && (
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    {summary.nominators[2].nominator.name}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-3xl font-black text-slate-800">
                    {summary.nominators[2].totalAccumulatedScore > 0 ? summary.nominators[2].totalAccumulatedScore.toFixed(0) : '-'}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">
                    Akumulasi Poin (Maks 1.500)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PEMENANG HARAPAN: HARAPAN I & HARAPAN II */}
      {summary.nominators.length >= 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Pemenang Harapan (Harapan I & Harapan II)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Harapan I */}
            {summary.nominators[3] && (
              <div className="bg-gradient-to-br from-blue-50/60 to-white rounded-3xl border-2 border-blue-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 border border-blue-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                      <Award className="w-4 h-4 text-blue-700" />
                      <span>JUARA HARAPAN I</span>
                    </span>
                    <span className="text-xs font-black px-2.5 py-1 bg-white text-blue-800 border border-blue-200 rounded-lg shadow-sm">
                      Peringkat 4
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {summary.nominators[3].nominator.title || summary.nominators[3].nominator.name}
                  </h4>
                  {summary.nominators[3].nominator.title ? (
                    <p className="text-xs text-blue-700 font-semibold mt-1">
                      Inovator: {summary.nominators[3].nominator.name} {summary.nominators[3].nominator.institution && `(${summary.nominators[3].nominator.institution})`}
                    </p>
                  ) : (
                    summary.nominators[3].nominator.institution && (
                      <p className="text-xs text-slate-500 mt-1">
                        {summary.nominators[3].nominator.institution}
                      </p>
                    )
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-blue-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akumulasi Poin 3 Juri:</span>
                  <span className="text-2xl font-black text-blue-900">
                    {summary.nominators[3].totalAccumulatedScore > 0 ? summary.nominators[3].totalAccumulatedScore.toFixed(0) : '-'} <span className="text-xs font-bold text-slate-400">/ 1.500</span>
                  </span>
                </div>
              </div>
            )}

            {/* Harapan II */}
            {summary.nominators[4] && (
              <div className="bg-gradient-to-br from-indigo-50/60 to-white rounded-3xl border-2 border-indigo-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-900 border border-indigo-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                      <Award className="w-4 h-4 text-indigo-700" />
                      <span>JUARA HARAPAN II</span>
                    </span>
                    <span className="text-xs font-black px-2.5 py-1 bg-white text-indigo-800 border border-indigo-200 rounded-lg shadow-sm">
                      Peringkat 5
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {summary.nominators[4].nominator.title || summary.nominators[4].nominator.name}
                  </h4>
                  {summary.nominators[4].nominator.title ? (
                    <p className="text-xs text-indigo-700 font-semibold mt-1">
                      Inovator: {summary.nominators[4].nominator.name} {summary.nominators[4].nominator.institution && `(${summary.nominators[4].nominator.institution})`}
                    </p>
                  ) : (
                    summary.nominators[4].nominator.institution && (
                      <p className="text-xs text-slate-500 mt-1">
                        {summary.nominators[4].nominator.institution}
                      </p>
                    )
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-indigo-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akumulasi Poin 3 Juri:</span>
                  <span className="text-2xl font-black text-indigo-900">
                    {summary.nominators[4].totalAccumulatedScore > 0 ? summary.nominators[4].totalAccumulatedScore.toFixed(0) : '-'} <span className="text-xs font-bold text-slate-400">/ 1.500</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comprehensive Results Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">
            Tabel Rekapitulasi Nilai & Penetapan Pemenang ({summary.room})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap urutan Juara I, Juara II, Juara III, Harapan I, dan Harapan II
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 text-center w-14">Rank</th>
                <th className="px-4 py-3.5 min-w-[240px]">Nominator & Inovasi</th>
                {summary.judges.map((j, i) => (
                  <th key={j.id} className="px-3 py-3.5 text-center min-w-[125px]">
                    <span className="block font-bold text-slate-800">Juri {i + 1} (Maks 500)</span>
                    <span className="text-[10px] text-slate-400 font-normal truncate block max-w-[125px]" title={j.name}>
                      {j.name.split(',')[0]}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3.5 text-center min-w-[150px] bg-amber-50/70 border-l border-r border-amber-200">
                  <span className="text-amber-950 font-black block text-sm">Akumulasi Poin</span>
                  <span className="text-[10px] text-amber-800 font-bold block">(Maksimal 1.500)</span>
                </th>
                <th className="px-4 py-3.5 text-center min-w-[140px]">Penetapan Juara</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {summary.nominators.map((row) => {
                return (
                  <tr
                    key={row.nominator.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      row.rank === 1 ? 'bg-amber-50/20 font-semibold' : ''
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-black text-xs ${
                        row.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-sm' :
                        row.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        row.rank === 3 ? 'bg-amber-100 text-amber-900' :
                        row.rank === 4 ? 'bg-blue-100 text-blue-900' :
                        row.rank === 5 ? 'bg-indigo-100 text-indigo-900' : 'text-slate-500'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {row.nominator.title ? row.nominator.title : row.nominator.name}
                      </div>
                      {row.nominator.title ? (
                        <div className="text-xs text-blue-700 font-medium mt-0.5">
                          Inovator: {row.nominator.name} {row.nominator.institution && `(${row.nominator.institution})`}
                        </div>
                      ) : (
                        row.nominator.institution && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            {row.nominator.institution}
                          </div>
                        )
                      )}
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <span>Pukul: {row.nominator.timeSlot}</span>
                      </div>
                    </td>

                    {/* Judge Individual Scores (Maks 500) */}
                    {summary.judges.map((j) => {
                      const scoreData = row.judgeScores.find((js) => js.judgeId === j.id);
                      return (
                        <td key={j.id} className="px-3 py-4 text-center">
                          {scoreData ? (
                            <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
                              {scoreData.totalScore.toFixed(0)}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Accumulated Score (Maks 1.500) */}
                    <td className="px-4 py-4 text-center bg-amber-50/70 border-l border-r border-amber-200">
                      <span className="text-base font-black text-amber-950">
                        {row.totalAccumulatedScore > 0 ? row.totalAccumulatedScore.toFixed(0) : '-'}
                      </span>
                    </td>

                    {/* Predicate */}
                    <td className="px-4 py-4 text-center">
                      {row.totalAccumulatedScore > 0 ? getRankBadge(row.rank) : <span className="text-slate-300">-</span>}
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
