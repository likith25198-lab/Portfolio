import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const roles = ['Business Strategist', 'Management Professional', 'Problem Solver']

const Hero = () => {
  const heroRef = useRef(null)
  const greetingRef = useRef(null)
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const bioRef = useRef(null)
  const ctaRef = useRef(null)
  const videoRef = useRef(null)
  const roleIndexRef = useRef(0)
  const [currentRole, setCurrentRole] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 2.8 })

      // 1. Greeting fade in
      tl.fromTo(
        greetingRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.3
      )

      // 2. Name — staggered letter animation
      const nameEl = nameRef.current
      if (nameEl) {
        const text = nameEl.textContent
        nameEl.textContent = ''
        nameEl.style.visibility = 'visible'

        const letters = text.split('').map((char) => {
          const span = document.createElement('span')
          span.textContent = char === ' ' ? '\u00A0' : char
          span.className = 'hero__letter'
          span.style.display = 'inline-block'
          span.style.opacity = '0'
          span.style.transform = 'translateY(40px)'
          nameEl.appendChild(span)
          return span
        })

        tl.to(
          letters,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power3.out',
          },
          0.6
        )
      }

      // 3. Bio fade in
      tl.fromTo(
        bioRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      )

      // 4. CTA button
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )

      // 5. Video fade in
      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
        0.5
      )

      // 6. Parallax on scroll
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        opacity: 0.3,
        y: -60,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Typewriter effect using GSAP
  useEffect(() => {
    let typewriterTl
    let isMounted = true

    const typeRole = () => {
      if (!isMounted) return

      const role = roles[roleIndexRef.current]
      const chars = role.split('')
      let displayed = ''

      // Typing phase
      typewriterTl = gsap.timeline({
        onComplete: () => {
          if (!isMounted) return
          // Pause at full text, then delete
          gsap.delayedCall(2, () => {
            if (!isMounted) return
            deleteRole(role)
          })
        },
      })

      chars.forEach((char, i) => {
        typewriterTl.to(
          {},
          {
            duration: 0.06,
            onComplete: () => {
              displayed += char
              setCurrentRole(displayed)
            },
          },
          i * 0.06
        )
      })
    }

    const deleteRole = (role) => {
      if (!isMounted) return
      let remaining = role

      const deleteTl = gsap.timeline({
        onComplete: () => {
          if (!isMounted) return
          roleIndexRef.current = (roleIndexRef.current + 1) % roles.length
          gsap.delayedCall(0.3, typeRole)
        },
      })

      for (let i = role.length; i >= 0; i--) {
        const text = remaining.slice(0, i)
        deleteTl.to(
          {},
          {
            duration: 0.03,
            onComplete: () => setCurrentRole(text),
          }
        )
      }
    }

    // Start after initial animations
    const startDelay = gsap.delayedCall(5.0, typeRole)

    return () => {
      isMounted = false
      startDelay.kill()
      if (typewriterTl) typewriterTl.kill()
      gsap.killTweensOf({})
    }
  }, [])

  const handleDownloadResume = useCallback((e) => {
    e.preventDefault()
    fetch('/resume.pdf')
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
        const a = document.createElement('a')
        a.href = url
        a.download = 'Likith_Yadav_S_Resume.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      })
      .catch(() => {
        window.open('/resume.pdf', '_blank')
      })
  }, [])

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="container hero__container">
        {/* Left Column — Text */}
        <div className="hero__text">
          <span className="hero__greeting" ref={greetingRef}>
            Welcome to my portfolio
          </span>

          <h1 className="hero__name" ref={nameRef}>
            Likith Yadav
          </h1>

          <div className="hero__role-wrapper">
            <span className="hero__role" ref={roleRef}>
              {currentRole}
              <span className="hero__cursor">|</span>
            </span>
          </div>

          <p className="hero__bio" ref={bioRef}>
            Turning complex challenges into elegant solutions through strategic thinking and innovation.
          </p>

          <div className="hero__cta" ref={ctaRef}>
            <a
              href="/resume.pdf"
              download="Likith_Yadav_S_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadResume}
              className="hero__btn"
            >
              Download My Resume
              <svg className="hero__btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column — Video */}
        <div className="hero__video-wrapper" ref={videoRef}>
          <video
            className="hero__video"
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  )
}

export default Hero
