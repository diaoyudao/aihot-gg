'use client';

import type { Category } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types';

interface CategoryFilterProps {
  selected?: Category | '';
  onChange: (category: Category | '') => void;
}

export default function CategoryFilter({ selected = '', onChange }: CategoryFilterProps) {
  return (
    <div className="segmented">
      <button
        onClick={() => onChange('')}
        className={`seg-item ${selected === '' ? 'seg-item-active' : ''}`}
      >
        全部
      </button>
      {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([value, label]) => {
        const isActive = selected === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`seg-item ${isActive ? 'seg-item-active' : ''}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
