import { cn } from '@/lib/utils';

/** Background, border, and text colors for inline status badges. */
export const statusBadgeClass = {
  success:
    'border-[#ff7a1a]/40 bg-[#ff7a1a]/10 text-[#ffb278] dark:text-[#ffb278]',
  warning:
    'border-[#ff9a3d]/40 bg-[#ff9a3d]/10 text-[#ffc07a] dark:text-[#ffc07a]',
  danger:
    'border-[#ff5c5c]/40 bg-[#ff5c5c]/10 text-[#ff9e8d] dark:text-[#ff9e8d]',
  info: 'border-[#ff8a3d]/40 bg-[#ff8a3d]/10 text-[#ffb07d] dark:text-[#ffb07d]',
  neutral: 'border-[#2f2321] bg-[#1b1516] text-[#d7c6ba]',
} as const;

/** Button variants for primary actions like "Install" or "Disconnect". */
export const statusButtonClass = {
  success:
    'bg-[#ff7a1a] text-[#1a120d] hover:bg-[#ff8d3b] focus-visible:ring-[#ff8a3d]/60 dark:bg-[#ff7a1a] dark:hover:bg-[#ff8d3b]',
  danger:
    'border border-[#ff6a4a]/40 bg-[#ff6a4a]/10 text-[#ffb7a5] hover:bg-[#ff6a4a]/15 dark:text-[#ffb7a5] dark:hover:bg-[#ff6a4a]/15',
  warning:
    'border border-[#ff9a3d]/40 bg-[#ff9a3d]/10 text-[#ffcf9c] hover:bg-[#ff9a3d]/15 dark:text-[#ffcf9c] dark:hover:bg-[#ff9a3d]/15',
} as const;

/**
 * Builds a complete className string for a small status badge pill.
 *
 * @param tone - Semantic color from `statusBadgeClass` keys.
 * @param className - Optional extra classes (e.g. `gap-1` when an icon is inside).
 * @returns A merged Tailwind class string ready for a `<span>`.
 */
export function statusBadge(
  tone: keyof typeof statusBadgeClass,
  className?: string
) {
  return cn(
    'inline-flex items-center rounded-none border px-2 py-0.5 text-xs font-medium capitalize',
    statusBadgeClass[tone],
    className
  );
}
