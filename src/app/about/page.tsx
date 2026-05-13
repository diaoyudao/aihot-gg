export default function AboutPage() {
  return (
    <div className="page-enter" style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
      <section className="page-header">
        <div>
          <div className="title page-title">关于</div>
          <div className="page-subtitle">AI 资讯精选系统</div>
        </div>
      </section>

      <article className="tl-card" style={{ padding: '20px 24px' }}>
        <div className="space-y-6 text-sm leading-relaxed">
          <p className="text-text-1 max-w-[65ch]">
            AI HOT 是一个 AI 资讯精选系统，基于 168 个精选信源，通过 AI 评分和事件聚类，
            每日为 AI 从业者提供结构化的资讯精选。
          </p>

          <section>
            <h2 className="title text-base font-semibold mb-3">信源体系</h2>
            <dl className="space-y-1.5 text-text-1 text-[13px]">
              <div><dt className="font-semibold text-text-0 inline">T1</dt> <dd className="inline">官方一手源（OpenAI / Anthropic / CMU 博客等）</dd></div>
              <div><dt className="font-semibold text-text-0 inline">T1.5</dt> <dd className="inline">官方社交账号</dd></div>
              <div><dt className="font-semibold text-text-0 inline">T2</dt> <dd className="inline">KOL / 媒体 / 综合资讯站</dd></div>
            </dl>
          </section>

          <section>
            <h2 className="title text-base font-semibold mb-3">信息处理</h2>
            <ul className="text-text-1 text-[13px] space-y-1 list-none">
              <li>每条信息按 5 维度评分，达标进入精选</li>
              <li>自动折叠重复事件，生成每日日报</li>
              <li>日报分 5 板块：模型 / 产品 / 行业 / 论文 / 技巧</li>
            </ul>
          </section>

          <section>
            <h2 className="title text-base font-semibold mb-3">数据来源</h2>
            <p className="text-text-1 text-[13px]">
              数据来自{' '}
              <a href="https://aihot.virxact.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                aihot.virxact.com
              </a>
              ，由数字生命卡兹克团队维护。开源仓库：
              <a href="https://github.com/kkkkhazix/khazix-skills" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                kkkkhazix/khazix-skills
              </a>
            </p>
          </section>

          <section>
            <h2 className="title text-base font-semibold mb-3">本项目</h2>
            <p className="text-text-1 text-[13px]">
              社区 Fork 版本，Next.js + TypeScript + Tailwind CSS 构建，
              消费 AIHOT 公开 API。
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
