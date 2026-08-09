import { useLenis } from './hooks/useLenis'
import ParticleBackground from './components/ParticleBackground/ParticleBackground'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Education from './components/Education/Education'
import Experience from './components/Experience/Experience'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact/Contact'

function App() {
  // Initialize Lenis smooth scrolling globally
  useLenis()

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <div className="app">
        <Hero />
        <About />
        <Education />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </>
  )
}

export default App

