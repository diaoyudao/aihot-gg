'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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

export default function CategoryPie({ data }: { data: TrendRow[] }) {
  const totals = CAT_KEYS.map(key => data.reduce((s, r) => s + r[key], 0));
  const total = totals.reduce((a, b) => a + b, 0);
  const chartData = CAT_KEYS.map((key, i) => ({
    name: CATEGORY_LABELS[key],
    value: totals[i],
  }));
  const colors = getColors();

  return (
    <div className="tl-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={0}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${v} 条`, '']} contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text-0)' }}>{total}</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: '1px' }}>总条目</div>
      </div>
    </div>
  );
}
