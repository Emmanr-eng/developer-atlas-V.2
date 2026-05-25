import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Code, Filter, Search, Layers, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface Project {
  id: string;
  title: string;
  description: string;
  codeSnippet: string;
  demoUrl: string;
  imageUrl: string;
  category: string;
  status: 'Stable' | 'Experimental' | 'Deprecated' | 'Online' | 'Approved Architecture';
  actionLabel?: string;
  actionUrl?: string;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fallbackProjects: Project[] = [
    {
      id: 'spotlight-masking',
      title: 'SpotlightMasking-v1.0',
      description: 'Technical module for dynamic SVG clip-path reveals. High-performance masking primitive for interactive stages.',
      codeSnippet: 'clip-path: circle(80px at ${pos.x}px ${pos.y}px)',
      demoUrl: '/lab?exp=fluid-spotlight',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      category: 'Technical Modules',
      status: 'Experimental',
      actionLabel: 'View in Lab',
      actionUrl: '/lab?exp=fluid-spotlight'
    },
    {
      id: 'haptic-glow',
      title: 'HapticGlow-Lib',
      description: 'Universal glow trace library for cursor proximity tracking. Optimized for high-frequency DOM updates.',
      codeSnippet: 'background: radial-gradient(400px circle at ${pos.x}px ${pos.y}px, ...)',
      demoUrl: '/lab?exp=haptic-glow',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      category: 'Technical Modules',
      status: 'Experimental',
      actionLabel: 'View in Lab',
      actionUrl: '/lab?exp=haptic-glow'
    },
    {
      id: 'magnetic-impulse',
      title: 'MagneticImpulse-Primitive',
      description: 'Zero-gravity navigation component with integrated spring physics and proximity warping.',
      codeSnippet: 'animate={{ x: pos.x * 0.35, y: pos.y * 0.35 }}',
      demoUrl: '/lab?exp=magnetic-button',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      category: 'Technical Modules',
      status: 'Experimental',
      actionLabel: 'View in Lab',
      actionUrl: '/lab?exp=magnetic-button'
    },
    {
      id: 'standardized-rendering',
      title: 'Standardized-Rendering-Pattern',
      description: 'Refined architectural blueprint to prevent infinite re-render loops in complex dashboard states.',
      codeSnippet: 'useEffect(() => { ... }, [primitiveDependency])',
      demoUrl: '/timeline?bug=infinite-loop',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800',
      category: 'Foundational Blueprints',
      status: 'Approved Architecture',
      actionLabel: 'Check Timeline',
      actionUrl: '/timeline?bug=infinite-loop'
    },
    {
      id: 'atomic-state',
      title: 'Atomic-State-Management',
      description: 'Validated pattern for handling stale closures in multi-threaded React environments. Derived from Bug ID #1024.',
      codeSnippet: 'setState(prev => ({ ...prev, updated: true }))',
      demoUrl: '/blog/outbox-pattern',
      imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
      category: 'Foundational Blueprints',
      status: 'Approved Architecture',
      actionLabel: 'Read Insight',
      actionUrl: '/blog/outbox-pattern'
    },
    {
      id: 'atlas-core',
      title: 'Atlas-Core-API',
      description: 'Centralized telemetry and data orchestration layer. Manages real-time sync across all portal nodes.',
      codeSnippet: 'const atlas = initializeAtlas({ environment: "production" })',
      demoUrl: '/',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800',
      category: 'Production Services',
      status: 'Online',
      actionLabel: 'See in Terminal',
      actionUrl: '/'
    },
    {
      id: 'terminal-v3-service',
      title: 'Terminal-V3-Service',
      description: 'Advanced CLI interface for system-wide command execution and sub-node synchronization.',
      codeSnippet: 'terminal.execute("--query-insights react")',
      demoUrl: '/',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800',
      category: 'Production Services',
      status: 'Online',
      actionLabel: 'Open Console',
      actionUrl: '/'
    },
    {
      id: 'insights-engine',
      title: 'Insights-Engine',
      description: 'Vector-indexed search and content bridge for technical architectural nodes and engineering logic.',
      codeSnippet: 'insights.query("react-server-components")',
      demoUrl: '/blog',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
      category: 'Production Services',
      status: 'Online',
      actionLabel: 'Browse Insights',
      actionUrl: '/blog'
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      if (!db) {
        setProjects(fallbackProjects);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

        if (fetched.length > 0) {
          setProjects(fetched);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const isReactRelated = search.toLowerCase() === 'react' &&
                          (p.title + p.description + p.category).toLowerCase().match(/ui|module|state|rendering|service/);
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase()) ||
                          isReactRelated;
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" />
        Loading projects
      </div>
    </div>
  );

  return (
    <div className="h-full space-y-12 pb-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-4">
          <div className="section-kicker">Portfolio</div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">Selected systems, experiments, and production-facing product work.</h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Browse technical modules, foundational blueprints, and product services organized for quick scanning and deeper review.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'rounded-full border px-4 py-2.5 text-sm font-medium transition-all',
                filter === cat
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400" />
          <input
            type="text"
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => navigate(project.actionUrl || project.demoUrl || '#')}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:shadow-black/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/30 to-transparent" />

                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <div className={cn(
                    'rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur',
                    project.status === 'Online' && 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
                    project.status === 'Experimental' && 'border-amber-400/20 bg-amber-400/10 text-amber-200',
                    project.status === 'Approved Architecture' && 'border-blue-400/20 bg-blue-400/10 text-blue-200',
                    project.status === 'Deprecated' && 'border-red-400/20 bg-red-400/10 text-red-200',
                    project.status === 'Stable' && 'border-white/15 bg-white/10 text-slate-200'
                  )}>
                    {project.status}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {project.category}
                </div>
              </div>

              <div className="flex grow flex-col p-7">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                  {project.title}
                </h3>
                <p className="mt-4 grow text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-500 dark:text-blue-300">
                    {project.actionLabel || 'Deploy Node'}
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>

                  {project.codeSnippet && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(project.codeSnippet);
                      }}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                      title="Copy Code Primitives"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/90 px-6 py-20 text-center shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900/90">
            <Layers className="mx-auto mb-6 h-14 w-14 text-slate-300 dark:text-slate-600" />
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">No matching projects found</h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">Try a broader category or search term to discover more of the atlas.</p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/blog" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500">
                Check insights
              </Link>
              <Link to="/timeline" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                View ledger
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Suggested searches</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['React', 'TypeScript', 'Node.js', 'Infrastructure', 'Telemetry'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:text-blue-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
