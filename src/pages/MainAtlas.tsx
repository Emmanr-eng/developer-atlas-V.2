import React, { useEffect } from 'react';
import Home from './Home';
import Portfolio from './Portfolio';
import Lab from './Lab';
import Timeline from './Timeline';
import Blog from './Blog';
import Contact from './Contact';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function MainAtlas() {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to it
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Wait a bit for components to mount/data to load
    }
  }, [location.hash]);

  return (
    <div className="space-y-32 pb-32">
      <section id="home">
        <Home />
      </section>
      
      <section id="portfolio" className="scroll-mt-24">
        <Portfolio />
      </section>
      
      <section id="lab" className="scroll-mt-24">
        <Lab />
      </section>
      
      <section id="timeline" className="scroll-mt-24">
        <Timeline />
      </section>
      
      <section id="blog" className="scroll-mt-24">
        <Blog />
      </section>
      
      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>
    </div>
  );
}
