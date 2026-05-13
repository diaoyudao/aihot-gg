'use client';

import { useState } from 'react';
import { useCategoryTrend, useSourceRanking, useDailyStats } from '@/lib/useStats';
import CategoryPie from '@/components/stats/CategoryPie';
import CategoryTrend from '@/components/stats/CategoryTrend';
import SourceRank from '@/components/stats/SourceRank';
import ActivityHeatmap from '@/components/stats/ActivityHeatmap';

export default function StatsPage() {
  const [days, setDays] = useState<7 | 30>(7);

  const { data: trendData, isLoading: trendLoading } = useCategoryTrend(days);
  const { data: sourceData, isLoading: sourceLoading } = useSourceRanking(30);
  const { data: dailyData, isLoading: dailyLoading } = useDailyStats();

  const isLoading = trendLoading && sourceLoading && dailyLoading;

  return (
    <div className="page-enter" style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
      {/* Header */}
      <section className="page-header">
        <div>
          <div className="title page-title">数据洞察</div>
          <div className="page-subtitle">AI 资讯趋势与统计</div>
        </div>
        <hr className="page-divider" />
        <div className="segmented">
          <button
            onClick={() => setDays(7)}
            className={`seg-item ${days === 7 ? 'seg-item-active' : ''}`}
          >
            7天
          </button>
          <button
            onClick={() => setDays(30)}
            className={`seg-item ${days === 30 ? 'seg-item-active' : ''}`}
          >
            30天
          </button>
        </div>
      </section>

      {/* Charts */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="skeleton h-48" />
          <div className="skeleton h-48" />
        </div>
      ) : (
        <>
          {/* Row 1: Pie + Trend */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12 }}>
            <CategoryPie data={trendData} />
            <CategoryTrend data={trendData} />
          </div>

          {/* Row 2: Source ranking */}
          <SourceRank data={sourceData} />

          {/* Row 3: Heatmap */}
          <ActivityHeatmap data={dailyData} />
        </>
      )}
    </div>
  );
}
