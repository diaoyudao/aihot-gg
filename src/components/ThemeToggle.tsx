'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Palette } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ACCENT_OPTIONS = [
  { id: 'cyan', label: '青', color: '#0891b2', darkColor: '#22d3ee' },
  { id: 'rose', label: '玫', color: '#e11d48', darkColor: '#fb7185' },
  { id: 'violet', label: '紫', color: '#7c3aed', darkColor: '#a78bfa' },
  { id: 'amber', label: '橙', color: '#d97706', darkColor: '#fcd34d' },
] as const;

type AccentId = typeof ACCENT_OPTIONS[number]['id'];

function getAccent(): AccentId {
  if (typeof window === 'undefined') return 'cyan';
  return (document.documentElement.getAttribute('data-accent') as AccentId) || 'cyan';
}

function setAccent(id: AccentId) {
  document.documentElement.setAttribute('data-accent', id);
  localStorage.setItem('accent', id);
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accent, setAccentState] = useState<AccentId>('cyan');
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('accent') as AccentId | null;
    const initial = saved || 'cyan';
    setAccentState(initial);
    setAccent(initial);
  }, []);

  if (!mounted) return <div className="w-full h-11" />;

  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Dark/Light toggle */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="theme-toggle-opt"
        aria-label={isDark ? '切换浅色模式' : '切换深色模式'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sun size={18} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Moon size={18} />
            </motion.span>
          )}
        </AnimatePresence>
        <span>{isDark ? '浅色' : '深色'}</span>
      </button>

      {/* Accent color toggle */}
      <button
        onClick={() => setShowPalette(!showPalette)}
        className="theme-toggle-opt"
        aria-label="切换主题色"
      >
        <Palette size={18} />
        <span>主题色</span>
      </button>

      <AnimatePresence>
        {showPalette && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display: 'flex',
              gap: 8,
              padding: '8px 12px',
              justifyContent: 'center',
            }}>
              {ACCENT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAccentState(opt.id);
                    setAccent(opt.id);
                  }}
                  aria-label={opt.label}
                  title={opt.label}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: accent === opt.id
                      ? '2px solid var(--text-0)'
                      : '2px solid transparent',
                    background: isDark ? opt.darkColor : opt.color,
                    cursor: 'pointer',
                    transition: 'border-color 0.12s ease, transform 0.12s ease',
                    transform: accent === opt.id ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
