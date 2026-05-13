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

export const CATEGORY_COLORS: Record<Category, { cls: string }> = {
  'ai-models':   { cls: 'cat-models' },
  'ai-products': { cls: 'cat-products' },
  'industry':    { cls: 'cat-industry' },
  'paper':       { cls: 'cat-paper' },
  'tip':         { cls: 'cat-tip' },
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
