import React, { useEffect, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { useLazySection } from '../hooks/useLazySection';
import { SectionSkeleton } from '../components/SectionSkeleton';

const Home = lazy(() => import('./Home'));
const Portfolio = lazy(() => import('./Portfolio'));
const Lab = lazy(() => import('./Lab'));
const Timeline = lazy(() => import('./Timeline'));
const Blog = lazy(() => import('./Blog'));
const Contact = lazy(() => import('./Contact'));

interface LazySectionProps {
  id: string;
  skeletonVariant?: 'grid' | 'list' | 'hero' | 'form';
  label: string;
  children: React.ReactNode;
  className?: string;
}

function LazySection({ id, skeletonVariant = 'grid', label, children, className = '' }: LazySectionProps) {
  const { ref, hasEntered } = useLazySection({ rootMargin: '300px 0px' });

  return (
    <section id={id} className={className} ref={ref}>
      {hasEntered ? (
        <Suspense fallback={<SectionSkeleton variant={skeletonVariant} label={label} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton variant={skeletonVariant} label={label} />
      )}
    </section>
  );
}

export default function MainAtlas() {
  const location = useLocation();

  useDocumentHead({
    title: '',
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
    <div className="space-y-24 pb-24 lg:space-y-28 lg:pb-28">
      <section id="home">
        <Suspense fallback={<SectionSkeleton variant="hero" label="Home" />}>
          <Home />
        </Suspense>
      </section>

      <LazySection id="portfolio" label="Portfolio" skeletonVariant="grid" className="scroll-mt-28">
        <Portfolio />
      </LazySection>

      <LazySection id="lab" label="Lab" skeletonVariant="grid" className="scroll-mt-28">
        <Lab />
      </LazySection>

      <LazySection id="timeline" label="Timeline" skeletonVariant="list" className="scroll-mt-28">
        <Timeline />
      </LazySection>

      <LazySection id="blog" label="Blog" skeletonVariant="list" className="scroll-mt-28">
        <Blog />
      </LazySection>

      <LazySection id="contact" label="Contact" skeletonVariant="form" className="scroll-mt-28">
        <Contact />
      </LazySection>
    </div>
  );
}
