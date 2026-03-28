import { useState, useEffect } from 'react';
import { Sprout } from 'lucide-react';
import { preloaderConfig } from '../config';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  // Null check: if config is empty, complete immediately
  if (!preloaderConfig.brandName) {
    useEffect(() => { onComplete(); }, [onComplete]);
    return null;
  }

  const [phase, setPhase] = useState<'loading' | 'fading'>('loading');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), 2200);
    const completeTimer = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center transition-opacity duration-600 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo Icon */}
      <div className="preloader-text mb-6">
        {preloaderConfig.logoPath ? (
          <img
            src={preloaderConfig.logoPath}
            alt={`${preloaderConfig.brandName} logo`}
            className="h-24 w-auto"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <Sprout className="w-10 h-10 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Brand Name */}
      <div className="preloader-text text-center" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-3xl md:text-4xl text-white tracking-wide mb-2 font-light">
          {preloaderConfig.brandName}
          <span className="text-emerald-400">{preloaderConfig.brandSubname}</span>
        </h1>
      </div>

      {/* Loading Line */}
      <div className="mt-8 w-48 h-px bg-white/10 overflow-hidden">
        <div className="preloader-line h-full bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50" />
      </div>

      {/* Tagline */}
      {preloaderConfig.yearText && (
        <p
          className="preloader-text mt-4 text-xs text-emerald-400/80 uppercase tracking-[0.3em]"
          style={{ animationDelay: '0.4s' }}
        >
          {preloaderConfig.yearText}
        </p>
      )}
    </div>
  );
}
