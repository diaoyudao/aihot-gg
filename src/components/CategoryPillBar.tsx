'use client';

import type { NewsItem, Category } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

const CAT_KEYS: Category[] = ['ai-models', 'ai-products', 'industry', 'paper', 'tip'];
const CAT_HUES = [24, 83, 38, 350, 170];

export default function CategoryPillBar({ items }: { items: NewsItem[] }) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (item.category) counts[item.category] = (counts[item.category] ?? 0) + 1;
  }

  const total = CAT_KEYS.reduce((s, k) => s + (counts[k] ?? 0), 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {CAT_KEYS.map((key, i) => (
        <span
          key={key}
          style={{
            fontSize: 11,
            padding: '3px 8px',
            borderRadius: 4,
            background: `hsla(${CAT_HUES[i]}, 80%, 50%, 0.10)`,
            color: `hsl(${CAT_HUES[i]}, 80%, 50%)`,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {CATEGORY_LABELS[key]} {counts[key] ?? 0}
        </span>
      ))}

      {/* Mini donut */}
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ marginLeft: 4 }}>
        {(() => {
          let angle = -90;
          return CAT_KEYS.map((key, i) => {
            const count = counts[key] ?? 0;
            if (count === 0) return null;
            const pct = count / total;
            const startAngle = angle;
            angle += pct * 360;
            const endAngle = angle;
            const r = 10;
            const cx = 14, cy = 14;
            const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
            const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
            const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
            const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
            const largeArc = pct > 0.5 ? 1 : 0;
            return (
              <path
                key={key}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={`hsl(${CAT_HUES[i]}, 80%, 55%)`}
              />
            );
          });
        })()}
        <circle cx="14" cy="14" r="5" fill="var(--surface-card)" />
      </svg>
    </div>
  );
}
