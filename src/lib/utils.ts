/** 将相对时间 (now-24h, now-3d, now-7d) 转为 ISO 日期字符串，精确到分钟避免无限重请求 */
export function resolveSince(since: string): string {
  const match = since.match(/^now-(\d+)(h|d)$/);
  if (!match) return since;
  const num = parseInt(match[1], 10);
  const unit = match[2];
  const ms = unit === 'h' ? num * 3600000 : num * 86400000;
  const d = new Date(Date.now() - ms);
  // Truncate to minute precision so SWR key stays stable within a minute
  return d.toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00.000Z');
}

/** 将 ISO 8601 UTC 时间转为中文相对时间 */
export function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  if (diff < 0) return '刚刚';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');

  if (days < 30) return `${month}/${day} ${h}:${m}`;

  return `${d.getFullYear()}/${month}/${day}`;
}

/** 分类中文标签映射 */
export function categoryLabel(category?: string | null): string {
  const labels: Record<string, string> = {
    'ai-models': '模型',
    'ai-products': '产品',
    'industry': '行业',
    'paper': '论文',
    'tip': '技巧',
  };
  return category ? labels[category] || category : '其他';
}

/** 构建资讯列表代理 URL（用于 SWR，走本地代理避免 CORS） */
export function buildItemsURL(params: Record<string, string | number | undefined>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `/api/proxy?path=${encodeURIComponent('/api/public/items')}${qs ? '&' + qs : ''}`;
}
