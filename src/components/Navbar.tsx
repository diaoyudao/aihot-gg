'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, X, Flame } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: '精选' },
  { href: '/all', label: '全部' },
  { href: '/daily', label: '日报' },
  { href: '/about', label: '关于' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-nav-bg backdrop-blur-xl border-b border-border shadow-[var(--shadow)]">
      <div className="max-w-3xl mx-auto px-4 h-11 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 font-bold text-base tracking-tight press">
          <Flame size={16} className="text-accent" />
          <span>AIHOT</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5 text-sm">
          {NAV_LINKS.map(link => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1 rounded-md transition-colors duration-150 press ${
                  active ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-card-hover rounded-md -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-border">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-card-hover press transition-colors"
            aria-label="菜单"
          >
            {mobileOpen ? <X size={16} /> : <List size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-nav-bg backdrop-blur-xl"
          >
            <div className="px-4 py-2 flex gap-1">
              {NAV_LINKS.map(link => {
                const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors press ${
                      active ? 'text-foreground font-medium bg-card-hover' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
