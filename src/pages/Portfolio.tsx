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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.3)]"></div>
    </div>
  );

  return (
    <div className="space-y-12 h-full pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Architectural Map Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white leading-none">Service Directory</h1>
          <p className="text-neutral-500 max-w-2xl text-sm leading-relaxed font-medium">
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
                "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                filter === cat
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "text-neutral-500 hover:text-white"
              )}
              style={{
                background: filter === cat ? undefined : 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                border: filter === cat ? '2px solid rgba(16,185,129,0.6)' : '2px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search Atlas Nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 glass-input text-xs font-bold placeholder:text-neutral-700 uppercase tracking-widest outline-none focus:border-emerald-500/50"
            style={{ borderRadius: '20px' }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => navigate(project.actionUrl || project.demoUrl || '#')}
              className="bento-card p-0! overflow-hidden flex flex-col group relative cursor-pointer"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-black">
                {project.imageUrl && (
                   <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                   />
                )}
                
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <div className={cn(
                     "px-3 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md",
                     project.status === 'Online' && "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
                     project.status === 'Experimental' && "bg-amber-500/20 border-amber-500/30 text-amber-400",
                     project.status === 'Approved Architecture' && "bg-blue-500/20 border-blue-500/30 text-blue-400",
                     project.status === 'Deprecated' && "bg-red-500/20 border-red-500/30 text-red-400",
                     project.status === 'Stable' && "bg-neutral-500/20 border-neutral-500/30 text-neutral-400"
                   )}
                   style={{ borderRadius: '10px', border: '1px solid' }}
                   >
                     {project.status}
                   </div>
                </div>

                <div className="absolute bottom-6 left-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  {project.category}
                </div>
              </div>
              
              <div
                className="p-10 flex flex-col grow"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <h3 className="text-2xl font-black tracking-tighter mb-4 text-white uppercase italic group-hover:text-emerald-500 transition-colors leading-none">
                  {project.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium mb-10 grow text-balance">
                  {project.description}
                </p>
                
                <div className="pt-8 border-t border-white/6 flex justify-between items-center mt-auto">
                   <div className="flex items-center gap-3 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors group/link">
                     {project.actionLabel || 'Deploy Node'}
                     <ExternalLink className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                   </div>

                   {project.codeSnippet && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         navigator.clipboard.writeText(project.codeSnippet);
                       }}
                       className="p-3 glass-btn text-neutral-500 hover:bg-emerald-500 hover:text-black transition-all"
                       style={{ borderRadius: '16px' }}
                       title="Copy Code Primitives"
                     >
                       <Code className="w-4 h-4" />
                     </button>
                   )}
                </div>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-10 group-hover:opacity-40 transition-opacity">
                 <div className="absolute top-4 right-4 w-12 h-px bg-white rotate-45" />
                 <div className="absolute top-4 right-4 w-px h-12 bg-white rotate-45" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div
            className="text-center py-20 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(24px)',
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '28px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            <Layers className="w-16 h-16 text-emerald-500/20 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">No Architectural Nodes Found</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8 font-medium">Your query did not return any direct matches. Try cross-referencing our technical insights or bug ledger entries.</p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/blog" className="bg-emerald-500 text-black px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.2)]" style={{ borderRadius: '16px' }}>
                Check Insights
              </Link>
              <Link to="/timeline" className="text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] glass-btn hover:border-emerald-500/30 transition-all" style={{ borderRadius: '16px' }}>
                View Ledger
              </Link>
            </div>
          </div>
          
          <div className="text-center">
             <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-4">System Suggestions</p>
             <div className="flex justify-center gap-2 flex-wrap">
                {['React', 'TypeScript', 'Node.js', 'Infrastructure', 'Telemetry'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="px-6 py-2 rounded-full text-[10px] font-black text-neutral-500 hover:text-emerald-500 glass-btn hover:border-emerald-500/30 transition-all"
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