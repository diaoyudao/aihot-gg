import type { DailyReport as DailyReportType } from '@/lib/types';
import DailySectionBars from './DailySectionBars';

function formatChineseDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[d.getDay()];
  return `${year}年${month}月${day}日 星期${weekDay}`;
}

export default function DailyReport({ report }: { report: DailyReportType }) {
  return (
    <article className="daily-paper">
      {/* Masthead */}
      <header className="daily-masthead">
        <div className="daily-masthead-eyebrow">
          <span>AIHOT DAILY</span>
        </div>
        <h1 className="daily-masthead-title">
          AI <span className="accent">日报</span>
        </h1>
        <div className="daily-masthead-meta">
          <span className="daily-masthead-date">{formatChineseDate(report.date)}</span>
          <span className="daily-masthead-meta-rule" />
          <span className="daily-masthead-tagline">每日精选</span>
        </div>
      </header>

      {/* Lead */}
      {report.lead && (
        <div className="daily-lead">
          <h2 className="daily-lead-title">{report.lead.title}</h2>
          <p className="daily-lead-text">{report.lead.leadParagraph}</p>
        </div>
      )}

      {/* Section bars */}
      {report.sections.length > 0 && <DailySectionBars sections={report.sections} />}

      {/* Sections */}
      <div>
        {report.sections.map((section, i) => (
          <section key={i} className="daily-section">
            <div className="daily-section-header">
              <span className="daily-section-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="daily-section-title">{section.label}</span>
              <span className="daily-section-count"><strong>{section.items.length}</strong> 篇</span>
            </div>
            <div className="daily-section-articles">
              {section.items.map((item, j) => (
                <div key={j} className="daily-article">
                  <h3 className="daily-article-title">
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  </h3>
                  <p className="daily-article-summary">{item.summary}</p>
                  <div className="daily-article-source">
                    <span>{item.sourceName}</span>
                    <span className="role-tag">{section.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Flashes */}
      {report.flashes.length > 0 && (
        <section className="daily-flashes">
          <div className="daily-flashes-header">
            <span className="daily-section-no" style={{ fontSize: '40px' }}>
              {String(report.sections.length + 1).padStart(2, '0')}
            </span>
            <span className="daily-section-title">快讯</span>
            <span className="daily-section-count"><strong>{report.flashes.length}</strong> 条</span>
          </div>
          <div className="daily-flashes-articles">
            {report.flashes.map((flash, i) => (
              <div key={i} className="daily-flash-item">
                <span className="daily-flash-dot" />
                <a href={flash.sourceUrl} target="_blank" rel="noopener noreferrer">{flash.title}</a>
                <span className="daily-flash-source">{flash.sourceName}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
