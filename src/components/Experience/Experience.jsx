import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import './Experience.css'

/* =============================================
   DATA ARRAYS — Add new entries to extend
   ============================================= */

const experienceData = [
  {
    id: 1,
    role: 'Business Analytics Intern',
    company: 'Flowlogic Solutions, Bangalore',
    period: '1st April 2026 — 30th May 2026',
    certificateDate: '30 May 2026',
    certificateImage: '/cert-flowlogic-internship.png',
    signatories: 'Brinda S (Sales Manager) & Mohan Kumar R (Managing Partner)',
    appreciation: 'During the internship period, he demonstrated dedication, professionalism, and a willingness to learn while carrying out his assigned responsibilities. We appreciate his contribution and wish him success in all future endeavors.',
    bullets: [
      "Completed 2-month intensive internship program as Business Analytics Intern at Flowlogic Solutions, Bangalore.",
      "Developed and deployed the company's corporate website, including web hosting, domain setup, custom branding, and SEO optimization.",
      "Optimized IndiaMART profile and actively engaged with prospective clients to support lead generation and requirement gathering.",
      "Promoted company products at industry exhibitions while interacting with prospective clients and senior stakeholders.",
      "Built an interactive Tableau dashboard to analyze sales performance and deliver actionable business insights."
    ],
    tags: ['Marketing & Sales', 'Business Development', 'Data Analytics', 'Tableau', 'SEO & Web Hosting', 'Lead Generation', 'Client Engagement'],
  },
]



const certifications = [
  {
    id: 1,
    title: 'SAP Business Analyst Professional Certificate',
    issuer: 'SAP — Coursera',
    date: 'Jul 2026',
    credentialId: '6TWQS0WNW5RV',
    link: 'https://coursera.org/verify/professional-cert/6TWQS0WNW5RV',
    skills: ['Business Analysis', 'SAP Systems', 'Requirements Gathering', 'Process Modeling', 'Solution Design'],
    image: '/cert-sap-business-analyst.png',
  },
  {
    id: 2,
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Google — Coursera',
    date: 'Jun 2026',
    credentialId: 'EAWZXWA3F6C6',
    link: 'https://coursera.org/verify/professional-cert/EAWZXWA3F6C6',
    skills: ['Data Analytics', 'SQL', 'Tableau', 'Python', 'Spreadsheets'],
    image: '/cert-google-data-analytics.png',
  },
  {
    id: 3,
    title: 'Google Cloud Gen AI Academy — APAC 2026',
    issuer: 'Google Cloud — Hack2skill',
    date: 'Apr 2026',
    credentialId: '2026H2S04GCGENAIAPACC1-P01025',
    link: '',
    skills: ['Google Cloud', 'Generative AI', 'Cloud Infrastructure', 'AI Applications'],
    image: '/cert-google-genai.png',
  },
  {
    id: 4,
    title: 'McKinsey.org Forward Program',
    issuer: 'McKinsey.org',
    date: 'Jul 2025',
    credentialId: '',
    link: '',
    skills: ['Problem Solving', 'Communication', 'Digital Toolkit', 'Resilience'],
    image: '/cert-mckinsey-forward.png',
  },
  {
    id: 5,
    title: 'Back End | Full Stack Web Development in Node.js',
    issuer: 'Coding Ninjas',
    date: 'Dec 2023',
    credentialId: '',
    link: '',
    skills: ['Node.js', 'Backend Development', 'Full Stack', 'JavaScript'],
    image: '/cert-cn-backend.png',
  },
  {
    id: 6,
    title: 'Front End | Full Stack Web Development',
    issuer: 'Coding Ninjas',
    date: 'Sep 2023',
    credentialId: '0ba23fc18fcb9019',
    link: 'https://certificate.codingninjas.com/verify/0ba23fc18fcb9019',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Frontend Development'],
    image: '/cert-cn-frontend.png',
  },
  {
    id: 7,
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic',
    date: '2024',
    credentialId: '',
    link: '',
    skills: ['Generative AI', 'AI Frameworks', 'Anthropic'],
    image: '/cert-anthropic-ai.png',
  },
]

/* =============================================
   3D COMPONENTS  (React Three Fiber)
   ============================================= */

/** Slow-rotating wireframe icosahedron that follows the cursor */
function FloatingIcosahedron() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      state.pointer.x * 0.5,
      0.02,
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      state.pointer.y * 0.3,
      0.02,
    )
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#1B2A4A" wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  )
}



