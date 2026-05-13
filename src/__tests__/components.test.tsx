import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '@/components/CategoryFilter';
import DailyReport from '@/components/DailyReport';
import type { Category } from '@/lib/types';
import type { DailyReport as DailyReportType } from '@/lib/types';

describe('CategoryFilter', () => {
  it('renders all category buttons', () => {
    render(<CategoryFilter selected="" onChange={() => {}} />);
    expect(screen.getByText('模型')).toBeInTheDocument();
    expect(screen.getByText('产品')).toBeInTheDocument();
    expect(screen.getByText('行业')).toBeInTheDocument();
    expect(screen.getByText('论文')).toBeInTheDocument();
    expect(screen.getByText('技巧')).toBeInTheDocument();
  });

  it('highlights selected category', () => {
    render(<CategoryFilter selected="ai-models" onChange={() => {}} />);
    const btn = screen.getByText('模型');
    expect(btn.className).toContain('seg-item-active');
  });

  it('calls onChange when category clicked', () => {
    const onChange = vi.fn();
    render(<CategoryFilter selected="" onChange={onChange} />);
    fireEvent.click(screen.getByText('模型'));
    expect(onChange).toHaveBeenCalledWith('ai-models');
  });

  it('calls onChange with empty string when "全部" clicked', () => {
    const onChange = vi.fn();
    render(<CategoryFilter selected="ai-models" onChange={onChange} />);
    fireEvent.click(screen.getByText('全部'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});

const MOCK_REPORT: DailyReportType = {
  date: '2026-05-13',
  generatedAt: '2026-05-13T08:00:00Z',
  windowStart: '2026-05-12T08:00:00Z',
  windowEnd: '2026-05-13T08:00:00Z',
  lead: {
    title: '今日导语',
    leadParagraph: '这是今日导语内容。',
  },
  sections: [
    {
      label: '模型发布/更新',
      items: [
        {
          title: 'GPT-5 发布',
          summary: 'OpenAI 发布了 GPT-5',
          sourceUrl: 'https://example.com/gpt5',
          sourceName: 'OpenAI Blog',
        },
      ],
    },
  ],
  flashes: [
    {
      title: '快讯标题',
      sourceName: 'TechCrunch',
      sourceUrl: 'https://example.com/flash',
      publishedAt: '2026-05-13T06:00:00Z',
    },
  ],
};

describe('DailyReport', () => {
  it('renders lead title and paragraph', () => {
    render(<DailyReport report={MOCK_REPORT} />);
    expect(screen.getByText('今日导语')).toBeInTheDocument();
    expect(screen.getByText('这是今日导语内容。')).toBeInTheDocument();
  });

  it('renders section label and items', () => {
    render(<DailyReport report={MOCK_REPORT} />);
    // Section label appears in both section title and role-tag
    const labels = screen.getAllByText('模型发布/更新');
    expect(labels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('GPT-5 发布')).toBeInTheDocument();
    expect(screen.getByText('OpenAI Blog')).toBeInTheDocument();
  });

  it('renders flash items', () => {
    render(<DailyReport report={MOCK_REPORT} />);
    expect(screen.getByText('快讯标题')).toBeInTheDocument();
  });

  it('renders section item links with correct href', () => {
    render(<DailyReport report={MOCK_REPORT} />);
    const link = screen.getByText('GPT-5 发布').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com/gpt5');
  });
});
