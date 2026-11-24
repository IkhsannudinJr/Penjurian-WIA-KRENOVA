'use client';

import React from 'react';

interface FlipUnitProps {
  value: string; // e.g. "15", "09", "00"
  label: string; // e.g. "MENIT", "DETIK"
  status?: 'normal' | 'warning' | 'urgent' | 'timeup';
  size?: 'normal' | 'large' | 'fullscreen';
}

export default function FlipUnit({
  value,
  label,
  status = 'normal',
  size = 'large',
}: FlipUnitProps) {
  // Massive, bold, and authoritative text sizes
  const textSizes = {
    normal: 'text-6xl sm:text-7xl md:text-8xl',
    large: 'text-7xl sm:text-9xl md:text-[11rem] lg:text-[15rem] xl:text-[19rem] 2xl:text-[22rem]',
    fullscreen: 'text-8xl sm:text-[11rem] md:text-[15rem] lg:text-[20rem] xl:text-[24rem] 2xl:text-[28rem]',
  }[size];

  // Dynamic status color with strong contrast (Default is pure bright crisp white!)
  const getTextColor = () => {
    switch (status) {
      case 'warning':
        return 'text-amber-300 drop-shadow-[0_0_35px_rgba(252,211,77,0.65)]';
      case 'urgent':
        return 'text-rose-400 drop-shadow-[0_0_45px_rgba(251,113,133,0.85)] animate-pulse';
      case 'timeup':
        return 'text-red-500 drop-shadow-[0_0_55px_rgba(239,68,68,1)] animate-bounce';
      default:
        // Warna Terang Putih Bersih
        return 'text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.18)]';
    }
  };

  const getLabelColor = () => {
    switch (status) {
      case 'warning':
        return 'text-amber-400 font-black';
      case 'urgent':
      case 'timeup':
        return 'text-rose-400 font-black animate-pulse';
      default:
        return 'text-slate-400 font-bold';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none bg-transparent">
      {/* Massive Bold Tegas Number - Pure Bright White, NO Box */}
      <div
        className={`font-tegas ${textSizes} ${getTextColor()} leading-none text-center transition-colors duration-200 select-none tracking-tighter`}
      >
        {value}
      </div>

      {/* Label Underneath (MENIT / DETIK) */}
      <span
        className={`mt-3 sm:mt-5 text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase transition-colors select-none ${getLabelColor()}`}
      >
        {label}
      </span>
    </div>
  );
}
