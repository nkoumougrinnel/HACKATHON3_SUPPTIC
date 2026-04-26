export const SkeletonLoader = ({ className = "h-5 w-full" }: { className?: string }) => (
  <div className={`animate-shimmer rounded-xl bg-slate-300/25 ${className}`} />
);
