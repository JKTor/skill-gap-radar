import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Radar,
  Search,
  Sparkles,
  Target,
} from 'lucide-react'
import { useLang } from '../LangContext'

type Props = { onStart: () => void }

export default function HowToUse({ onStart }: Props) {
  const { T } = useLang()

  return (
    <div className="guide-shell">
      {/* Hero */}
      <header className="guide-hero">
        <span className="brand-mark" style={{ width: 56, height: 56 }}>
          <Radar size={28} aria-hidden="true" />
        </span>
        <h1>{T.heroTitle}</h1>
        <p className="guide-subtitle">
          {T.heroSubtitle.split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </p>
        <button className="cta-button" onClick={onStart}>
          {T.heroBtn}
        </button>
      </header>

      {/* What is it */}
      <section className="guide-section">
        <h2>{T.whatTitle}</h2>
        <p>{T.whatBody}</p>
      </section>

      {/* Steps */}
      <section className="guide-section">
        <h2>{T.howTitle}</h2>
        <ol className="guide-steps">
          <li>
            <span className="step-icon"><Search size={20} /></span>
            <div>
              <h3>{T.step1Title}</h3>
              <p>{T.step1Body}</p>
            </div>
          </li>
          <li>
            <span className="step-icon"><CheckCircle2 size={20} /></span>
            <div>
              <h3>{T.step2Title}</h3>
              <p>{T.step2Body}</p>
            </div>
          </li>
          <li>
            <span className="step-icon"><BarChart3 size={20} /></span>
            <div>
              <h3>{T.step3Title}</h3>
              <p>
                {T.step3Body.split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </p>
            </div>
          </li>
          <li>
            <span className="step-icon"><BookOpenCheck size={20} /></span>
            <div>
              <h3>{T.step4Title}</h3>
              <p>{T.step4Body}</p>
            </div>
          </li>
        </ol>
      </section>

      {/* What results mean */}
      <section className="guide-section">
        <h2>{T.metricsTitle}</h2>
        <div className="guide-metrics">
          <div className="metric-card">
            <Target size={24} />
            <h3>{T.metric1Title}</h3>
            <p>{T.metric1Body.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>
          </div>
          <div className="metric-card">
            <Sparkles size={24} />
            <h3>{T.metric2Title}</h3>
            <p>{T.metric2Body.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>
          </div>
          <div className="metric-card">
            <BarChart3 size={24} />
            <h3>{T.metric3Title}</h3>
            <p>{T.metric3Body.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>
          </div>
        </div>
      </section>

      {/* Data source */}
      <section className="guide-section">
        <h2>{T.dataTitle}</h2>
        <p>{T.dataBody}</p>
        <div className="company-chips">
          {['KBank', 'SCB', 'Bitkub', 'TMB Thanachart', 'True Digital', 'G-Able', 'Agoda', 'AIS'].map((c) => (
            <span key={c} className="chip">{c}</span>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center', paddingBottom: 48 }}>
        <button className="cta-button" onClick={onStart}>
          {T.ctaBottom}
        </button>
      </div>
    </div>
  )
}
