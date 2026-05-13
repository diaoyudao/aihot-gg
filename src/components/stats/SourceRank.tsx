'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { SourceRank } from '@/lib/useStats';

export default function SourceRank({ data }: { data: SourceRank[] }) {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const accentRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '34, 211, 238';
  const tickColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const axisColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="tl-card" style={{ padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)', marginBottom: 12 }}>信源排行</h3>
      <div style={{ width: '100%', height: Math.max(200, data.length * 28) }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: tickColor }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: tickColor }} width={100} />
            <Tooltip contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="count" fill={`rgba(${accentRgb}, 0.7)`} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
