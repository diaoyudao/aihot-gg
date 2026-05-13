'use client';

import { relativeTime } from '@/lib/utils';

export default function RelativeTime({ date }: { date: string }) {
  return (
    <time dateTime={date} className="text-muted text-xs">
      {relativeTime(date)}
    </time>
  );
}