/* =============================================
   HORIZONTAL SCROLL WRAPPER
   ============================================= */

const HorizontalScrollWrapper = ({ children, className }) => {
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeft(scrollLeft > 0)
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll])

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = window.innerWidth < 768 ? 320 : 420
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  return (
    <div className="exp__scroll-wrapper">
      {showLeft && (
        <button
          className="exp__scroll-arrow exp__scroll-arrow--left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div className={className} ref={scrollRef} onScroll={checkScroll}>
        {children}
      </div>
      {showRight && (
        <button
          className="exp__scroll-arrow exp__scroll-arrow--right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

/* =============================================
   TAB CONTENT — Experience
   ============================================= */

const ExperienceTab = ({ isInView, onImageClick }) => {
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <HorizontalScrollWrapper className="exp__timeline">
      <div className="exp__timeline-line" />
      {experienceData.map((item, index) => {
        const isExpanded = !!expandedItems[item.id]
        const visibleBullets = isExpanded ? item.bullets : item.bullets.slice(0, 2)
        const hasMore = item.bullets.length > 2 || item.appreciation

        return (
          <motion.div
            key={item.id}
            className="exp__timeline-item"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              delay: index * 0.2,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="exp__timeline-dot" />
            <div className={`exp__timeline-card ${isExpanded ? 'exp__timeline-card--expanded' : ''}`}>
              {/* Certificate Image Thumbnail Preview */}
              {item.certificateImage && (
                <div
                  className="exp__cert-image-wrapper exp__internship-img-wrapper"
                  onClick={() =>
                    onImageClick &&
                    onImageClick({
                      title: `${item.role} Certificate`,
                      issuer: `${item.company} · Date of Issue: ${item.certificateDate}`,
                      date: item.period,
                      image: item.certificateImage,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.role} Certificate`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      onImageClick &&
                        onImageClick({
                          title: `${item.role} Certificate`,
                          issuer: `${item.company} · Date of Issue: ${item.certificateDate}`,
                          date: item.period,
                          image: item.certificateImage,
                        })
                  }}
                >
                  <img
                    src={item.certificateImage}
                    alt={`${item.company} Internship Certificate`}
                    className="exp__cert-image"
                    loading="lazy"
                  />
                  <div className="exp__cert-image-overlay">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>View Internship Certificate</span>
                  </div>
                  <div className="exp__cert-watermark-badge">Verified Certificate</div>
                </div>
              )}

              <div className="exp__card-header">
                <div>
                  <h3 className="exp__role">{item.role}</h3>
                  {item.subRole && <div className="exp__subrole">{item.subRole}</div>}
                  <span className="exp__company">{item.company}</span>
                </div>
                <div className="exp__header-right">
                  <span className="exp__period">{item.period}</span>
                </div>
              </div>

              {/* Bullets List */}
              <ul className="exp__bullets">
                {visibleBullets.map((bullet, idx) => (
                  <li key={idx} className="exp__bullet">
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Extra Details when Expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="exp__expanded-details"
                  >
                    {item.appreciation && (
                      <div className="exp__appreciation-box">
                        <div className="exp__appreciation-header">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                          <span>Official Certificate Remarks</span>
                        </div>
                        <p className="exp__appreciation-text">{item.appreciation}</p>
                      </div>
                    )}

                    <div className="exp__cert-details-grid">
                      <div className="exp__detail-item">
                        <span className="exp__detail-label">Issued Date</span>
                        <span className="exp__detail-value">{item.certificateDate}</span>
                      </div>
                      <div className="exp__detail-item">
                        <span className="exp__detail-label">Authorized Signatories</span>
                        <span className="exp__detail-value">{item.signatories}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons: Read More & Certificate Lightbox */}
              <div className="exp__card-actions">
                {hasMore && (
                  <button
                    className="exp__read-more-btn"
                    onClick={() => toggleExpand(item.id)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Show Less' : 'Read More Details'}</span>
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}

                {item.certificateImage && (
                  <button
                    className="exp__view-cert-btn"
                    onClick={() =>
                      onImageClick &&
                      onImageClick({
                        title: `${item.role} Certificate`,
                        issuer: `${item.company} · Date of Issue: ${item.certificateDate}`,
                        date: item.period,
                        image: item.certificateImage,
                      })
                    }
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Certificate Photo</span>
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="exp__tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="exp__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )
      })}
    </HorizontalScrollWrapper>
  )
}



/* =============================================
   TAB CONTENT — Certifications (3D tilt cards)
   ============================================= */

/* ---- Certificate Lightbox Modal ---- */
const CertificateLightbox = ({ cert, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      className="exp__lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="exp__lightbox-content"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="exp__lightbox-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="exp__lightbox-image-wrapper">
          <img
            src={cert.image}
            alt={`${cert.title} certificate`}
            className="exp__lightbox-image"
          />
        </div>
        <div className="exp__lightbox-info">
          <h3 className="exp__lightbox-title">{cert.title}</h3>
          <span className="exp__lightbox-issuer">{cert.issuer} · {cert.date}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

const CertificationCard = ({ cert, index, isInView, onImageClick }) => {
  const cardRef = useRef(null)
  const [imgError, setImgError] = useState(false)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
  }, [])

  return (
    <motion.div
      className="exp__cert-card-wrapper"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        ref={cardRef}
        className="exp__cert-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Certificate Image Thumbnail */}
        {cert.image && !imgError && (
          <div
            className="exp__cert-image-wrapper"
            onClick={() => onImageClick(cert)}
            role="button"
            tabIndex={0}
            aria-label={`View ${cert.title} certificate`}
            onKeyDown={(e) => { if (e.key === 'Enter') onImageClick(cert) }}
          >
            <img
              src={cert.image}
              alt={`${cert.title} certificate`}
              className="exp__cert-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="exp__cert-image-overlay">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>View Certificate</span>
            </div>
          </div>
        )}

        {/* Fallback badge if no image */}
        {(!cert.image || imgError) && (
          <div className="exp__cert-badge">
            <svg
              viewBox="0 0 24 24"
              className="exp__cert-icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M12 15l-3.5 2 .67-3.89L6 10.14l3.92-.57L12 6l2.08 3.57 3.92.57-2.83 2.97.67 3.89z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <h3 className="exp__cert-title">{cert.title}</h3>
        <span className="exp__cert-issuer">{cert.issuer}</span>
        <div className="exp__cert-meta">
          <span className="exp__cert-date">{cert.date}</span>
          <span className="exp__cert-id">{cert.credentialId}</span>
        </div>
        {cert.skills && cert.skills.length > 0 && (
          <div className="exp__cert-skills">
            {cert.skills.map((skill) => (
              <span key={skill} className="exp__cert-skill-pill">
                {skill}
              </span>
            ))}
          </div>
        )}
        {cert.link && (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="exp__cert-link"
          >
            Verify Certification
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginLeft: '4px' }}
            >
              <path
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
        <div className="exp__cert-glow" />
      </div>
    </motion.div>
  )
}

const CertificationsTab = ({ isInView, onImageClick }) => {
  return (
    <HorizontalScrollWrapper className="exp__cert-grid">
      {certifications.map((cert, index) => (
        <CertificationCard
          key={cert.id}
          cert={cert}
          index={index}
          isInView={isInView}
          onImageClick={onImageClick}
        />
      ))}
    </HorizontalScrollWrapper>
  )
}

/* =============================================
   MAIN COMPONENT
   ============================================= */

const tabs = ['Internships', 'Certifications']

const Experience = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [lightboxCert, setLightboxCert] = useState(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const tabContent = useMemo(
    () => [
      <ExperienceTab key="exp" isInView={isInView} onImageClick={setLightboxCert} />,
      <CertificationsTab key="certs" isInView={isInView} onImageClick={setLightboxCert} />,
    ],
    [isInView],
  )

  return (
    <section id="experience" className="section exp" ref={sectionRef}>
      {/* 3D Background */}
      <div className="exp__bg-canvas">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <FloatingIcosahedron />
        </Canvas>
      </div>

      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Internships &amp; Certifications</span>
          <h2 className="section-title">What I Bring</h2>
          <p className="section-subtitle">
            My professional journey and industry certifications.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <motion.div
          className="exp__tab-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`exp__tab ${activeTab === i ? 'exp__tab--active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <span className="exp__tab-text">{tab}</span>
              {activeTab === i && (
                <motion.div
                  className="exp__tab-indicator"
                  layoutId="tab-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="exp__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Full-screen Lightbox Modal */}
      <AnimatePresence>
        {lightboxCert && (
          <CertificateLightbox
            cert={lightboxCert}
            onClose={() => setLightboxCert(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Experience
