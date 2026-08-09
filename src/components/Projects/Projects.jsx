import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import './Projects.css'

/* =============================================
   DATA — All Portfolio Projects (Unified Collection)
   ============================================= */

const projectsData = [
  {
    id: 'a2',
    title: 'InvoiceIQ – AI-Powered Invoice Management System',
    category: 'AI & Automation',
    categoryIcon: '🤖',
    color: '#3B82F6',
    featured: true,
    size: 'bento-hero', // Takes prominent spot in grid
    description:
      'Developed InvoiceIQ, an AI-powered multi-agent invoice management system that automates the complete invoice lifecycle for freelancers and small businesses. Creates invoices from natural language, assesses client payment risk, automates reminders, and generates financial reports.',
    tags: ['Python', 'FastAPI', 'Google ADK', 'Gemini 2.5', 'GCP', 'Docker'],
    highlights: [
      'Designed a multi-agent AI architecture for invoice lifecycle automation.',
      'Built automated workflows for invoice creation, payment tracking, and follow-up reminders.',
      'Integrated Google Calendar and Gmail for automated scheduling and email notifications.',
      'Developed AI-based client risk scoring and Accounts Receivable (AR) Ageing Reports.',
      'Deployed the application on Google Cloud Run with automated background jobs using Cloud Scheduler.',
    ],
    tools: ['Python', 'FastAPI', 'Google ADK', 'Gemini 2.5 (Vertex AI)', 'Google Cloud Run', 'Cloud Firestore', 'Cloud Scheduler', 'Gmail MCP', 'Google Calendar MCP', 'Docker'],
    skills: ['AI Agent Development', 'Workflow Automation', 'API Development', 'Cloud Computing', 'Backend Development', 'System Design', 'Google Cloud Services', 'Business Process Automation'],
  },
  {
    id: 'm1',
    title: 'Luminex – Go-to-Market Strategy for AI Smart Glasses',
    category: 'Marketing & GTM',
    categoryIcon: '🚀',
    color: '#9333EA',
    featured: true,
    size: 'bento-wide',
    description:
      'Developed a comprehensive Go-to-Market (GTM) strategy for Luminex, a conceptual AI-powered smart eyewear brand offering real-time language translation and entertainment features. Conducted market research, customer segmentation, competitive analysis, branding, pricing, and distribution planning.',
    tags: ['Market Research', 'GTM Strategy', 'Branding', 'STP', 'Product Strategy'],
    highlights: [
      'Conducted market research and industry analysis for the AI smart wearables market.',
      'Identified target customer segments and developed customer positioning strategies.',
      'Performed competitive analysis and identified market gaps and differentiation opportunities.',
      'Designed the brand identity, product positioning, and value proposition.',
      'Developed a Go-to-Market strategy, including pricing, promotion, distribution, and launch planning.',
      'Proposed marketing strategies using digital marketing, influencer campaigns, and omnichannel distribution.',
    ],
    tools: ['Market Research', 'Competitive Analysis', 'STP (Segmentation, Targeting & Positioning)', 'Branding Strategy', 'Go-to-Market Strategy', 'Product Positioning', 'Marketing Strategy', 'Business Research'],
    skills: ['Market Analysis', 'Strategic Marketing', 'Consumer Insights', 'Product Management', 'Business Strategy', 'Brand Development', 'Presentation & Research'],
    link: { url: 'https://luminex-1.onrender.com/', label: 'View Presentation' },
  },
  {
    id: 'f1',
    title: 'Tata Power Financial Analysis & Corporate Finance Evaluation',
    category: 'Finance & Strategy',
    categoryIcon: '📊',
    color: '#0F766E',
    size: 'bento-standard',
    description:
      'Collaborated on a comprehensive corporate finance analysis of Tata Power Ltd., evaluating financial performance, capital structure, cost of capital, leverage, working capital management, and dividend policy over a five-year period.',
    tags: ['Excel Modeling', 'Corporate Finance', 'WACC', 'CAPM', 'Ratio Analysis'],
    highlights: [
      'Collected and analyzed five years of financial data from Tata Power\'s annual reports.',
      'Performed financial calculations and modeling in Microsoft Excel.',
      'Calculated Cost of Debt (Kd), Cost of Equity (CAPM), and Weighted Average Cost of Capital (WACC).',
      'Evaluated capital structure, leverage, liquidity, and working capital efficiency using financial ratios.',
      'Analyzed Cash Conversion Cycle (CCC), operating leverage, financial leverage, and dividend policy.',
      'Interpreted financial results and presented strategic recommendations based on corporate finance concepts.',
    ],
    tools: ['Microsoft Excel', 'Financial Modeling', 'Corporate Finance', 'Financial Statement Analysis', 'Ratio Analysis', 'CAPM', 'WACC', 'Cost of Debt & Cost of Equity', 'Working Capital Analysis', 'Data Visualization'],
    skills: ['Financial Analysis', 'Financial Modeling', 'Valuation Concepts', 'Excel Modeling', 'Corporate Finance', 'Quantitative Analysis', 'Business Decision Making', 'Financial Reporting'],
  },
  {
    id: 'a1',
    title: 'Car Price Prediction & Statistical Analysis',
    category: 'Analytics & Modeling',
    categoryIcon: '📈',
    color: '#2563EB',
    size: 'bento-standard',
    description:
      'Analyzed a dataset of 205 car models to identify key factors influencing vehicle prices using exploratory data analysis, statistical techniques, and predictive modeling. Developed an interactive dashboard to visualize pricing trends.',
    tags: ['Predictive Modeling', 'Excel ToolPak', 'ANOVA', 'Regression', 'Dashboard'],
    highlights: [
      'Performed Exploratory Data Analysis (EDA) and descriptive statistics.',
      'Conducted correlation analysis to identify major price drivers.',
      'Built a multiple linear regression model for price prediction.',
      'Applied hypothesis testing (One-sample t-test, Paired t-test, ANOVA) and confidence interval analysis.',
      'Designed an interactive dashboard to present insights and business recommendations.',
    ],
    tools: ['Microsoft Excel', 'Excel Data Analysis ToolPak', 'Pivot Tables & Charts', 'Statistical Analysis', 'Dashboard Development'],
    skills: ['Data Analytics', 'Business Analytics', 'Statistical Analysis', 'Predictive Modeling', 'Data Visualization', 'Business Decision Making'],
  },
  {
    id: 'm2',
    title: 'The Skincare Secret – Consumer Behaviour & Market Research',
    category: 'Marketing & Research',
    categoryIcon: '💡',
    color: '#EC4899',
    size: 'bento-tall',
    description:
      'Analyzed consumer preferences, buying behaviour, and brand loyalty in the Indian skincare industry. Conducted primary research involving 199 female consumers, applying statistical and marketing analytics techniques.',
    tags: ['Consumer Behaviour', 'Statistical Research', 'Regression', 'Cluster Analysis'],
    highlights: [
      'Collaborated in designing and executing a primary market research survey.',
      'Contributed to collecting and analyzing data from 199 respondents using quantitative and qualitative methods.',
      'Performed consumer behaviour analysis, brand preference mapping, and purchase pattern analysis.',
      'Applied hypothesis testing, correlation analysis, regression analysis, cross-tabulation, and customer segmentation.',
      'Contributed to developing strategic recommendations for product positioning, pricing, customer retention, and digital marketing.',
    ],
    tools: ['Market Research', 'Consumer Behaviour Analysis', 'Marketing Analytics', 'Statistical Analysis', 'Survey Design (Google Forms)', 'Regression & Correlation Analysis', 'Cluster Analysis', 'Data Visualization', 'Business Strategy'],
    skills: ['Market Research', 'Consumer Behaviour Analysis', 'Marketing Analytics', 'Statistical Analysis', 'Data Visualization', 'Business Strategy'],
  },
]

