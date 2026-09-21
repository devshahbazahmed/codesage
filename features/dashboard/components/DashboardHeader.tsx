'use client';
import React from 'react';

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[#2a1f1a] bg-[#120f13] px-4 text-[#f5efe8]">
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-sm font-semibold tracking-[0.02em] text-[#f5efe8]">
          {title}
        </h1>
        {description && (
          <p className="truncate text-[11px] text-[#d7c6ba]/75">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
