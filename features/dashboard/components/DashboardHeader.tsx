"use client";
import React from "react";

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[#34272d] bg-[#171316] px-4 text-[#f5edf0]">
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-sm font-semibold tracking-[0.02em] text-[#f5edf0]">{title}</h1>
        {description && <p className="truncate text-[11px] text-[#a9959d]">{description}</p>}
      </div>
    </header>
  );
}
