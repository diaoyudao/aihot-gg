'use client';

import useSWRInfinite from 'swr/infinite';
import { swrFetcher } from '@/lib/api';
import type { ItemsResponse, Category } from '@/lib/types';
import { buildItemsURL } from '@/lib/utils';
import NewsCard, { NewsCardSkeleton } from '@/components/NewsCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Empty } from '@phosphor-icons/react';

const PAGE_SIZE = 30;

export default function HomePage() {
  const [category, setCategory] = useState<Category | ''>('');

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<ItemsResponse>(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.hasNext) return null;
      const params: Record<string, string | number | undefined> = {
        mode: 'selected',
        take: PAGE_SIZE,
      };
      if (category) params.category = category;
      if (pageIndex > 0 && previousPageData?.nextCursor) {
        params.cursor = previousPageData.nextCursor;
      }
      return buildItemsURL(params);
    },
    swrFetcher,
    { revalidateFirstPage: false }
  );

  const items = data ? data.flatMap(page => page.items) : [];
  const hasNext = data?.[data.length - 1]?.hasNext ?? false;

  const handleScroll = useCallback(() => {
    if (isLoading || isValidating || !hasNext) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
      setSize(size + 1);
    }
  }, [isLoading, isValidating, hasNext, size, setSize]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="page-enter" style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
      {/* Page header card */}
      <section className="page-header">
        <div>
          <div className="title page-title">精选</div>
          <div className="page-subtitle">AI 自动挑选的高价值内容</div>
        </div>
        <hr className="page-divider" />
        <div className="page-header-body">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>
      </section>

      {/* Timeline */}
      {isLoading && items.length === 0 ? (
        <section className="timeline">
          {Array.from({ length: 8 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </section>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-text-2">
          <Empty size={36} className="mb-3 opacity-30" />
          <p className="text-sm">暂无精选资讯</p>
        </div>
      ) : (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="timeline"
        >
          {items.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </motion.section>
      )}

      {isValidating && items.length > 0 && (
        <section className="timeline">
          {Array.from({ length: 3 }).map((_, i) => (
            <NewsCardSkeleton key={`more-${i}`} />
          ))}
        </section>
      )}

      {!hasNext && items.length > 0 && (
        <p className="text-center text-text-2 text-xs py-8 tabular-nums">
          {items.length} 条精选，已全部加载
        </p>
      )}
    </div>
  );
}
