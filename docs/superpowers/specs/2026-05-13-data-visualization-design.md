# Data Visualization Design

## Overview

Add data visualization to AIHOT: a dedicated stats page with Recharts, plus lightweight inline charts on existing pages (pure CSS/SVG).

## Approach

**Pure frontend aggregation** — no backend changes. Client fetches existing API data, aggregates locally, SWR caches for 5 min.

## Data Layer — `src/lib/useStats.ts`

### Hooks

1. **`useCategoryTrend(days: 7|30)`**
   - Fetches `mode=all&since=now-{days}d&take=500`
   - Aggregates by `publishedAt` date + `category`
   - Returns `{ date, 'ai-models': n, 'ai-products': n, industry: n, paper: n, tip: n }[]`

2. **`useSourceRanking(days: 30)`**
   - Same data source, aggregates by `source` count
   - Returns `{ name, count }[]` Top 15

3. **`useDailyStats()`**
   - Fetches `/api/public/dailies?take=30`
   - Returns heatmap data: `{ date, count }[]`

### SWR Strategy

- All trend/ranking hooks share one SWR cache key per `days` value (single fetch, multiple consumers)
- `dedupingInterval: 300000` (5 min)
- Key format: `/stats/items/{days}`

## Stats Page — `/stats`

### Layout (dashboard grid)

```
┌─────────────────────────────────────┐
│ page-header: 数据洞察               │
│ 副标题: AI 资讯趋势与统计           │
│ 时间范围切换: 7天 | 30天            │
├──────────┬──────────────────────────┤
│ 分类占比 │ 分类趋势折线图           │
│ 环形图   │ (5 lines, one per cat)   │
│ + total  │                          │
├──────────┴──────────────────────────┤
│ Source Top 10 (horizontal bar)      │
├─────────────────────────────────────┤
│ Activity heatmap (30-day grid)      │
└─────────────────────────────────────┘
```

### Components

| Component | Library | Description |
|-----------|---------|-------------|
| `CategoryPie` | Recharts PieChart | Donut + center total count |
| `CategoryTrend` | Recharts LineChart | 5 colored lines with dots |
| `SourceRank` | Recharts BarChart | Horizontal bars, top 10 |
| `ActivityHeatmap` | Pure CSS grid | 30-day squares, opacity = volume |
| `StatsPage` | — | Container, manages `days` state |

### Theming

- Recharts colors use CSS variable values (`getComputedStyle` read at render)
- Card containers reuse `tl-card` border + `surface-card` bg
- Dark/light mode + accent color all apply

## Inline Charts (existing pages)

### Home page — category pill bar

- Below `CategoryFilter` in page-header
- 5 pills: `{label} {count}` (e.g. `模型 42`)
- Mini 40x40px donut on right, hover tooltip
- Data: aggregate from first page items only, no extra fetch
- Pure CSS/SVG, no Recharts

### Daily page — section bar chart

- Below `daily-masthead-meta`
- 5 horizontal bars, width proportional to items count
- Colors from category CSS vars
- Pure CSS, no Recharts
- < 3KB JS total for both inline charts

## Dependencies

- `recharts` (^2.x) — for stats page only
- No new backend dependencies

## File Structure

```
src/
  lib/
    useStats.ts          — aggregation hooks
  components/
    stats/
      CategoryPie.tsx
      CategoryTrend.tsx
      SourceRank.tsx
      ActivityHeatmap.tsx
    CategoryPillBar.tsx  — home inline chart
    DailySectionBars.tsx — daily inline chart
  app/
    stats/
      page.tsx           — stats page
```

## Testing

- Unit tests for aggregation logic in `useStats.ts` (pure functions)
- Component render tests for each chart
- Target: 10+ new tests
