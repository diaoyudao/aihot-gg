'use client';

import type { NewsItem, Category } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function NewsCardSkeleton() {
  return (
    <div className="timeline-item">
      <div className="timeline-time"><span className="skeleton inline-block w-10 h-4" /></div>
      <div className="tl-rail"><span className="tl-dot" /></div>
      <div className="tl-card space-y-3">
        <div className="flex items-center gap-2">
          <div className="skeleton h-3 w-10 rounded-full" />
          <div className="skeleton h-3 w-14" />
        </div>
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-3/5" />
      </div>
    </div>
  );
}

export default function NewsCard({ item, index }: { item: NewsItem; index?: number }) {
  const [expanded, setExpanded] = useState(false);
  const cat = item.category as Category | undefined;
  const color = cat ? CATEGORY_COLORS[cat] : null;

  return (
    <div className="timeline-item group">
      {/* Time */}
      <div className="timeline-time">
        {item.publishedAt ? formatTime(item.publishedAt) : ''}
      </div>

      {/* Rail + Dot */}
      <div className="tl-rail">
        <span className={`tl-dot ${cat && color ? `tl-dot-${color.cls}` : ''}`} />
      </div>

      {/* Card */}
      <article
        className="tl-card"
        onClick={() => {
          if (item.summary && !expanded) setExpanded(true);
        }}
        style={{ cursor: item.summary && !expanded ? 'pointer' : undefined }}
      >
        {/* Header */}
        <div className="tl-card-head">
          <div className="tl-head-left">
            {cat && (
              <span className={`tl-badge tl-badge-selected ${color?.cls}`}>
                {CATEGORY_LABELS[cat]}
              </span>
            )}
            <span className="tl-source">{item.source}</span>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-text-2 hover:text-accent transition-colors text-xs"
            aria-label="打开原文"
          >
            ↗
          </a>
        </div>

        {/* Title */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => {
            e.stopPropagation();
            if (item.summary && !expanded) {
              e.preventDefault();
              setExpanded(true);
            }
          }}
          className="tl-title"
        >
          {item.title}
        </a>

        {/* Summary */}
        <AnimatePresence>
          {expanded && item.summary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <hr className="tl-divider" />
              <p className="tl-summary" style={{ display: 'block', WebkitLineClamp: 'unset' } as React.CSSProperties}>
                {item.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        {cat && (
          <div className="tl-tags">
            <span className={`tag ${color?.cls}`}>{CATEGORY_LABELS[cat]}</span>
          </div>
        )}
      </article>
    </div>
  );
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}
