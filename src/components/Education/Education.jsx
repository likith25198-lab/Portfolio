import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Education.css'

const educationData = [
  {
    id: 1,
    degree: 'ICSE',
    institution: 'S Cadambi Vidya Kendra',
    period: '2018',
    score: '86.16%',
    logo: '/school.png',
  },
  {
    id: 2,
    degree: 'B.E - Mechanical Engineering',
    institution: 'Dayananda Sagar College of Engineering - Bengaluru',
    period: '2021 — 2024',
    score: '8.16',
    logo: '/college.png',
  },
  {
    id: 3,
    degree: 'PGDM',
    specialization: 'Finance and Marketing',
    institution: 'SDMIMD – Mysuru',
    period: '2025 — 2027',
    score: 'GPA: 3.2 / 4',
    logo: '/MBA.png',
  },
]

const Education = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' })

  // 3D Flip entrance for cards with specific delays
  const customDelays = [0, 2, 5]; // ICSE: 0s, BE: 2s, PGDM: 5s

  const cardVariants = {
    hidden: { opacity: 0, rotateX: -20, y: 30, scale: 0.95, transformPerspective: 1000 },
    visible: (i) => ({
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: 1,
      transition: {
        delay: customDelays[i] || 0,
        duration: 1.2, // Increased duration for a smoother, elegant transition
        ease: [0.25, 0.46, 0.45, 0.94], 
      },
    }),
  }

  return (
    <section id="education" className="section education" ref={sectionRef}>
      <div className="container">
        
        <div className="education__layout">
          
          {/* Left Side: Bare Video Element */}
          <video 
            className="education__video-bare"
            src="/education.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            title="Education Visual"
          />

          {/* Right Side: Timeline Content */}
          <div className="education__content-side">
            <motion.div
              className="section-header education__header"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="section-label">Education</span>
              <h2 className="section-title">Academic Journey</h2>
            </motion.div>

            <div className="education__timeline-3d">
              {educationData.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="education__card-3d-wrapper"
                  custom={index}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={cardVariants}
                >
                  <div className="education__card-3d">
                    <div className="education__card-content">
                      
                      <div className="education__card-header">
                        <div>
                          <div className="education__period-badge">{item.period}</div>
                          <h3 className="education__degree">{item.degree}</h3>
                        </div>
                        {item.logo && (
                          <div className="education__logo-wrapper">
                            <img src={item.logo} alt={`${item.institution} logo`} className="education__logo" />
                          </div>
                        )}
                      </div>

                      <span className="education__institution">{item.institution}</span>
                      
                      {item.specialization && (
                        <span className="education__specialization" style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>
                          Specialization: {item.specialization}
                        </span>
                      )}
                      
                      {item.score && (
                        <div className="education__score-wrapper">
                          <span className="education__score-label">Score / GPA:</span>
                          <span className="education__score">{item.score}</span>
                        </div>
                      )}
                    </div>
                    <div className="education__card-glow"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </section>
  )
}

export default Education
