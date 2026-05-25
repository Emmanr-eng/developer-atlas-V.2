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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="pixel-heading text-[10px] text-arcade-cyan coin-blink">LOADING NODES...</div>
    </div>
  );

  return (
    <div className="space-y-12 h-full pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-arcade-cyan/10 border border-arcade-cyan/20">
            <span className="w-1.5 h-1.5 rounded-full bg-arcade-cyan coin-blink" />
            <span className="text-[8px] font-mono font-bold text-arcade-cyan uppercase tracking-widest">Architectural Map Active</span>
          </div>
          <h1 className="pixel-heading text-xl md:text-2xl neon-cyan leading-relaxed">SERVICE DIRECTORY</h1>
          <p className="text-[#2a2a4a] max-w-2xl text-xs leading-relaxed font-mono">
            A centralized mapping protocol for technical modules, production services, and foundational blueprints within the Atlas grid.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2.5 rounded-lg text-[8px] font-mono font-bold uppercase tracking-widest transition-all border-2",
                filter === cat
                  ? "bg-arcade-cyan border-arcade-cyan text-[#0a0a12] shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  : "bg-[#0a0a12] border-[#2a2a4a] text-[#2a2a4a] hover:text-arcade-cyan hover:border-arcade-cyan/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2a2a4a] group-focus-within:text-arcade-cyan transition-colors" />
          <input
            type="text"
            placeholder="Search Atlas Nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:outline-none focus:border-arcade-cyan/50 transition-all text-xs font-mono font-bold placeholder:text-[#2a2a4a]/50 text-arcade-cyan"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => navigate(project.actionUrl || project.demoUrl || '#')}
              className="bento-card p-0! overflow-hidden flex flex-col group bg-[#12121f] border-[#2a2a4a] relative cursor-pointer hover:border-arcade-cyan/40"
              style={{ transition: 'box-shadow 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div className="relative aspect-16/10 overflow-hidden bg-[#0a0a12]">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-30 group-hover:opacity-50 grayscale"
                    referrerPolicy="no-referrer"
                  />
                )}
                {/* Scanline overlay on image */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#12121f]" />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className={cn(
                    "px-2.5 py-1 rounded text-[7px] font-mono font-bold uppercase tracking-widest border",
                    project.status === 'Online' && "bg-arcade-green/10 border-arcade-green/30 text-arcade-green",
                    project.status === 'Experimental' && "bg-arcade-yellow/10 border-arcade-yellow/30 text-arcade-yellow",
                    project.status === 'Approved Architecture' && "bg-arcade-blue/10 border-arcade-blue/30 text-arcade-blue",
                    project.status === 'Deprecated' && "bg-arcade-red/10 border-arcade-red/30 text-arcade-red",
                    project.status === 'Stable' && "bg-[#2a2a4a]/30 border-[#2a2a4a] text-[#2a2a4a]"
                  )}>
                    {project.status}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 text-[7px] font-mono font-bold uppercase tracking-[0.3em] text-white/30">
                  {project.category}
                </div>
              </div>

              <div className="p-8 flex flex-col grow">
                <h3 className="pixel-heading text-[10px] mb-4 text-white group-hover:text-arcade-cyan transition-colors leading-relaxed">
                  {project.title}
                </h3>
                <p className="text-xs text-[#2a2a4a] leading-relaxed font-mono mb-8 grow">
                  {project.description}
                </p>

                <div className="pt-6 border-t border-[#2a2a4a]/30 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2 text-arcade-cyan text-[8px] font-mono font-bold uppercase tracking-widest hover:text-arcade-magenta transition-colors group/link">
                    {project.actionLabel || 'Deploy Node'}
                    <ExternalLink className="w-3 h-3 transform group-hover/link:translate-x-1 transition-transform" />
                  </div>

                  {project.codeSnippet && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(project.codeSnippet);
                      }}
                      className="p-2.5 rounded-lg bg-[#0a0a12] hover:bg-arcade-cyan text-[#2a2a4a] hover:text-[#0a0a12] transition-all border border-[#2a2a4a]/30"
                      title="Copy Code Primitives"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center py-20 bg-[#12121f] border-2 border-dashed border-[#2a2a4a] rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-arcade-cyan/5 to-transparent pointer-events-none" />
            <Layers className="w-16 h-16 text-arcade-cyan/20 mx-auto mb-6 coin-blink" />
            <h3 className="pixel-heading text-sm text-white mb-4 leading-relaxed">NO NODES FOUND</h3>
            <p className="text-[#2a2a4a] text-xs max-w-md mx-auto mb-8 font-mono">Your query did not return any direct matches. Try cross-referencing.</p>

            <div className="flex gap-4 justify-center">
              <Link to="/blog" className="arcade-btn bg-arcade-cyan border-[#0099aa] text-[#0a0a12] text-[8px]">
                Check Insights
              </Link>
              <Link to="/timeline" className="arcade-btn bg-[#0a0a12] border-[#2a2a4a] text-arcade-cyan hover:border-arcade-cyan text-[8px]">
                View Ledger
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="pixel-heading text-[7px] text-[#2a2a4a] mb-4 leading-relaxed">SYSTEM SUGGESTIONS</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {['React', 'TypeScript', 'Node.js', 'Infrastructure', 'Telemetry'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="px-4 py-2 rounded-lg border border-[#2a2a4a] bg-[#0a0a12] text-[8px] font-mono font-bold text-[#2a2a4a] hover:text-arcade-cyan hover:border-arcade-cyan/30 transition-all"
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