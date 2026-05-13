'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import type { DailyReport as DailyReportType, DailiesResponse, DailyArchiveItem } from '@/lib/types';
import DailyReportComponent from '@/components/DailyReport';
import { Empty } from '@phosphor-icons/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function groupByMonth(items: DailyArchiveItem[]): { month: string; label: string; items: DailyArchiveItem[] }[] {
  const map = new Map<string, { month: string; label: string; items: DailyArchiveItem[] }>();
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  for (const item of items) {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) {
      map.set(key, { month: key, label: `${d.getFullYear()}年${monthNames[d.getMonth()]}`, items: [] });
    }
    map.get(key)!.items.push(item);
  }
  return Array.from(map.values());
}

export default function DailyPage() {
  const { data: dailies, isLoading: dailiesLoading } = useSWR<DailiesResponse>(
    '/api/public/dailies?take=60',
    swrFetcher
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const activeDate = selectedDate || dailies?.items?.[0]?.date || null;

  const { data: report, isLoading: reportLoading } = useSWR<DailyReportType>(
    activeDate ? `/api/public/daily/${activeDate}` : '/api/public/daily',
    swrFetcher
  );

  const months = useMemo(() => dailies?.items ? groupByMonth(dailies.items) : [], [dailies]);

  return (
    <div className="daily-shell">
      <div className="daily-layout">
        {/* Side panel */}
        <div className="daily-side">
          <nav className="daily-side-nav">
            {/* Latest */}
            {dailies?.items?.[0] && (
              <button
                className={`daily-side-latest ${activeDate === dailies.items[0].date ? 'is-active' : ''}`}
                onClick={() => setSelectedDate(dailies.items[0].date)}
              >
                <span className="daily-side-latest-label">最新日报</span>
                <span className="daily-side-latest-date">{dailies.items[0].date}</span>
              </button>
            )}

            {/* Monthly groups */}
            {months.length > 0 && (
              <div className="daily-side-months">
                {months.map(m => (
                  <details key={m.month} className="daily-side-month" open={m === months[0]}>
                    <summary>
                      <span className="daily-side-month-name">{m.label}</span>
                      <span className="daily-side-month-count">{m.items.length}</span>
                    </summary>
                    {m.items.map(d => (
                      <button
                        key={d.date}
                        className={`daily-side-day ${activeDate === d.date ? 'is-active' : ''}`}
                        onClick={() => setSelectedDate(d.date)}
                      >
                        <span className="daily-side-day-num">{d.date.slice(5)}</span>
                        <span className="daily-side-day-headline">{d.leadTitle}</span>
                      </button>
                    ))}
                  </details>
                ))}
              </div>
            )}

            {dailiesLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 32 }} />
                ))}
              </div>
            )}
          </nav>
        </div>

        {/* Main content */}
        <div className="daily-main">
          <AnimatePresence mode="wait">
            {reportLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="daily-paper"
                style={{ maxWidth: 760, width: '100%' }}
              >
                <div className="skeleton" style={{ height: 104, marginBottom: 32 }} />
                <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 16, width: '75%' }} />
              </motion.div>
            ) : report ? (
              <motion.div
                key={report.date}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <DailyReportComponent report={report} />
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0', color: 'var(--d-text-faint)' }}>
                <Empty size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>该日期暂无日报</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
