'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Printer, 
  ArrowRight, 
  CheckCircle, 
  Award,
  Sparkles,
  School,
  Building2,
  Home
} from 'lucide-react';

export default function RundownPage() {
  const { nominators, judges, currentJudge, submissions } = useApp();
  const [activeRoomTeam, setActiveRoomTeam] = useState<number>(1);

  const team1Judges = judges.filter(j => j.teamId === 1);
  const team2Judges = judges.filter(j => j.teamId === 2);
  const team3Judges = judges.filter(j => j.teamId === 3);

  const currentTeamJudges = activeRoomTeam === 1 ? team1Judges : activeRoomTeam === 2 ? team2Judges : team3Judges;
  const currentRoomName = activeRoomTeam === 1 
    ? 'Ruang Graha Perencana 3 BAPPERIDA' 
    : activeRoomTeam === 2 
    ? 'Ruang Graha Perencana 2 BAPPERIDA' 
    : 'Ruang Graha Perencana 1 BAPPERIDA';

  const roomNominators = nominators
    .filter(n => n.teamId === activeRoomTeam)
    .sort((a, b) => a.scheduleOrder - b.scheduleOrder);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
      {/* Top Banner (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Rabu, 25 November 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Rundown & Jadwal Presentasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Susunan Urutan Pendalaman Materi Wonogiri Innovation Award & KRENOVA 2026
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Jadwal Rundown</span>
        </button>
      </div>

      {/* Room Tabs (Hidden on Print) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 no-print">
        {/* Tab 1 */}
        <button
          onClick={() => setActiveRoomTeam(1)}
          className={`p-4 rounded-2xl text-left border-2 transition-all ${
            activeRoomTeam === 1
              ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              TIM JURI 1
            </span>
            <span className="text-xs font-bold text-slate-400">14 Presentasi</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm mt-2">
            Ruang Graha Perencana 3
          </h3>
          <p className="text-xs text-blue-700 font-semibold mt-0.5">
            OPD • Kecamatan • BUMD
          </p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            FX. Pranata • Prof. Hesti Sadyadi • M. Diky Praditia
          </p>
        </button>

        {/* Tab 2 */}
        <button
          onClick={() => setActiveRoomTeam(2)}
          className={`p-4 rounded-2xl text-left border-2 transition-all ${
            activeRoomTeam === 2
              ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600/20'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              TIM JURI 2
            </span>
            <span className="text-xs font-bold text-slate-400">15 Presentasi</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm mt-2">
            Ruang Graha Perencana 2
          </h3>
          <p className="text-xs text-emerald-700 font-semibold mt-0.5">
            Korwil Pendidikan • Puskesmas • SMP
          </p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Prof. Chatarina • Purwadi • Sunan Fanijie
          </p>
        </button>

        {/* Tab 3 */}
        <button
          onClick={() => setActiveRoomTeam(3)}
          className={`p-4 rounded-2xl text-left border-2 transition-all ${
            activeRoomTeam === 3
              ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              TIM JURI 3
            </span>
            <span className="text-xs font-bold text-slate-400">15 Presentasi</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm mt-2">
            Ruang Graha Perencana 1
          </h3>
          <p className="text-xs text-amber-800 font-semibold mt-0.5">
            Krenova Pelajar • Masyarakat • Desa
          </p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Wijiyanto • Dr. Widia Darma • Sony Suharsono
          </p>
        </button>
      </div>

      {/* Room Details & Judges Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{currentRoomName}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Tim Juri {activeRoomTeam}
            </h2>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full self-start sm:self-auto">
            Rabu, 25 November 2026 • 08.00 s/d 12.00 WIB
          </span>
        </div>

        {/* 3 Judges Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {currentTeamJudges.map((j, i) => (
            <div key={j.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0">
                {i + 1}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-slate-900 text-xs truncate" title={j.name}>
                  {j.name}
                </h4>
                <p className="text-[10px] text-slate-500 truncate">{j.role}</p>
                {j.institution && (
                  <p className="text-[9px] text-blue-600 truncate font-medium">{j.institution}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Schedule List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Urutan Presentasi & Jadwal Waktu</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Durasi: 15 menit per nominator
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {roomNominators.map((nom, idx) => {
            const isEvaluatedByMe = currentJudge 
              ? submissions.some(s => s.judgeId === currentJudge.id && s.nominatorId === nom.id)
              : false;
            
            const totalEvals = submissions.filter(s => s.nominatorId === nom.id).length;

            return (
              <div
                key={nom.id}
                className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Order & Time badge */}
                  <div className="flex flex-col items-center justify-center shrink-0 w-24">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      URUTAN #{nom.scheduleOrder}
                    </span>
                    <span className="inline-flex items-center gap-1 font-black text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg mt-1 border border-blue-100">
                      <Clock className="w-3 h-3" />
                      <span>{nom.timeSlot}</span>
                    </span>
                  </div>

                  {/* Nominator Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        nom.competition === 'WIA' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {nom.categoryLabel}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {nom.title ? nom.title : nom.name}
                    </h4>

                    {nom.title ? (
                      <p className="text-xs text-blue-700 font-semibold mt-0.5">
                        Inovator: {nom.name} {nom.institution && `(${nom.institution})`}
                      </p>
                    ) : (
                      nom.institution && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {nom.institution}
                        </p>
                      )
                    )}

                    {nom.description && (
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-1 italic max-w-2xl">
                        "{nom.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action / Evaluation Badge */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-semibold">Status Penjurian</span>
                    <span className={`text-xs font-bold ${
                      totalEvals === 3 ? 'text-emerald-600' : totalEvals > 0 ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {totalEvals} / 3 Juri Selesai
                    </span>
                  </div>

                  <Link
                    href={`/juri/nilai/${nom.id}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isEvaluatedByMe
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                    }`}
                  >
                    <span>{isEvaluatedByMe ? 'Lihat / Ubah Nilai' : 'Beri Nilai'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
