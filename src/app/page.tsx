'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { 
  Award, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

export default function HomePage() {
  const { nominators, judges, submissions, currentJudge } = useApp();

  const wiaCount = nominators.filter(n => n.competition === 'WIA').length;
  const krenovaCount = nominators.filter(n => n.competition === 'KRENOVA').length;
  const totalSubmissions = submissions.length;
  const maxPossibleSubmissions = nominators.length * 3; // 3 judges per room
  const progressPercent = maxPossibleSubmissions > 0 
    ? Math.round((totalSubmissions / maxPossibleSubmissions) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              BAPPERIDA KABUPATEN WONOGIRI
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Sistem Penjurian Presentasi <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                WIA & KRENOVA 2026
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Platform otomatisasi penilaian presentasi dan pendalaman materi Wonogiri Innovation Award & Krenova. Dilengkapi pembagian 3 Tim Dewan Juri, 3 Ruangan Graha Perencana, serta rundown waktu resmi.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Rabu, 25 November 2026</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Ruang Graha Perencana 1, 2 & 3 BAPPERIDA</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/juri"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
              >
                <UserCheck className="w-5 h-5 text-slate-950" />
                <span>Mulai Penjurian (Juri)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/rundown"
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl backdrop-blur-md border border-white/20 transition-all hover:scale-105"
              >
                <Calendar className="w-5 h-5 text-amber-300" />
                <span>Lihat Rundown & Jadwal</span>
              </Link>
            </div>
          </div>

          {/* Logo Badge Hero Card (Transparent) */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl shrink-0">
            <div className="relative w-44 h-36 flex items-center justify-center p-2">
              <Image
                src="/logo-wia-white-text.png"
                alt="Logo Resmi Wonogiri Innovation Award & Krenova"
                width={176}
                height={135}
                className="object-contain w-full h-full drop-shadow-md"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Judging Rooms Overview Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <span>3 Ruangan Sidang Penjurian Paralel</span>
          </h2>
          <Link href="/rundown" className="text-xs text-blue-600 font-bold hover:underline">
            Lihat Jadwal Lengkap →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Room 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                TIM JURI 1
              </span>
              <span className="text-xs font-bold text-slate-400">14 Nominator</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Ruang Graha Perencana 1
            </h3>
            <p className="text-xs font-semibold text-blue-700">
              Perangkat Daerah (OPD) • Kecamatan • BUMD
            </p>
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
              <p>• <strong>FX. Pranata, A.P., M.Hum.</strong> (Sekda)</p>
              <p>• <strong>Prof. Dr. Hesti Sadyadi</strong> (STABN)</p>
              <p>• <strong>Mokhamad Diky Praditia</strong> (Solopos)</p>
            </div>
          </div>

          {/* Room 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                TIM JURI 2
              </span>
              <span className="text-xs font-bold text-slate-400">15 Nominator</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Ruang Graha Perencana 2
            </h3>
            <p className="text-xs font-semibold text-emerald-700">
              Korwilcambidik • Puskesmas • SMP (WIA)
            </p>
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
              <p>• <strong>Prof. Dr. Chatarina Muryani</strong> (UNS)</p>
              <p>• <strong>Purwadi, S.E., M.E.</strong> (Kepala BAPPERIDA)</p>
              <p>• <strong>Sunan Fanijie, S.E.</strong> (HIPMI)</p>
            </div>
          </div>

          {/* Room 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                TIM JURI 3
              </span>
              <span className="text-xs font-bold text-slate-400">15 Nominator</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Ruang Graha Perencana 3
            </h3>
            <p className="text-xs font-semibold text-amber-800">
              Krenova Pelajar • Masyarakat • Desa/Kelurahan
            </p>
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
              <p>• <strong>Wijiyanto, S.T., M.Eng.Sc.</strong> (UMS)</p>
              <p>• <strong>Dr. Widia Darma, M.Pd.</strong> (STABN)</p>
              <p>• <strong>Sony Suharsono, S.Si.</strong> (Djarum Fdn)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Live Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
              7 Kategori
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nominator WIA</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{wiaCount} Instansi</h3>
            <p className="text-xs text-slate-400 mt-1">OPD, Kec, Korwil, SMP, Puskesmas, Desa, BUMD</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
              2 Kategori
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nominator KRENOVA</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{krenovaCount} Inovasi</h3>
            <p className="text-xs text-slate-400 mt-1">5 Pelajar & 5 Masyarakat Wonogiri</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
              3 Tim Juri
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Dewan Juri</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{judges.length} Tokoh</h3>
            <p className="text-xs text-slate-400 mt-1">
              {currentJudge ? `Aktif: ${currentJudge.name}` : 'Pilih profil di pojok kanan atas'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              {progressPercent}% Masuk
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lembar Penilaian</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalSubmissions} Berkas</h3>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Panel Administrator & Leaderboard</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Pantau progres penilaian tiap juri secara langsung, rekapitulasi rata-rata nilai, penetapan Juara 1, 2, 3, dan ekspor lembar kerja ke Excel.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
            <Link
              href="/admin/rekapitulasi"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Buka Rekapitulasi Juara</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              <span>Matriks Juri</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Cetak Berita Acara Resmi</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Format dokumen Berita Acara Penjurian resmi dengan Kop BAPPERIDA, tabel peringkat juara, dan lembar tanda tangan 3 dewan juri ruangan & Kepala BAPPERIDA.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/admin/berita-acara"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Lihat & Cetak Berita Acara</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
