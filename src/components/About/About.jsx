import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './About.css';

const images = [
  "/p1.jpeg",
  "/P3.jpeg",
  "/P2.jpeg",
  "/M1.jpeg",
  "/M2.jpeg",
  "/M3.jpeg",
  "/M4.jpeg",
  "/M5.jpeg",
  "/M6.jpeg",
  "/M7.jpeg"
];

const About = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="about" className="section about">
      <div className="container about__container">

        {/* Brief Text Above */}
        <motion.div
          className="about__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="section-label">About Me</span>
          <h2 className="section-title">Learning Today. Leading Tomorrow.</h2>
          <p className="about__brief-text">
            Hi there! I'm a final-year MBA student at SDMIMD, with a background in Engineering. My core interests lie in Finance and Marketing. I enjoy blending analytical thinking with strategic ideas to drive meaningful business outcomes.
            <br /><br />
            I'm a fast learner who stays curious and up-to-date with emerging technologies. I adapt quickly to new environments and bring strong analytical skills to every challenge I take on.
            <br /><br />
            As I wrap up my MBA, I'm excited to step into a corporate role where I can put my skills to work and keep growing every day.
          </p>
        </motion.div>

        {/* L-Shape Animated Track */}
        <div className="about__path-container">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Moving gallery ${index + 1}`}
              className="about__moving-image"
              // Dynamically distribute any number of images across the 60-second animation duration
              style={{ animationDelay: `${(index * -(60 / images.length)).toFixed(2)}s` }}
              onClick={() => setSelectedImage(src)}
            />
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="about__lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="about__lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </button>
              <motion.img
                src={selectedImage}
                alt="Enlarged gallery view"
                className="about__lightbox-image"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default About;
