import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { heroConfig } from '../config';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

export function Hero({ isReady }: { isReady: boolean }) {
  // Null check: if config is empty, render nothing
  if (!heroConfig.mainTitle) return null;

  const [phase, setPhase] = useState(0);
  // phase 0: hidden, 1: bg visible, 2: title, 3: cta, 4: stats counting

  // Build count-up hooks from stats config
  const stat0 = heroConfig.stats[0];
  const stat1 = heroConfig.stats[1];
  const stat2 = heroConfig.stats[2];
  const count0 = useCountUp(stat0?.value ?? 0, 2000, phase >= 4);
  const count1 = useCountUp(stat1?.value ?? 0, 2200, phase >= 4);
  const count2 = useCountUp(stat2?.value ?? 0, 1800, phase >= 4);
  const counts = [count0, count1, count2];

  useEffect(() => {
    if (!isReady) return;
    // Stagger: bg -> title -> cta -> stats
    const t1 = setTimeout(() => setPhase(1), 100);   // bg reveal
    const t2 = setTimeout(() => setPhase(2), 800);   // title
    const t3 = setTimeout(() => setPhase(3), 1400);  // cta
    const t4 = setTimeout(() => setPhase(4), 2000);  // stats
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isReady]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with subtle Ken Burns */}
      <div className={`absolute inset-0 transition-opacity duration-[1.5s] ease-out ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 hero-kenburns">
          <img
            src={heroConfig.backgroundImage}
            alt={heroConfig.mainTitle}
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 lg:py-40">
        {/* Script accent */}
        <div className={`transition-all duration-1000 ease-out ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-emerald-400 text-lg md:text-xl tracking-[0.3em] uppercase">
            {heroConfig.scriptText}
          </span>
        </div>

        {/* Divider line */}
        <div className={`mx-auto my-6 h-px bg-emerald-500/50 transition-all duration-1000 ease-out ${phase >= 2 ? 'w-24 opacity-100' : 'w-0 opacity-0'}`} style={{ transitionDelay: '0.2s' }} />

        {/* Main Title */}
        <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-light leading-tight tracking-tight transition-all duration-1000 ease-out whitespace-pre-line ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.3s' }}>
          {heroConfig.mainTitle}
        </h1>

        {/* Subtitle */}
        <p className={`mt-6 text-xl md:text-2xl text-white/70 max-w-2xl mx-auto transition-all duration-1000 ease-out ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.4s' }}>
          Voice-first farm advisory that converts weather and crop data into actionable decisions
        </p>

        {/* CTA */}
        {heroConfig.ctaButtonText && (
          <div className={`mt-10 transition-all duration-700 ease-out ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <button
              onClick={() => scrollToSection(heroConfig.ctaTarget || '#dashboard')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all duration-300 text-lg font-medium group shadow-2xl shadow-emerald-500/30"
              aria-label={heroConfig.ctaButtonText}
            >
              {heroConfig.ctaButtonText}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Stats with count-up */}
      {heroConfig.stats.length > 0 && (
        <div className={`absolute bottom-20 left-0 right-0 z-10 transition-all duration-1000 ease-out ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 max-w-3xl mx-auto" style={{ gridTemplateColumns: `repeat(${heroConfig.stats.length}, minmax(0, 1fr))` }}>
              {heroConfig.stats.map((stat, index) => (
                <div key={index} className={`text-center ${index > 0 && index < heroConfig.stats.length ? 'border-l border-white/20' : ''}`}>
                  <div className="text-3xl md:text-4xl text-emerald-400 mb-2 tabular-nums font-light">
                    {counts[index]}{stat.suffix}
                  </div>
                  <div className="text-xs md:text-sm text-white/70 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* Side decorative */}
      {heroConfig.decorativeText && (
        <div className={`absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 transition-opacity duration-1000 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
          <span className="text-emerald-400/60 text-xs tracking-widest" style={{ writingMode: 'vertical-lr' }}>{heroConfig.decorativeText}</span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent" />
        </div>
      )}
    </section>
  );
}
