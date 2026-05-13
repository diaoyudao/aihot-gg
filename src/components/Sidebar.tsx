'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import {
  Lightning,
  ListDashes,
  Newspaper,
  Info,
  List,
  X,
} from '@phosphor-icons/react';

const NAV_LINKS = [
  { href: '/', label: '精选', icon: Lightning },
  { href: '/all', label: '全部 AI 动态', icon: ListDashes },
  { href: '/daily', label: 'AI 日报', icon: Newspaper },
  { href: '/about', label: '关于', icon: Info },
];

function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={`brand-logo ${className || ''}`}>
      <span className="brand-logo-ai">AI</span>
      <span className="brand-logo-orbit" aria-hidden="true">
        <span className="brand-logo-orbit-core" />
      </span>
      <span className="brand-logo-hot">HOT</span>
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-col h-full">
      {/* Brand */}
      <div className="sidebar-brand">
        <Link href="/" className="press">
          <BrandLogo className="brand-logo-sidebar" />
        </Link>
      </div>

      {/* Nav */}
      <div className="side-nav">
        {NAV_LINKS.map(link => {
          const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`side-link ${active ? 'side-link-active' : ''}`}
            >
              <Icon size={18} weight={active ? 'fill' : 'regular'} className="side-icon" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <ThemeToggle />
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="mobile-bar">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-text-2 hover:text-text-0 hover:bg-surface-1 press"
          aria-label="打开导航"
        >
          <List size={18} />
        </button>
        <Link href="/" className="mobile-brand">
          AI HOT
        </Link>
        <div className="w-11" />
      </div>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="hidden max-[960px]:inline-flex items-center justify-center justify-self-end w-11 h-11 rounded-xl border border-transparent bg-transparent text-text-1 hover:bg-surface-1 hover:text-text-0 hover:border-border press"
          aria-label="关闭导航"
        >
          <X size={18} />
        </button>
        {navContent}
      </aside>
    </>
  );
}
