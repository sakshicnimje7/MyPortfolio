'use client';

export default function PageLoader() {
  return (
    <div 
      id="page-loader" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream-2 dark:bg-ink text-ink dark:text-cream font-dm"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="text-sm uppercase tracking-widest opacity-80">Portfolio loading</span>
        <div className="w-16 h-[2px] bg-sage relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-forest animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
}
