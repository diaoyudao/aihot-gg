'use client';

import useSWRInfinite from 'swr/infinite';
import { swrFetcher } from '@/lib/api';
import type { ItemsResponse, Category } from '@/lib/types';
import { buildItemsURL, resolveSince } from '@/lib/utils';
import NewsCard, { NewsCardSkeleton } from '@/components/NewsCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Empty } from '@phosphor-icons/react';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PAGE_SIZE = 30;
const SINCE_OPTIONS = [
  { value: 'now-24h', label: '24h' },
  { value: 'now-3d', label: '3天' },
  { value: 'now-7d', label: '7天' },
];

function AllPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState<Category | ''>((searchParams.get('category') as Category) || '');
  const [since, setSince] = useState(searchParams.get('since') || 'now-7d');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<ItemsResponse>(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.hasNext) return null;
      const params: Record<string, string | number | undefined> = {
        mode: 'all',
        take: PAGE_SIZE,
        since: resolveSince(since),
      };
      if (category) params.category = category;
      if (searchQuery) params.q = searchQuery;
      if (pageIndex > 0 && previousPageData?.nextCursor) {
        params.cursor = previousPageData.nextCursor;
      }
      return buildItemsURL(params);
    },
    swrFetcher,
    { revalidateFirstPage: false }
  );

  const items = data ? data.flatMap(page => page?.items ?? []) : [];
  const hasNext = data?.[data.length - 1]?.hasNext ?? false;

  const updateURL = useCallback((cat: Category | '', s: string, q: string) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (s !== 'now-7d') params.set('since', s);
    if (q) params.set('q', q);
    const qs = params.toString();
    router.replace(`/all${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router]);

  const handleCategoryChange = (cat: Category | '') => {
    setCategory(cat);
    updateURL(cat, since, searchQuery);
  };

  const handleSinceChange = (s: string) => {
    setSince(s);
    updateURL(category, s, searchQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    updateURL(category, since, searchInput);
  };

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
          <div className="title page-title">全部</div>
          <div className="page-subtitle">所有 AI 动态，支持搜索和筛选</div>
        </div>
        <hr className="page-divider" />
        <div className="page-header-body" style={{ display: 'grid', gap: '8px' }}>
          {/* Search + time filter row */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearch} style={{ flex: '1 1 180px', minWidth: '100px' }}>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="搜索标题/摘要…"
                className="field"
              />
            </form>
            <div className="segmented" style={{ flexShrink: 0 }}>
              {SINCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSinceChange(opt.value)}
                  className={`seg-item tabular-nums ${since === opt.value ? 'seg-item-active' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <CategoryFilter selected={category} onChange={handleCategoryChange} />
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
          <p className="text-sm">{searchQuery ? `未找到"${searchQuery}"相关资讯` : '暂无资讯'}</p>
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
          {items.length} 条资讯，已全部加载
        </p>
      )}
    </div>
  );
}

export default function AllPage() {
  return (
    <Suspense fallback={
      <section className="timeline">
        {Array.from({ length: 8 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </section>
    }>
      <AllPageContent />
    </Suspense>
  );
}
