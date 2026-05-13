// 新闻条目
export interface NewsItem {
  id: string;
  title: string;
  title_en?: string | null;
  url: string;
  source: string;
  publishedAt?: string | null;
  summary?: string | null;
  category?: Category | null;
}

// 分类
export type Category = 'ai-models' | 'ai-products' | 'industry' | 'paper' | 'tip';

export const CATEGORY_LABELS: Record<Category, string> = {
  'ai-models': '模型',
  'ai-products': '产品',
  'industry': '行业',
  'paper': '论文',
  'tip': '技巧',
};

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; dot: string }> = {
  'ai-models':   { bg: 'bg-orange-100 dark:bg-orange-900/30',   text: 'text-orange-700 dark:text-orange-300',   dot: 'bg-orange-500' },
  'ai-products': { bg: 'bg-lime-100 dark:bg-lime-900/30',      text: 'text-lime-700 dark:text-lime-300',       dot: 'bg-lime-500' },
  'industry':    { bg: 'bg-amber-100 dark:bg-amber-900/30',    text: 'text-amber-700 dark:text-amber-300',     dot: 'bg-amber-500' },
  'paper':       { bg: 'bg-rose-100 dark:bg-rose-900/30',      text: 'text-rose-700 dark:text-rose-300',       dot: 'bg-rose-500' },
  'tip':         { bg: 'bg-teal-100 dark:bg-teal-900/30',      text: 'text-teal-700 dark:text-teal-300',       dot: 'bg-teal-500' },
};

// 资讯列表响应
export interface ItemsResponse {
  count: number;
  hasNext: boolean;
  nextCursor?: string | null;
  items: NewsItem[];
}

// 查询参数
export interface ItemsParams {
  mode?: 'selected' | 'all';
  category?: Category;
  since?: string;
  take?: number;
  cursor?: string;
  q?: string;
}

// 日报 - 板块条目
export interface DailySectionItem {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
}

// 日报 - 板块
export interface DailySection {
  label: string;
  items: DailySectionItem[];
}

// 日报 - 快讯
export interface DailyFlash {
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
}

// 日报 - 导语
export interface DailyLead {
  title: string;
  leadParagraph: string;
}

// 日报
export interface DailyReport {
  date: string;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  lead: DailyLead | null;
  sections: DailySection[];
  flashes: DailyFlash[];
}

// 日报归档条目
export interface DailyArchiveItem {
  date: string;
  generatedAt: string;
  leadTitle: string;
}

// 日报归档响应
export interface DailiesResponse {
  count: number;
  items: DailyArchiveItem[];
}
