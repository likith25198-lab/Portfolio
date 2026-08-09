import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Skills.css'

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'GSAP', 'Framer Motion', 'Three.js'],
  },
  {
    title: 'Design',
    skills: ['Figma', 'Adobe XD', 'UI/UX Design', 'Responsive Design', 'Prototyping'],
  },
  {
    title: 'Backend & Tools',
    skills: ['Node.js', 'Python', 'Git', 'MongoDB', 'REST APIs', 'Firebase'],
  },
  {
    title: 'Soft Skills',
    skills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Project Management'],
  },
]

const Skills = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="skills" className="section section--grey skills" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Skills</span>
          <h2 className="section-title">Tools & Technologies</h2>
          <p className="section-subtitle">
            The technologies and tools I use to bring ideas to life.
          </p>
        </motion.div>

        <div className="skills__grid">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              className="skills__category"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: catIndex * 0.15,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <h3 className="skills__category-title">{category.title}</h3>
              <div className="skills__list">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    className="skills__pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      delay: catIndex * 0.15 + skillIndex * 0.05,
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
