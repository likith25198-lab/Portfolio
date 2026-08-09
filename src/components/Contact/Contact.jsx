import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import './Contact.css'

/* =============================================
   INTERACTIVE FLOATING PARTICLES
   Mouse-reactive ambient dots
   ============================================= */

const PARTICLE_COUNT = 35

const InteractiveParticles = () => {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Seed particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 3 + 1.5,
          opacity: Math.random() * 0.3 + 0.08,
        })
      }
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particlesRef.current.forEach((p) => {
        // Gentle mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.8
          p.vx += (dx / dist) * force * 0.15
          p.vy += (dy / dist) * force * 0.15
        }

        // Damping
        p.vx *= 0.985
        p.vy *= 0.985

        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(27, 42, 74, ${p.opacity})`
        ctx.fill()
      })

      // Draw connection lines between close particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i]
          const b = particlesRef.current[j]
          const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(27, 42, 74, ${0.06 * (1 - d / 100)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    canvas.addEventListener('mousemove', handleMouse)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="contact__particles" />
}

/* =============================================
   CONTACT FORM  (EmailJS)
   ============================================= */

// 🔑 EmailJS Configuration
// 1. Create a free account at https://www.emailjs.com/
// 2. Add an Email Service (Gmail) -> get your SERVICE_ID
// 3. Create an Email Template -> get your TEMPLATE_ID
// 4. Get your Public Key under Account Settings -> PUBLIC_KEY
const EMAILJS_SERVICE_ID = 'service_9bgew2d'
const EMAILJS_TEMPLATE_ID = 'template_kwmfrp3'
const EMAILJS_PUBLIC_KEY = '7RF-7uGjFDgItNGs7'

const ContactForm = ({ isInView }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setStatus('sending')

      try {
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: 'likithyadav123ab@gmail.com',
          },
          EMAILJS_PUBLIC_KEY
        )

        if (result.status === 200 || result.text === 'OK') {
          setStatus('success')
          setFormData({ name: '', email: '', message: '' })
          setTimeout(() => setStatus('idle'), 4000)
        } else {
          setStatus('error')
          setTimeout(() => setStatus('idle'), 4000)
        }
      } catch (err) {
        console.error('EmailJS submit error:', err)
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
      }
    },
    [formData],
  )

  return (
    <motion.form
      className="contact__form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.35, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h3 className="contact__form-title">Send Me a Message</h3>

      <div className="contact__field">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="contact__input"
        />
      </div>

      <div className="contact__field">
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="contact__input"
        />
      </div>

      <div className="contact__field">
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="contact__input contact__textarea"
        />
      </div>

      <button
        type="submit"
        className={`contact__submit ${status === 'sending' ? 'contact__submit--sending' : ''}`}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? (
          <span className="contact__spinner" />
        ) : status === 'success' ? (
          '✓ Message Sent!'
        ) : status === 'error' ? (
          'Something went wrong'
        ) : (
          'Send Message'
        )}
      </button>

      <AnimatePresence>
        {status === 'success' && (
          <motion.p
            className="contact__status contact__status--success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Thanks! I'll get back to you soon.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            className="contact__status contact__status--error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Oops — please try again or email me directly.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

/* =============================================
   MAIN COMPONENT
   ============================================= */

const Contact = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="section section--cream contact" ref={sectionRef}>
      {/* Interactive particle background */}
      <InteractiveParticles />

      <div className="container contact__container">
        {/* Left — Info */}
        <motion.div
          className="contact__content"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="section-label">Contact</span>
          <h2 className="contact__title">Let's Work Together</h2>
          <p className="contact__subtitle">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>

          <div className="contact__links">
            <a href="mailto:likithyadav123ab@gmail.com" className="contact__link">
              <span className="contact__link-label">Email</span>
              <span className="contact__link-value">likithyadav123ab@gmail.com</span>
            </a>
            <a href="https://www.linkedin.com/in/likith-yadav-s" target="_blank" rel="noopener noreferrer" className="contact__link">
              <span className="contact__link-label">LinkedIn</span>
              <span className="contact__link-value">linkedin.com/in/likith-yadav-s</span>
            </a>
          </div>
        </motion.div>

        {/* Right — Message Form */}
        <ContactForm isInView={isInView} />

        {/* Footer */}
        <motion.footer
          className="contact__footer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="divider" style={{ marginBottom: 'var(--space-xl)', width: '100%' }} />
          <p className="contact__copyright">
            © {new Date().getFullYear()} Likith S. Built with React, GSAP & Three.js.
          </p>
        </motion.footer>
      </div>
    </section>
  )
}

export default Contact
