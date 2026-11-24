'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import FlipUnit from '@/components/timer/FlipUnit';
import FlipSeparator from '@/components/timer/FlipSeparator';
import { soundManager } from '@/lib/soundEffects';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Bell,
  Clock,
  Sparkles,
  ArrowLeft,
  Tv,
  AlertTriangle,
  Info,
  Sliders,
  X
} from 'lucide-react';

// Preset durations in seconds
const PRESETS = [
  { label: '15 Menit', seconds: 15 * 60, desc: 'Pendalaman Materi Peserta (15 Menit Full)', popular: true },
  { label: '10 Menit', seconds: 10 * 60, desc: 'Sesi Pendalaman 10 Menit', popular: false },
  { label: '5 Menit', seconds: 5 * 60, desc: 'Sesi Pendalaman 5 Menit', popular: false },
  { label: '20 Menit', seconds: 20 * 60, desc: 'Sesi Khusus 20 Menit', popular: false },
  { label: '7 Menit', seconds: 7 * 60, desc: 'Sesi Singkat 7 Menit', popular: false },
  { label: '3 Menit', seconds: 3 * 60, desc: 'Waktu Tambahan 3 Menit', popular: false },
];

export default function TimerPage() {
  const { nominators } = useApp();

  // Timer core states (Default: 15 Menit = 900 detik full)
  const [initialSeconds, setInitialSeconds] = useState<number>(15 * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tickSoundEnabled, setTickSoundEnabled] = useState<boolean>(false);
  const [chimeEnabled, setChimeEnabled] = useState<boolean>(true);

  // Display modes
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControlsInFullscreen, setShowControlsInFullscreen] = useState<boolean>(true);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customMinInput, setCustomMinInput] = useState<string>('15');
  const [customSecInput, setCustomSecInput] = useState<string>('00');
  const [focusMode, setFocusMode] = useState<boolean>(false); // Only the giant numbers

  // Judging Room & Nominator selection context
  const [selectedRoomTeam, setSelectedRoomTeam] = useState<number>(0); // 0 = Semua / Bebas
  const [selectedNominatorId, setSelectedNominatorId] = useState<string>('');

  // References
  const fullscreenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Audio synchronization
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Filtered nominators by room
  const availableNominators = selectedRoomTeam === 0 
    ? nominators 
    : nominators.filter(n => n.teamId === selectedRoomTeam);

  const selectedNominator = nominators.find(n => n.id === selectedNominatorId);

  // Status visual indicator
  const getStatus = (): 'normal' | 'warning' | 'urgent' | 'timeup' => {
    if (isTimeUp || secondsLeft <= 0) return 'timeup';
    if (secondsLeft <= 60) return 'urgent'; // < 1 menit
    if (secondsLeft <= 180) return 'warning'; // < 3 menit
    return 'normal';
  };

  const status = getStatus();

  // Status badge details
  const getStatusBadge = () => {
    if (secondsLeft <= 0) {
      return {
        title: 'Waktu Habis (Selesai)',
        subtitle: 'Sesi pendalaman materi peserta telah berakhir',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      };
    } else if (secondsLeft <= 60) {
      return {
        title: 'Peringatan Waktu Terakhir',
        subtitle: 'Sisa waktu kurang dari 1 menit',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      };
    } else if (secondsLeft <= 180) {
      return {
        title: 'Peringatan Sisa Waktu',
        subtitle: 'Sisa waktu kurang dari 3 menit',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    } else {
      return {
        title: 'Pendalaman Materi Peserta',
        subtitle: `Durasi: ${Math.floor(initialSeconds / 60)} Menit Penuh`,
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      };
    }
  };

  const statusInfo = getStatusBadge();

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        setShowControlsInFullscreen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls in fullscreen after inactivity
  const handleMouseMove = useCallback(() => {
    if (!isFullscreen) return;
    setShowControlsInFullscreen(true);

    if (fullscreenTimeoutRef.current) {
      clearTimeout(fullscreenTimeoutRef.current);
    }

    fullscreenTimeoutRef.current = setTimeout(() => {
      if (isRunning) {
        setShowControlsInFullscreen(false);
      }
    }, 3500);
  }, [isFullscreen, isRunning]);

  // Main countdown interval
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          const nextVal = prev - 1;

          // Optional tick sound
          if (tickSoundEnabled && nextVal > 0) {
            soundManager.playFlipTick();
          }

          // Chime at 1 minute remaining
          if (chimeEnabled && nextVal === 60) {
            soundManager.playWarningChime();
          }

          // Countdown beeps at last 5 seconds (5, 4, 3, 2, 1)
          if (chimeEnabled && nextVal <= 5 && nextVal >= 1) {
            soundManager.playCountdownBeep(nextVal === 1);
          }

          // Time's up alarm at 0
          if (nextVal <= 0) {
            setIsRunning(false);
            setIsTimeUp(true);
            if (chimeEnabled) {
              soundManager.playTimeUpAlarm();
            }
            return 0;
          }

          return nextVal;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft, tickSoundEnabled, chimeEnabled]);

  // Actions
  const togglePlayPause = () => {
    soundManager.playButtonClick();
    if (secondsLeft <= 0) {
      setSecondsLeft(initialSeconds);
      setIsTimeUp(false);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    soundManager.playButtonClick();
    setIsRunning(false);
    setIsTimeUp(false);
    setSecondsLeft(initialSeconds);
  };

  const setPreset = (secs: number) => {
    soundManager.playButtonClick();
    setIsRunning(false);
    setIsTimeUp(false);
    setInitialSeconds(secs);
    setSecondsLeft(secs);
  };

  const adjustSeconds = (delta: number) => {
    soundManager.playButtonClick();
    setSecondsLeft((prev) => {
      const updated = Math.max(0, prev + delta);
      if (updated > 0 && isTimeUp) {
        setIsTimeUp(false);
      }
      return updated;
    });
  };

  const toggleFullscreen = async () => {
    soundManager.playButtonClick();
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen not permitted
    }
  };

  const applyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playButtonClick();
    const mins = Math.max(0, parseInt(customMinInput, 10) || 0);
    const secs = Math.min(59, Math.max(0, parseInt(customSecInput, 10) || 0));
    const total = mins * 60 + secs;

    if (total > 0) {
      setIsRunning(false);
      setIsTimeUp(false);
      setInitialSeconds(total);
      setSecondsLeft(total);
      setShowCustomModal(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setSoundEnabled((prev) => !prev);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        adjustSeconds(60);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        adjustSeconds(-60);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secondsLeft, initialSeconds, isTimeUp]);

  // Formatted digits
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  // Percentage for progress bar
  const progressPercent = initialSeconds > 0 
    ? Math.max(0, Math.min(100, Math.round(((initialSeconds - secondsLeft) / initialSeconds) * 100))) 
    : 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`min-h-[calc(100vh-4rem)] flex flex-col justify-between font-sans transition-colors duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-6 sm:p-12 bg-black text-white'
          : 'bg-[#090b0e] text-white py-6 px-3 sm:px-6 lg:px-8'
      }`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(30, 41, 59, 0.4) 0%, rgba(9, 11, 14, 0.98) 100%)',
      }}
    >
      {/* 1. TOP HEADER / CONTROL STRIP (Dark Elegant Style) */}
      <div
        className={`transition-all duration-300 no-print max-w-7xl mx-auto w-full ${
          isFullscreen && !showControlsInFullscreen
            ? 'opacity-0 pointer-events-none -translate-y-4'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            {!isFullscreen && (
              <Link
                href="/rundown"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Rundown</span>
              </Link>
            )}

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h1 className="font-black text-sm sm:text-base tracking-tight text-white">
                TIMER PENDALAMAN MATERI (15 MENIT)
              </h1>
            </div>

            {/* Focus Mode Toggle */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors hidden sm:inline-flex items-center gap-1.5 ${
                focusMode
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/15 hover:text-white'
              }`}
              title="Sembunyikan panel lain untuk fokus murni ke angka jam"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{focusMode ? 'Mode Standar' : 'Fokus Jam'}</span>
            </button>
          </div>

          {/* Quick Toolbar: Ruangan, Nominator, Sound & Fullscreen */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {/* Room Selector */}
            <select
              value={selectedRoomTeam}
              onChange={(e) => {
                setSelectedRoomTeam(Number(e.target.value));
                setSelectedNominatorId('');
              }}
              className="bg-slate-900 border border-white/15 text-xs font-semibold rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Semua Ruangan</option>
              <option value={1}>Ruang 1 (OPD, Kec, BUMD)</option>
              <option value={2}>Ruang 2 (Korwil, Pusk, SMP)</option>
              <option value={3}>Ruang 3 (Krenova & Desa)</option>
            </select>

            {/* Nominator Selector */}
            <select
              value={selectedNominatorId}
              onChange={(e) => setSelectedNominatorId(e.target.value)}
              className="bg-slate-900 border border-white/15 text-xs font-semibold rounded-xl px-2.5 py-1.5 max-w-[190px] sm:max-w-[240px] truncate text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Nominator --</option>
              {availableNominators.map((nom) => (
                <option key={nom.id} value={nom.id}>
                  #{nom.scheduleOrder} {nom.name} ({nom.categoryLabel})
                </option>
              ))}
            </select>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                if (nextState) soundManager.playButtonClick();
              }}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                soundEnabled
                  ? 'bg-white/10 border-white/20 text-slate-200 hover:bg-white/20'
                  : 'bg-rose-500/20 border-rose-500/30 text-rose-300'
              }`}
              title={soundEnabled ? 'Suara Aktif (Klik untuk Mute)' : 'Suara Senyap (Muted)'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border bg-white/10 border-white/20 text-slate-200 hover:bg-white/20 hover:text-white font-semibold transition-all"
              title={isFullscreen ? 'Keluar Layar Penuh (Esc / F)' : 'Mode Layar Penuh / Proyektor (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE NOMINATOR PRESENTATION BANNER */}
      {!focusMode && selectedNominator && (
        <div className="max-w-4xl mx-auto w-full my-3 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 backdrop-blur-md shadow-xl text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500 text-white uppercase tracking-wider">
                  Nominator #{selectedNominator.scheduleOrder}
                </span>
                <span className="text-xs font-bold text-blue-300 uppercase">
                  {selectedNominator.competition} • {selectedNominator.categoryLabel}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black mt-1 text-white">
                {selectedNominator.name}
              </h2>
              {selectedNominator.title && (
                <p className="text-xs text-slate-300 line-clamp-1 italic mt-0.5">
                  &ldquo;{selectedNominator.title}&rdquo;
                </p>
              )}
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[11px] font-bold text-slate-400 block">Ruang Sidang:</span>
              <span className="text-xs font-extrabold text-blue-300">{selectedNominator.room}</span>
              <span className="text-[10px] text-slate-400 block">Jadwal: {selectedNominator.timeSlot} WIB</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CENTERPIECE: DARK BACKGROUND WITH BRIGHT WHITE BOLD NUMBERS */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-6 sm:py-10">
        {/* Status Pill Badge */}
        <div className="mb-4 sm:mb-8 flex items-center justify-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold tracking-wide backdrop-blur-md transition-all shadow-lg ${statusInfo.badgeClass}`}
          >
            {isTimeUp ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
            ) : status === 'urgent' ? (
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>{statusInfo.title}</span>
            <span className="opacity-40">•</span>
            <span className="font-normal text-xs text-slate-300">{statusInfo.subtitle}</span>
          </div>
        </div>

        {/* GIANT BOLD TEGAS NUMBERS: PURE BRIGHT WHITE, ZERO BOXES */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 my-2 sm:my-4 select-none">
          {/* Hours (if >= 1 hour) */}
          {hours > 0 && (
            <>
              <FlipUnit
                value={hoursStr}
                label="JAM"
                status={status}
                size={isFullscreen ? 'fullscreen' : 'large'}
              />
              <FlipSeparator
                status={status}
                size={isFullscreen ? 'fullscreen' : 'large'}
                isPulsing={isRunning}
              />
            </>
          )}

          {/* Minutes */}
          <FlipUnit
            value={minutesStr}
            label="MENIT"
            status={status}
            size={isFullscreen ? 'fullscreen' : 'large'}
          />

          {/* Colon Separator */}
          <FlipSeparator
            status={status}
            size={isFullscreen ? 'fullscreen' : 'large'}
            isPulsing={isRunning}
          />

          {/* Seconds */}
          <FlipUnit
            value={secondsStr}
            label="DETIK"
            status={status}
            size={isFullscreen ? 'fullscreen' : 'large'}
          />
        </div>

        {/* TIME'S UP ALERT BANNER */}
        {isTimeUp && (
          <div className="mt-6 sm:mt-8 animate-bounce">
            <div className="bg-rose-600 text-white font-black px-6 py-2.5 rounded-2xl shadow-2xl shadow-rose-600/50 border border-rose-400 flex items-center gap-3 text-sm sm:text-base uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
              <span>WAKTU PENDALAMAN MATERI TELAH SELESAI</span>
              <button
                onClick={() => adjustSeconds(60)}
                className="ml-2 bg-white text-slate-950 text-xs font-black px-3 py-1 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
              >
                +1 Menit Tambahan
              </button>
            </div>
          </div>
        )}

        {/* PROGRESS BAR (FULL 15 MINUTES) */}
        {!focusMode && (
          <div className="w-full max-w-xl mx-auto mt-6 sm:mt-8 px-4">
            <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-300">
              <span className="text-blue-400 font-bold">
                Pendalaman Materi Peserta ({Math.floor(initialSeconds / 60)} Menit Full)
              </span>
              <span className="font-mono text-slate-400">
                Sisa: {minutesStr}:{secondsStr}
              </span>
            </div>

            {/* Clean Progress bar */}
            <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  secondsLeft <= 60
                    ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                    : secondsLeft <= 180
                    ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                    : 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] mt-1 font-mono text-slate-500">
              <span>Mulai ({String(Math.floor(initialSeconds / 60)).padStart(2, '0')}:00)</span>
              <span>Berjalan: {Math.round(progressPercent)}%</span>
              <span>Selesai (00:00)</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. CONTROLS BAR & ADJUSTMENTS (Auto-hides in fullscreen) */}
      <div
        className={`transition-all duration-300 no-print max-w-5xl mx-auto w-full ${
          isFullscreen && !showControlsInFullscreen
            ? 'opacity-0 pointer-events-none translate-y-6'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="bg-[#0f1217]/90 border border-white/10 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Quick Adjust Delta Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => adjustSeconds(-60)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                title="Kurangi 1 Menit"
              >
                -1 Min
              </button>
              <button
                onClick={() => adjustSeconds(-30)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                title="Kurangi 30 Detik"
              >
                -30s
              </button>
              <button
                onClick={() => adjustSeconds(30)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                title="Tambah 30 Detik"
              >
                +30s
              </button>
              <button
                onClick={() => adjustSeconds(60)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                title="Tambah 1 Menit"
              >
                +1 Min
              </button>
            </div>

            {/* Core Action: PLAY / PAUSE & RESET */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-bold px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
                title="Reset ke durasi awal (Shortcut: R)"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={togglePlayPause}
                className={`flex items-center gap-2.5 px-7 sm:px-9 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all hover:scale-105 active:scale-95 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                }`}
                title={isRunning ? 'Pause timer (Shortcut: Space)' : 'Mulai timer (Shortcut: Space)'}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{secondsLeft <= 0 ? 'ULANGI' : secondsLeft === initialSeconds ? 'MULAI TIMER' : 'LANJUTKAN'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Settings & Sound */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCustomModal(true)}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                title="Atur waktu khusus sesuai kebutuhan"
              >
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Atur Waktu</span>
              </button>

              {/* Detak Suara Toggle */}
              <button
                onClick={() => {
                  const nxt = !tickSoundEnabled;
                  setTickSoundEnabled(nxt);
                  if (nxt) soundManager.playFlipTick();
                }}
                className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                  tickSoundEnabled
                    ? 'bg-blue-600/40 border-blue-400/50 text-blue-200'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                title={tickSoundEnabled ? 'Suara detak jam aktif' : 'Suara detak jam nonaktif'}
              >
                Tik-Tok
              </button>

              {/* Sound Test Button */}
              <button
                onClick={() => soundManager.playWarningChime()}
                className="p-2 rounded-xl border bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Uji Suara Bell / Chime Projector"
              >
                <Bell className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* PRESET CHIPS ROW */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Preset:
            </span>
            {PRESETS.map((p) => {
              const isCurrent = initialSeconds === p.seconds;
              return (
                <button
                  key={p.seconds}
                  onClick={() => setPreset(p.seconds)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25 scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
                  }`}
                  title={p.desc}
                >
                  {p.label}
                  {p.popular && (
                    <span className={`ml-1 text-[9px] px-1 rounded-sm uppercase ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-blue-500/30 text-blue-300'
                    }`}>
                      Full
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* KEYBOARD SHORTCUTS HINT */}
          <div className="text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-3">
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-white/15">Space</kbd> Play / Pause</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-white/15">R</kbd> Reset</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-white/15">F</kbd> Layar Penuh</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-white/15">↑ / ↓</kbd> ±1 Menit</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-white/15">M</kbd> Mute</span>
            </div>
            <span className="hidden md:inline font-medium text-slate-400">
              BAPPERIDA Wonogiri • WIA & KRENOVA 2026
            </span>
          </div>
        </div>
      </div>

      {/* 5. CUSTOM TIME MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1217] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white border border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Atur Durasi Khusus</span>
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={applyCustomTime} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Menit (0 - 120)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={customMinInput}
                    onChange={(e) => setCustomMinInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-center text-xl font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Detik (0 - 59)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customSecInput}
                    onChange={(e) => setCustomSecInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-center text-xl font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-500/30 text-xs text-blue-200">
                <p className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Timer akan direset ke waktu baru ini dan siap dijalankan.</span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20"
                >
                  Terapkan Waktu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
