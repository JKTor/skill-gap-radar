import { BookOpenCheck, ExternalLink, Star } from 'lucide-react'
import type { RecommendedCourse } from '../api'
import { useLang } from '../LangContext'

/**
 * คอร์สที่แนะนำ 5 อันดับแรก
 *
 * ลำดับมาจากหลังบ้าน (`skill_gap.py`) ซึ่งเรียงตาม "ปิดช่องว่างรวมได้เท่าไหร่"
 * ไม่ใช่คะแนนรีวิว — ตรงนี้แค่แสดงผลตามลำดับที่ได้มา ไม่เรียงใหม่
 */
export default function CourseList({ courses }: { courses: RecommendedCourse[] }) {
  const { T } = useLang()

  return (
    <section className="learning-plan" aria-label="Course recommendations">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{T.nextActions}</p>
          <h3>{T.recommendedCourses}</h3>
        </div>
        <BookOpenCheck size={20} aria-hidden="true" />
      </div>
      {courses.slice(0, 5).map((course, i) => (
        <article key={course.course_id} className="plan-item">
          <span>{i + 1}</span>
          <div>
            <h4>{course.course_title}</h4>
            <p>
              {course.provider}
              {course.rating && (
                <> · <Star size={12} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle' }} /> {course.rating}</>
              )}
              {course.price_usd !== undefined && course.price_usd !== null && (
                <> · {course.price_usd === 0 ? T.free : `$${course.price_usd}`}</>
              )}
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>
              {T.covers} {course.covers_skills.join(', ')}
            </p>
          </div>
          {course.url && (
            <a href={course.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${course.course_title}`}>
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
        </article>
      ))}
    </section>
  )
}
