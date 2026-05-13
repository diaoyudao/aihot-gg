'use client';

import type { DayCount } from '@/lib/useStats';

export default function ActivityHeatmap({ data }: { data: DayCount[] }) {
  const today = new Date();
  const reportDates = new Set(data.map(d => d.date));

  // Build 30-day grid ending today
  const days: { date: string; hasReport: boolean; label: string }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const has = reportDates.has(dateStr);
    days.push({
      date: dateStr,
      hasReport: has,
      label: `${dateStr.slice(5)}: ${has ? '有日报' : '无'}`,
    });
  }

  return (
    <div className="tl-card" style={{ padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)', marginBottom: 12 }}>活跃热力图</h3>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {days.map(d => {
          const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
          const bg = d.hasReport
            ? `rgba(var(--accent-rgb), 0.6)`
            : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)');
          return (
            <div
              key={d.date}
              title={d.label}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                color: d.hasReport ? 'var(--accent)' : 'var(--text-2)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {d.date.slice(8)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
