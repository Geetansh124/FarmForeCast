import { useState, useEffect } from 'react';
import { Menu, X, Home, Cloud, Leaf, AlertTriangle, Phone, Sprout } from 'lucide-react';
import { navigationConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Cloud, Leaf, AlertTriangle, Phone, Sprout, Menu, X,
};

export function Navigation() {
  // Null check: if config is empty, render nothing
  if (!navigationConfig.brandName) return null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = navigationConfig.navLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-3 border-b border-white/10'
          : 'bg-transparent py-5'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#hero')}
          className="flex items-center gap-3 group"
          aria-label={navigationConfig.brandName}
        >
          {navigationConfig.logoPath ? (
            <img
              src={navigationConfig.logoPath}
              alt={`${navigationConfig.brandName} logo`}
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Sprout className="w-6 h-6 text-emerald-400" aria-hidden="true" />
            </div>
          )}
          {!navigationConfig.logoPath && (
            <div className="flex flex-col">
              <span className="text-xl text-white tracking-wide font-light">
                {navigationConfig.brandName}
                <span className="text-emerald-400">{navigationConfig.brandSubname}</span>
              </span>
              <span className="text-[10px] text-emerald-400/80 tracking-widest uppercase">{navigationConfig.tagline}</span>
            </div>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8" role="menubar">
          {navLinks.map((link) => {
            return (
              <div key={link.name} className="relative" role="none">
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="flex items-center gap-1 text-sm text-white/80 hover:text-emerald-400 transition-colors duration-300 py-2"
                  role="menuitem"
                >
                  {link.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        {navigationConfig.ctaButtonText && (
          <button
            onClick={() => scrollToSection('#dashboard')}
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all duration-300 text-sm font-medium"
            aria-label={navigationConfig.ctaButtonText}
          >
            <Phone className="w-4 h-4" />
            {navigationConfig.ctaButtonText}
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] bg-[#0a0a0a]/98 backdrop-blur-lg transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-2">
          {navLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon];
            return (
              <div
                key={link.name}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="flex items-center gap-3 w-full py-4 text-lg text-white border-b border-white/10 hover:text-emerald-400 transition-colors"
                  role="menuitem"
                >
                  {IconComponent && <IconComponent className="w-5 h-5 text-emerald-400" />}
                  {link.name}
                </button>
              </div>
            );
          })}

          {navigationConfig.ctaButtonText && (
            <button
              onClick={() => scrollToSection('#dashboard')}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all duration-300 mt-6"
              role="menuitem"
            >
              <Phone className="w-5 h-5" />
              {navigationConfig.ctaButtonText}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
