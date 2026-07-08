import { Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getLesson, lessonEntries } from '@/lessons/registry';
import type { Lesson, LessonSection } from '@/lessons/types';
import { Reveal } from '@/lessons/Reveal';
import { Rich } from '@/lessons/RichText';
import { Quiz } from '@/lessons/Quiz';
import { LessonModel3D } from '@/lessons/LessonModel3D';
import { vizRegistry } from '@/lessons/viz/vizRegistry';
import { useApp } from '@/state/app';

const TONE_LABELS: Record<string, string> = {
  info: 'Bilgi',
  tip: 'İpucu',
  warning: 'Dikkat',
  formula: 'Formül',
  example: 'Örnek',
  history: 'Tarihçe',
};

function Section({ section }: { section: LessonSection }) {
  switch (section.kind) {
    case 'heading':
      return (
        <header className="lesson-heading" id={section.id}>
          <h2>{section.title}</h2>
          {section.lead && (
            <p className="lesson-lead">
              <Rich text={section.lead} />
            </p>
          )}
        </header>
      );
    case 'prose':
      return (
        <div className="lesson-prose">
          {section.body.map((p, i) => (
            <p key={i}>
              <Rich text={p} />
            </p>
          ))}
        </div>
      );
    case 'list': {
      const items = section.items.map((item, i) => (
        <li key={i}>
          <Rich text={item} />
        </li>
      ));
      return (
        <div className="lesson-list">
          {section.title && <h3>{section.title}</h3>}
          {section.ordered ? <ol>{items}</ol> : <ul>{items}</ul>}
        </div>
      );
    }
    case 'callout':
      return (
        <aside className={`lesson-callout tone-${section.tone}`}>
          <span className="callout-tag">{section.title ?? TONE_LABELS[section.tone]}</span>
          {section.body.map((p, i) => (
            <p key={i}>
              <Rich text={p} />
            </p>
          ))}
        </aside>
      );
    case 'table':
      return (
        <div className="lesson-table-wrap">
          {section.title && <h3>{section.title}</h3>}
          <table className="lesson-table">
            <thead>
              <tr>
                {section.head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <Rich text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'viz': {
      const VizComponent = vizRegistry[section.viz];
      return (
        <figure className="lesson-viz">
          {section.title && <figcaption className="lesson-viz-title">{section.title}</figcaption>}
          <Suspense fallback={<div className="lesson-viz-loading">Görselleştirme yükleniyor…</div>}>
            <VizComponent {...(section.props ?? {})} />
          </Suspense>
          {section.caption && (
            <figcaption className="lesson-caption">
              <Rich text={section.caption} />
            </figcaption>
          )}
        </figure>
      );
    }
    case 'model3d':
      return (
        <LessonModel3D
          component={section.component}
          {...(section.title !== undefined ? { title: section.title } : {})}
          {...(section.caption !== undefined ? { caption: section.caption } : {})}
          {...(section.sim !== undefined ? { sim: section.sim } : {})}
          {...(section.explode !== undefined ? { explode: section.explode } : {})}
        />
      );
    case 'quiz':
      return (
        <Quiz
          question={section.question}
          options={section.options}
          answer={section.answer}
          explain={section.explain}
        />
      );
  }
}

function LessonArticle({ lesson }: { lesson: Lesson }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const openLesson = useApp((s) => s.openLesson);

  // ders değişince en üste dön
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setProgress(0);
  }, [lesson.id]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 0);
  };

  const headings = lesson.sections.filter((s) => s.kind === 'heading');
  const index = lessonEntries.findIndex((e) => e.id === lesson.id);
  const prev = index > 0 ? lessonEntries[index - 1] : undefined;
  const next = index >= 0 && index < lessonEntries.length - 1 ? lessonEntries[index + 1] : undefined;

  const scrollToHeading = (id: string) => {
    scrollRef.current
      ?.querySelector(`#${CSS.escape(id)}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="lesson-view" ref={scrollRef} onScroll={onScroll}>
      <div className="lesson-progress" aria-hidden="true">
        <div className="lesson-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <article className="lesson-article">
        <header className="lesson-hero">
          <span className="lesson-hero-no">Ders {String(lesson.order).padStart(2, '0')}</span>
          <h1 className="lesson-hero-title">{lesson.title}</h1>
          <p className="lesson-hero-subtitle">{lesson.subtitle}</p>
          <div className="lesson-hero-meta">
            <span>≈ {lesson.minutes} dk</span>
            <span>·</span>
            <span>{headings.length} bölüm</span>
          </div>
          {headings.length > 1 && (
            <nav className="lesson-toc" aria-label="Ders içindekiler">
              {headings.map((h, i) => (
                <button key={h.id} type="button" onClick={() => scrollToHeading(h.id)}>
                  <span>{i + 1}</span> {h.title}
                </button>
              ))}
            </nav>
          )}
        </header>

        {lesson.sections.map((section, i) => (
          <Reveal key={i} as="section">
            <Section section={section} />
          </Reveal>
        ))}

        <nav className="lesson-pager" aria-label="Ders gezinme">
          {prev ? (
            <button type="button" className="lesson-pager-btn" onClick={() => openLesson(prev.id)}>
              <span className="pager-dir">← Önceki ders</span>
              <span className="pager-title">{prev.title}</span>
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button
              type="button"
              className="lesson-pager-btn next"
              onClick={() => openLesson(next.id)}
            >
              <span className="pager-dir">Sonraki ders →</span>
              <span className="pager-title">{next.title}</span>
            </button>
          )}
        </nav>
      </article>
    </div>
  );
}

function DraftLesson({ title }: { title: string }) {
  return (
    <div className="lesson-view">
      <article className="lesson-article lesson-draft">
        <h1 className="lesson-hero-title">{title}</h1>
        <p className="lesson-hero-subtitle">
          Bu dersin not klasörü algılandı; interaktif içeriği henüz hazırlanıyor. Klasördeki
          notlardan ders üretildiğinde burada otomatik olarak görünecek.
        </p>
      </article>
    </div>
  );
}

/** "Bilgisayar Mimarisi" ders okuyucusu — kaydırma ilerlemeli interaktif makale. */
export function LessonView(): ReactNode {
  const activeLessonId = useApp((s) => s.activeLessonId);
  if (!activeLessonId) return null;

  const lesson = getLesson(activeLessonId);
  if (lesson) return <LessonArticle lesson={lesson} />;

  const entry = lessonEntries.find((e) => e.id === activeLessonId);
  return <DraftLesson title={entry?.title ?? 'Ders bulunamadı'} />;
}
