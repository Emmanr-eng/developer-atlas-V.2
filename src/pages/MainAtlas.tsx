import React, { useEffect } from 'react';
import Home from './Home';
import Portfolio from './Portfolio';
import Lab from './Lab';
import Timeline from './Timeline';
import Blog from './Blog';
import Contact from './Contact';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';

export default function MainAtlas() {
  const location = useLocation();

  useDocumentHead({
    title: '',  // Uses base title "Developer Atlas"
    description: 'Explore projects, experiments, blog posts, and connect. A full-stack developer portal.',
  });

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
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
