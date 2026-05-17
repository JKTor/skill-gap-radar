import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Radar,
  Search,
  Sparkles,
  Target,
} from 'lucide-react'

type Props = { onStart: () => void }

export default function HowToUse({ onStart }: Props) {
  return (
    <div className="guide-shell">
      {/* Hero */}
      <header className="guide-hero">
        <span className="brand-mark" style={{ width: 56, height: 56 }}>
          <Radar size={28} aria-hidden="true" />
        </span>
        <h1>Skill-Gap Radar</h1>
        <p className="guide-subtitle">
          เครื่องมือวิเคราะห์ช่องว่างทักษะของคุณ<br />
          เทียบกับตลาดงานจริงในประเทศไทย
        </p>
        <button className="cta-button" onClick={onStart}>
          เริ่มใช้งานเลย →
        </button>
      </header>

      {/* What is it */}
      <section className="guide-section">
        <h2>เว็บนี้คืออะไร?</h2>
        <p>
          Skill-Gap Radar ช่วยให้คุณรู้ว่า <strong>ทักษะที่มีอยู่ตอนนี้ห่างจากตำแหน่งงานที่อยากได้แค่ไหน</strong>{' '}
          โดยเปรียบเทียบกับข้อมูลงานจริงจากบริษัทชั้นนำในไทย เช่น KBank, Agoda, Bitkub, AIS
          และแนะนำ course ที่ช่วยปิด gap ได้เร็วที่สุด
        </p>
      </section>

      {/* Steps */}
      <section className="guide-section">
        <h2>วิธีใช้งาน</h2>
        <ol className="guide-steps">
          <li>
            <span className="step-icon"><Search size={20} /></span>
            <div>
              <h3>เลือก Target Role</h3>
              <p>พิมพ์หรือเลือกตำแหน่งงานที่อยากได้ใน dropdown ด้านซ้าย เช่น "Data Scientist", "Blockchain Developer"</p>
            </div>
          </li>
          <li>
            <span className="step-icon"><CheckCircle2 size={20} /></span>
            <div>
              <h3>ติ๊กทักษะที่มีอยู่แล้ว</h3>
              <p>เลือกทักษะที่คุณมีในส่วน "Your skills" ด้านซ้าย ระบบจะคำนวณ gap ให้อัตโนมัติทันที</p>
            </div>
          </li>
          <li>
            <span className="step-icon"><BarChart3 size={20} /></span>
            <div>
              <h3>ดูผลวิเคราะห์</h3>
              <p>
                <strong>Skill radar</strong> — แสดงระดับทักษะของคุณเทียบกับที่ตลาดต้องการ<br />
                <strong>Skill gaps</strong> — รายการทักษะที่ขาด เรียงจากสำคัญมากสุด<br />
                <strong>Readiness %</strong> — คะแนนความพร้อมโดยรวม
              </p>
            </div>
          </li>
          <li>
            <span className="step-icon"><BookOpenCheck size={20} /></span>
            <div>
              <h3>เรียน course ที่แนะนำ</h3>
              <p>ระบบเลือก course ที่ปิด gap ได้มากที่สุดก่อน พร้อม rating, ราคา และลิงก์ไปยัง platform จริง</p>
            </div>
          </li>
        </ol>
      </section>

      {/* What results mean */}
      <section className="guide-section">
        <h2>ตัวเลขหมายความว่าอะไร?</h2>
        <div className="guide-metrics">
          <div className="metric-card">
            <Target size={24} />
            <h3>Gap Score</h3>
            <p>0% = ทักษะครบ ไม่มี gap<br />100% = ทักษะขาดทั้งหมด<br />ยิ่งน้อยยิ่งดี</p>
          </div>
          <div className="metric-card">
            <Sparkles size={24} />
            <h3>Readiness %</h3>
            <p>75%+ = พร้อม apply ได้เลย<br />ต่ำกว่า 75% = ควรฝึกเพิ่มก่อน</p>
          </div>
          <div className="metric-card">
            <BarChart3 size={24} />
            <h3>Gap Bar</h3>
            <p>แถบสีเข้ม = ระดับที่ตลาดต้องการ<br />แถบสีอ่อน = ระดับที่คุณมี<br />ระยะห่าง = gap ที่ต้องปิด</p>
          </div>
        </div>
      </section>

      {/* Data source */}
      <section className="guide-section">
        <h2>ข้อมูลมาจากไหน?</h2>
        <p>
          ข้อมูลงานและ course รวบรวมจากตลาดงานไทยและ platform เรียนออนไลน์ชั้นนำ ครอบคลุมสาย
          FinTech, Cloud, Cybersecurity, AI/ML และ Frontend Development
        </p>
        <div className="company-chips">
          {['KBank', 'SCB', 'Bitkub', 'TMB Thanachart', 'True Digital', 'G-Able', 'Agoda', 'AIS'].map((c) => (
            <span key={c} className="chip">{c}</span>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center', paddingBottom: 48 }}>
        <button className="cta-button" onClick={onStart}>
          เริ่มวิเคราะห์ทักษะของคุณ →
        </button>
      </div>
    </div>
  )
}
