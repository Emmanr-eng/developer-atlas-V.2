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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300"></div>
    </div>
  );

  return (
    <div className="space-y-10 h-full pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Active</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Service Directory</h1>
          <p className="text-neutral-500 max-w-2xl text-sm leading-relaxed">
            A centralized mapping protocol for technical modules, production services, and foundational blueprints within the Atlas grid.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium transition-all border",
                filter === cat
                  ? "bg-neutral-900 border-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors text-sm placeholder:text-neutral-300"
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={() => navigate(project.actionUrl || project.demoUrl || '#')}
              className="border border-neutral-200 rounded-xl overflow-hidden flex flex-col group relative cursor-pointer hover:border-neutral-300 transition-colors bg-white"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                {project.imageUrl && (
                   <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                   />
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                   <div className={cn(
                     "px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider border backdrop-blur-sm",
                     project.status === 'Online' && "bg-emerald-50/90 border-emerald-200 text-emerald-700",
                     project.status === 'Experimental' && "bg-amber-50/90 border-amber-200 text-amber-700",
                     project.status === 'Approved Architecture' && "bg-blue-50/90 border-blue-200 text-blue-700",
                     project.status === 'Deprecated' && "bg-red-50/90 border-red-200 text-red-700",
                     project.status === 'Stable' && "bg-neutral-50/90 border-neutral-200 text-neutral-600"
                   )}>
                     {project.status}
                   </div>
                </div>

                <div className="absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-wider text-white/80 drop-shadow-md">
                  {project.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col grow">
                <h3 className="text-lg font-semibold tracking-tight mb-3 text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6 grow">
                  {project.description}
                </p>
                
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center mt-auto">
                   <div className="flex items-center gap-2 text-neutral-900 text-xs font-medium hover:text-neutral-600 transition-colors group/link">
                     {project.actionLabel || 'Deploy Node'}
                     <ExternalLink className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform" />
                   </div>

                   {project.codeSnippet && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         navigator.clipboard.writeText(project.codeSnippet);
                       }}
                       className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                       title="Copy Code"
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
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center py-16 border border-dashed border-neutral-200 rounded-xl relative">
            <Layers className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Nodes Found</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">Your query did not return any direct matches. Try a different search term.</p>
            
            <div className="flex gap-3 justify-center">
              <Link to="/blog" className="bg-neutral-900 text-white px-6 py-2.5 rounded-lg font-medium text-xs hover:bg-neutral-800 transition-colors">
                Check Insights
              </Link>
              <Link to="/timeline" className="border border-neutral-200 px-6 py-2.5 rounded-lg text-neutral-600 font-medium text-xs hover:border-neutral-300 transition-colors">
                View Ledger
              </Link>
            </div>
          </div>
          
          <div className="text-center">
             <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest mb-4">Suggestions</p>
             <div className="flex justify-center gap-2 flex-wrap">
                {['React', 'TypeScript', 'Node.js', 'Infrastructure', 'Telemetry'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-colors"
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
