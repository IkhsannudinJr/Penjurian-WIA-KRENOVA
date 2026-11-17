'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Award, UserCheck, Shield, RefreshCw, ChevronDown, Calendar, Clock } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentJudge, judges, setCurrentJudge, refreshData, isLoading } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative h-9 sm:h-11 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/logo-wia-transparent.png"
                alt="Logo WIA & KRENOVA"
                width={48}
                height={40}
                className="object-contain h-9 sm:h-11 w-auto"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-lg">
                  E-PENJURIAN
                </span>
                <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm tracking-wide hidden sm:inline-block">
                  WIA & KRENOVA
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full hidden md:inline-block">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                WIA & KRENOVA Kabupaten Wonogiri
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              href="/rundown"
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                pathname === '/rundown'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="hidden md:inline">Rundown & Jadwal</span>
              <span className="md:hidden">Rundown</span>
            </Link>

            <Link
              href="/juri"
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                pathname.startsWith('/juri')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden md:inline">Portal Juri</span>
              <span className="md:hidden">Juri</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                pathname.startsWith('/admin')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden md:inline">Admin / Panitia</span>
              <span className="md:hidden">Admin</span>
            </Link>

            {/* Quick Switch Judge Selector */}
            <div className="relative group ml-2 hidden lg:block">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentJudge ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="max-w-[150px] truncate text-slate-700 font-semibold">
                  {currentJudge ? currentJudge.name.split(',')[0] : 'Pilih Profil Juri'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 hidden group-hover:block z-50">
                <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Daftar Dewan Juri (3 Tim Ruangan)
                </div>
                <div className="space-y-1.5 mt-1.5 max-h-80 overflow-y-auto">
                  {judges.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => setCurrentJudge(j)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        currentJudge?.id === j.id
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate font-bold text-slate-900">{j.name}</div>
                        <div className="text-[10px] text-blue-600 font-semibold">
                          Tim {j.teamId} • {j.room.split(' ')[2]} {j.room.split(' ')[3]}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{j.role}</div>
                      </div>
                      {currentJudge?.id === j.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sync button */}
            <button
              onClick={() => refreshData()}
              title="Perbarui data"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
