'use client';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-dm text-ink dark:text-cream bg-cream dark:bg-ink">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto gap-8">
        <h1 className="font-cormorant text-5xl md:text-7xl font-semibold text-forest dark:text-sage-light tracking-tight">
          Sakshi Portfolio
        </h1>
        
        <p className="text-lg md:text-xl text-ink/80 dark:text-cream/80 leading-relaxed font-light">
          A premium portfolio template featuring smooth interactions, 3D graphics, and modular architecture.
        </p>

        {/* Custom Color Chips */}
        <div className="flex flex-wrap gap-4 justify-center">
          <span className="px-4 py-2 bg-cream-2 dark:bg-cream-3/20 rounded-md border border-cream-3 dark:border-cream-3/30 font-mono text-sm">
            cream: #f7f5ef
          </span>
          <span className="px-4 py-2 bg-sage text-cream dark:text-ink rounded-md font-mono text-sm">
            sage: #8fa68a
          </span>
          <span className="px-4 py-2 bg-forest text-cream rounded-md font-mono text-sm">
            forest: #3d5e3b
          </span>
          <span className="px-4 py-2 bg-amber text-cream rounded-md font-mono text-sm">
            amber: #c4862a
          </span>
          <span className="px-4 py-2 bg-ink text-cream dark:bg-cream dark:text-ink rounded-md font-mono text-sm">
            ink: #1a1a16
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="magnetic"
            className="px-6 py-3 bg-forest hover:bg-sage-mid text-cream font-medium rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-forest/20"
          >
            Explore Docs
          </a>
          
          <button
            onClick={() => {
              const doc = document.documentElement;
              if (doc.classList.contains('dark')) {
                doc.classList.remove('dark');
              } else {
                doc.classList.add('dark');
              }
            }}
            data-cursor="magnetic"
            className="px-6 py-3 border border-sage-mid dark:border-sage-light text-forest dark:text-sage-light hover:bg-sage-light/10 font-medium rounded-full transition-all duration-300"
          >
            Toggle Theme
          </button>
        </div>

        {/* Cursor Interaction Testing Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl text-left">
          <div 
            data-cursor="magnetic"
            className="p-6 rounded-2xl bg-cream-2/50 dark:bg-cream-3/5 border border-cream-3 dark:border-cream-3/10 flex flex-col gap-2 hover:border-amber transition-colors duration-300"
          >
            <h3 className="font-cormorant text-2xl font-semibold text-forest dark:text-sage-light">
              Magnetic Hover Element
            </h3>
            <p className="text-sm opacity-80 leading-relaxed font-light">
              Hover here to witness the cursor expand to 80px, tint to amber background, and turn border to amber color.
            </p>
          </div>

          <div 
            data-cursor="text"
            className="p-6 rounded-2xl bg-cream-2/50 dark:bg-cream-3/5 border border-cream-3 dark:border-cream-3/10 flex flex-col gap-2 hover:border-sage transition-colors duration-300"
          >
            <h3 className="font-cormorant text-2xl font-semibold text-forest dark:text-sage-light">
              Text Hover Element
            </h3>
            <p className="text-sm opacity-80 leading-relaxed font-light">
              Hover here to witness the cursor expand to 120px with the text &quot;VIEW&quot; centered inside it.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="p-6 text-center border-t border-cream-3/50 dark:border-cream-3/10 font-mono text-xs opacity-60">
        © 2026 Sakshi Portfolio. Designed with Next.js, Tailwind CSS, & Framer Motion.
      </footer>
    </div>
  );
}
