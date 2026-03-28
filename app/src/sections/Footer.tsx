import { useState } from 'react';
import { Sprout, MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowUp, CheckCircle } from 'lucide-react';
import { footerConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout, MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowUp,
};

export function Footer() {
  // Null check: if config is empty, render nothing
  if (!footerConfig.brandName) return null;

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    // Simulate newsletter signup
    setNewsletterStatus('success');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus('idle'), 4000);
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0a]" role="contentinfo">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xl text-white block font-light">{footerConfig.brandName}</span>
                {footerConfig.tagline && (
                  <span className="text-[10px] text-emerald-400 tracking-widest uppercase">{footerConfig.tagline}</span>
                )}
              </div>
            </div>
            {footerConfig.description && (
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {footerConfig.description}
              </p>
            )}
            {/* Social Links */}
            {footerConfig.socialLinks.length > 0 && (
              <nav aria-label="Social media links">
                <div className="flex gap-3">
                  {footerConfig.socialLinks.map((social) => {
                    const IconComponent = iconMap[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                      </a>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>

          {/* Link Groups */}
          {footerConfig.linkGroups.map((group, index) => (
            <nav key={index} aria-label={group.title}>
              <h3 className="text-lg text-white mb-5 font-light">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-white/70 text-sm hover:text-emerald-400 transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg text-white mb-5 font-light">Contact Us</h3>
            {footerConfig.contactItems.length > 0 && (
              <ul className="space-y-4">
                {footerConfig.contactItems.map((item, index) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <li key={index} className="flex items-start gap-3">
                      {IconComponent && <IconComponent className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                      <span className="text-white/70 text-sm">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Newsletter */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/70 text-sm mb-3">Subscribe to updates</p>
              {newsletterStatus === 'success' ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Subscribed successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <label htmlFor="newsletter-email" className="sr-only">Email</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-xs">
            {footerConfig.copyrightText && (
              <span>{footerConfig.copyrightText}</span>
            )}
          </div>

          {/* Back to Top */}
          {footerConfig.backToTopText && (
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/70 text-sm hover:text-emerald-400 transition-colors group"
              aria-label={footerConfig.backToTopText}
            >
              <span>{footerConfig.backToTopText}</span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 transition-all duration-300">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
