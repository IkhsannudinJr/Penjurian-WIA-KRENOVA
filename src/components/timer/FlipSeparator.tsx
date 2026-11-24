'use client';

import React from 'react';

interface FlipSeparatorProps {
  status?: 'normal' | 'warning' | 'urgent' | 'timeup';
  size?: 'normal' | 'large' | 'fullscreen';
  isPulsing?: boolean;
}

export default function FlipSeparator({
  status = 'normal',
  size = 'large',
  isPulsing = false,
}: FlipSeparatorProps) {
  const textSizes = {
    normal: 'text-5xl sm:text-6xl md:text-7xl',
    large: 'text-6xl sm:text-8xl md:text-[9rem] lg:text-[13rem] xl:text-[16rem] 2xl:text-[19rem]',
    fullscreen: 'text-7xl sm:text-9xl md:text-[13rem] lg:text-[17rem] xl:text-[21rem] 2xl:text-[24rem]',
  }[size];

  const getColor = () => {
    switch (status) {
      case 'warning':
        return 'text-amber-300';
      case 'urgent':
      case 'timeup':
        return 'text-rose-400';
      default:
        return 'text-slate-400/80';
    }
  };

  return (
    <div className="flex items-center justify-center self-center px-1 sm:px-3 md:px-5 lg:px-6 select-none bg-transparent pb-6 sm:pb-10">
      <span
        className={`font-tegas ${textSizes} ${getColor()} leading-none ${
          isPulsing ? 'animate-pulse' : ''
        } transition-colors select-none`}
      >
        :
      </span>
    </div>
  );
}
