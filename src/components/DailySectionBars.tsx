'use client';

import type { DailySection } from '@/lib/types';

const SECTION_HUES = [24, 83, 38, 350, 170];

export default function DailySectionBars({ sections }: { sections: DailySection[] }) {
  const maxItems = Math.max(...sections.map(s => s.items.length), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 24 }}>
      {sections.map((section, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--d-text-faint)', width: 80, flexShrink: 0, letterSpacing: '0.5px' }}>
            {section.label}
          </span>
          <div style={{
            flex: 1,
            height: 16,
            borderRadius: 3,
            background: 'var(--d-rule)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(section.items.length / maxItems) * 100}%`,
              height: '100%',
              borderRadius: 3,
              background: `hsl(${SECTION_HUES[i % SECTION_HUES.length]}, 80%, 55%)`,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--d-accent)', fontVariantNumeric: 'tabular-nums', fontWeight: 600, width: 24, textAlign: 'right' }}>
            {section.items.length}
          </span>
        </div>
      ))}
    </div>
  );
}
