'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import type { DailyReport as DailyReportType } from '@/lib/types';
import DailyReportComponent from '@/components/DailyReport';
import { ArrowLeft, Empty } from '@phosphor-icons/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DailyDatePage() {
  const { date } = useParams<{ date: string }>();

  const { data: report, isLoading, error } = useSWR<DailyReportType>(
    `/api/public/daily/${date}`,
    swrFetcher
  );

  return (
    <div className="page-enter" style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
      <Link
        href="/daily"
        className="inline-flex items-center gap-1 text-sm text-text-1 hover:text-accent transition-colors press"
      >
        <ArrowLeft size={14} />
        返回日报
      </Link>

      <section className="page-header">
        <div className="title page-title tabular-nums">{date}</div>
      </section>

      {isLoading ? (
        <div className="space-y-3">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
      ) : error || !report ? (
        <div className="flex flex-col items-center justify-center py-24 text-text-2">
          <Empty size={36} className="mb-3 opacity-30" />
          <p className="text-sm">该日期暂无日报</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <DailyReportComponent report={report} />
        </motion.div>
      )}
    </div>
  );
}
