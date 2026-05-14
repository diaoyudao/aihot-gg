'use client';

import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { TrendRow } from '@/lib/useStats';
import { CATEGORY_LABELS } from '@/lib/types';
import type { Category } from '@/lib/types';

const CAT_KEYS: Category[] = ['ai-models', 'ai-products', 'industry', 'paper', 'tip'];
const CAT_HUES = [24, 83, 38, 350, 170];

function getColors(): string[] {
  if (typeof window === 'undefined') return CAT_HUES.map(h => `hsl(${h}, 80%, 55%)`);
  const isDark = document.documentElement.classList.contains('dark');
  return CAT_HUES.map(h => `hsl(${h}, 80%, ${isDark ? 65 : 50}%)`);
}

export default function CategoryTrend({ data }: { data: TrendRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: Math.round(width), h: Math.round(height) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const colors = getColors();
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const axisColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
  const tickColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

  return (
    <div className="tl-card" style={{ padding: 20 }}>
      <div ref={ref} style={{ width: '100%', height: 240 }}>
        {size && (
          <LineChart width={size.w} height={size.h} data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={axisColor} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: tickColor }} tickFormatter={(v: string) => v.slice(5)} />
            <YAxis tick={{ fontSize: 10, fill: tickColor }} width={28} allowDecimals={false} />
            <Tooltip contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            {CAT_KEYS.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} name={CATEGORY_LABELS[key]} stroke={colors[i]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        )}
      </div>
    </div>
  );
}
