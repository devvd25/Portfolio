import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/60 bg-gradient-to-r from-sky-500 to-emerald-400 px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(14,165,233,0.35)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
