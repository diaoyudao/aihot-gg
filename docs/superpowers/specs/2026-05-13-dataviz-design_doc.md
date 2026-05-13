# Data Visualization — Design Doc (ai-code-guard)

## Architecture Layer

### System Boundary

**Inputs:**
- `/api/public/items?mode=all&since=...&take=500` → ItemsResponse
- `/api/public/dailies?take=30` → DailiesResponse
- Home page first-page items (already in client)

**Outputs:**
- `/stats` page: 4 chart components (Recharts)
- Home header: category pill bar + mini donut (CSS/SVG)
- Daily masthead: section bar chart (CSS)

**Exclusions:**
1. No new backend API endpoints
2. No server-side aggregation / ISR
3. No user-customizable chart config
4. No data export
5. No chart libraries besides Recharts

### Core Modules

| Module | Responsibility | Existing Code Ref |
|--------|---------------|-------------------|
| useStats | Aggregation hooks from existing API data | src/lib/api.ts swrFetcher, src/lib/types.ts ItemsResponse |
| StatsPage | Stats page container with Recharts | src/app/page.tsx page pattern |
| InlineCharts | Lightweight inline charts on home/daily | src/components/CategoryFilter.tsx embed location |

### Data Flow

```
API (existing)
  │
  ├── /api/public/items ──→ useStats hooks ──→ StatsPage (Recharts)
  │                         (SWR cache)     ──→ CategoryPillBar (CSS)
  │
  └── /api/public/dailies → useDailyStats → ActivityHeatmap
                                        → DailySectionBars (CSS)
```

## Pattern Layer

### Public Functions — useStats.ts

| Function | Signature | Returns |
|----------|-----------|---------|
| useCategoryTrend | `(days: 7 \| 30) =>` | `{ data, isLoading }` — `{ date, ai-models, ai-products, industry, paper, tip }[]` |
| useSourceRanking | `(days: 30) =>` | `{ data, isLoading }` — `{ name, count }[]` top 15 |
| useDailyStats | `() =>` | `{ data, isLoading }` — `{ date, count }[]` |
| aggregateByDateCategory | `(items: NewsItem[]) =>` | TrendData[] (pure, exported for testing) |
| aggregateBySource | `(items: NewsItem[], limit?: number) =>` | SourceRank[] (pure, exported for testing) |

### File Paths

| Path | Status | Description |
|------|--------|-------------|
| src/lib/useStats.ts | **NEW** | Aggregation hooks + pure functions |
| src/components/stats/CategoryPie.tsx | **NEW** | Recharts donut |
| src/components/stats/CategoryTrend.tsx | **NEW** | Recharts line chart |
| src/components/stats/SourceRank.tsx | **NEW** | Recharts horizontal bar |
| src/components/stats/ActivityHeatmap.tsx | **NEW** | Pure CSS grid heatmap |
| src/components/CategoryPillBar.tsx | **NEW** | Home inline pills + mini donut |
| src/components/DailySectionBars.tsx | **NEW** | Daily section bars |
| src/app/stats/page.tsx | **NEW** | Stats page |
| src/components/Sidebar.tsx | MODIFY | Add stats nav link |
| src/__tests__/useStats.test.ts | **NEW** | Aggregation unit tests |

### Design Pattern

**Why not simpler?** Simplest approach: compute inline in each component. Rejected because:
- 3 components need same aggregated data → duplicate computation
- Can't test aggregation logic independently
- SWR cache can't be shared

Pattern chosen: **Custom hooks + pure aggregation functions**. Hooks handle fetch+cache, pure functions handle transform. Testable, reusable, single fetch shared.

### Implementation Reference

SWR infinite pattern from `src/app/page.tsx:18-33` — same swrFetcher, same ItemsResponse type.

Category iteration pattern from `src/components/CategoryFilter.tsx:20-28` — `Object.entries(CATEGORY_LABELS)`.

### Quality Rules

- Aggregation functions must be pure (no side effects, testable)
- All Recharts colors read from CSS variables via getComputedStyle
- No hardcoded color values in chart components
- Each chart component < 80 lines
- useStats hooks share single SWR key per days param