/* =============================================
   BENTO PROJECT CARD COMPONENT
   ============================================= */

const ProjectCard = ({ project, index, isInView, onClick }) => {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateZ(8px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
    }
  }, [])

  return (
    <motion.div
      className={`bento-item ${project.size || ''}`}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.15 + index * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        ref={cardRef}
        className="bento-card"
        onClick={() => onClick(project)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ '--project-color': project.color }}
      >
        {/* Background glow & subtle accent line */}
        <div className="bento-card__glow" />
        <div className="bento-card__border-accent" />

        {/* Top Header Row */}
        <div className="bento-card__header">
          <span className="bento-card__category-badge">
            <span className="bento-card__cat-icon">{project.categoryIcon}</span>
            {project.category}
          </span>
          {project.featured && (
            <span className="bento-card__featured-pill">Featured</span>
          )}
        </div>


        {/* Card Main Body */}
        <div className="bento-card__body">
          <h3 className="bento-card__title">{project.title}</h3>
          <p className="bento-card__desc">{project.description}</p>
        </div>

        {/* Card Footer: Tags & Action arrow */}
        <div className="bento-card__footer">
          <div className="bento-card__tags">
            {project.tags.slice(0, 4).map((t) => (
              <span key={t} className="bento-card__tag">
                {t}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="bento-card__tag bento-card__tag--more">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          <div className="bento-card__action">
            <span>Explore</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* =============================================
   PROJECT DETAIL LAYER (MODAL)
   ============================================= */

const ProjectDetailLayer = ({ project, onClose }) => {
  const contentRef = useRef(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const checkScroll = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    setCanScrollUp(el.scrollTop > 10)
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 10)
  }, [])

  useEffect(() => {
    const timer = setTimeout(checkScroll, 400)
    return () => clearTimeout(timer)
  }, [project, checkScroll])

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const scrollBy = useCallback((dir) => {
    const el = contentRef.current
    if (!el) return
    el.scrollBy({ top: dir * 220, behavior: 'smooth' })
  }, [])

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {project && (
            <motion.div
              className="proj__overlay proj__overlay--top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
            >
              <motion.div
                className="proj__detail proj__detail--rich"
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 40 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
                style={{ '--project-color': project.color }}
              >
                <button className="proj__detail-close" onClick={onClose} aria-label="Close modal">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* External link — pinned at top */}
                {project.link && (
                  <div className="proj__detail-link-top">
                    <a
                      href={project.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj__detail-link-btn"
                    >
                      <span>{project.link.label}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Scrollable content area */}
                <div
                  className="proj__detail-content"
                  ref={contentRef}
                  onScroll={checkScroll}
                >
                  <div className="proj__detail-header-group">
                    <span className="proj__detail-category">
                      {project.categoryIcon} {project.category}
                    </span>
                    <h3 className="proj__detail-title">{project.title}</h3>
                  </div>

                  <p className="proj__detail-desc">{project.description}</p>

                  {/* Highlights / What I Did */}
                  {project.highlights && (
                    <div className="proj__detail-section">
                      <h4 className="proj__detail-section-title">Key Contributions &amp; Workflow</h4>
                      <ul className="proj__detail-list">
                        {project.highlights.map((item, i) => (
                          <li key={i} className="proj__detail-list-item">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tools & Technologies */}
                  {project.tools && (
                    <div className="proj__detail-section">
                      <h4 className="proj__detail-section-title">Tools &amp; Technologies</h4>
                      <div className="proj__detail-tags">
                        {project.tools.map((t) => (
                          <span key={t} className="proj__detail-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Demonstrated */}
                  {project.skills && (
                    <div className="proj__detail-section">
                      <h4 className="proj__detail-section-title">Skills Demonstrated</h4>
                      <div className="proj__detail-tags">
                        {project.skills.map((s) => (
                          <span key={s} className="proj__detail-tag proj__detail-tag--skill">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Scroll indicators */}
                <button
                  className={`proj__scroll-arrow proj__scroll-arrow--up${canScrollUp ? ' visible' : ''}`}
                  onClick={() => scrollBy(-1)}
                  aria-label="Scroll up"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </button>
                <button
                  className={`proj__scroll-arrow proj__scroll-arrow--down${canScrollDown ? ' visible' : ''}`}
                  onClick={() => scrollBy(1)}
                  aria-label="Scroll down"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

/* =============================================
   MAIN PROJECTS COMPONENT
   ============================================= */

const Projects = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [openProject, setOpenProject] = useState(null)

  const handleCloseProject = useCallback(() => {
    setOpenProject(null)
  }, [])

  return (
    <section id="projects" className="section proj" ref={sectionRef}>
      <div className="container">
        {/* Section header */}
        <motion.div
          className="section-header proj__header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Selected Projects</h2>
          <p className="section-subtitle">
            An interactive showcase of AI automation, financial modeling, GTM strategy, and analytics.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="bento-grid">
          <AnimatePresence mode="popLayout">
            {projectsData.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isInView={isInView}
                onClick={setOpenProject}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailLayer
        project={openProject}
        onClose={handleCloseProject}
      />
    </section>
  )
}

export default Projects
