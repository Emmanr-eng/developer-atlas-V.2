import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Code, Filter, Search, Layers, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery';
import { useDebounce } from '../hooks/useDebounce';
import { useClipboard } from '../hooks/useClipboard';
import { fetchProjects } from '../services/firestore';
import { filterProjects, getCategories } from '../utils/search';
import { FALLBACK_PROJECTS } from '../data/fallbacks';
import type { Project } from '../types';

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const navigate = useNavigate();
  const { copy } = useClipboard();

  const queryFn = useCallback(() => fetchProjects<Project>(), []);

  const { data: projects, loading } = useFirestoreQuery<Project>({
    queryFn,
    fallbackData: FALLBACK_PROJECTS,
    errorContext: 'projects',
  });

  const categories = useMemo(() => getCategories(projects), [projects]);

  const filteredProjects = useMemo(
    () => filterProjects(projects, filter, debouncedSearch),
    [projects, filter, debouncedSearch],
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 shadow-[0_0_16px_rgba(16,185,129,0.2)]"></div>
    </div>
  );

  return (
    <div className="space-y-12 h-full pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Architectural Map Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Service Directory</h1>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed font-medium">
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
                  ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : "text-slate-500 hover:text-slate-900"
              )}
              style={{
                background: filter === cat ? undefined : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(8px)',
                border: filter === cat ? '2px solid rgba(16,185,129,0.6)' : '2px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            placeholder="Search Atlas Nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 glass-input text-xs font-bold placeholder:text-slate-400 uppercase tracking-widest outline-none focus:border-emerald-500/50"
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
                    loading="lazy"
                   />
                )}
                
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <div className={cn(
                     "px-3 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md",
                     project.status === 'Online' && "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
                     project.status === 'Experimental' && "bg-amber-500/20 border-amber-500/30 text-amber-300",
                     project.status === 'Approved Architecture' && "bg-blue-500/20 border-blue-500/30 text-blue-300",
                     project.status === 'Deprecated' && "bg-red-500/20 border-red-500/30 text-red-300",
                     project.status === 'Stable' && "bg-neutral-500/20 border-neutral-500/30 text-neutral-300"
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
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <h3 className="text-2xl font-black tracking-tighter mb-4 text-slate-900 uppercase italic group-hover:text-emerald-600 transition-colors leading-none">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-10 grow text-balance">
                  {project.description}
                </p>
                
                <div className="pt-8 border-t border-black/6 flex justify-between items-center mt-auto">
                   <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-900 transition-colors group/link">
                     {project.actionLabel || 'Deploy Node'}
                     <ExternalLink className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                   </div>

                   {project.codeSnippet && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         copy(project.codeSnippet);
                       }}
                       className="p-3 glass-btn text-slate-400 hover:bg-emerald-600 hover:text-white transition-all"
                       style={{ borderRadius: '16px' }}
                       title="Copy Code Primitives"
                     >
                       <Code className="w-4 h-4" />
                     </button>
                   )}
                </div>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity">
                 <div className="absolute top-4 right-4 w-12 h-px bg-slate-900 rotate-45" />
                 <div className="absolute top-4 right-4 w-px h-12 bg-slate-900 rotate-45" />
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
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(24px)',
              border: '2px dashed rgba(0, 0, 0, 0.08)',
              borderRadius: '28px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-emerald-500/8 to-transparent pointer-events-none" />
            <Layers className="w-16 h-16 text-emerald-600/20 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-4">No Architectural Nodes Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 font-medium">Your query did not return any direct matches. Try cross-referencing our technical insights or bug ledger entries.</p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/blog" className="bg-emerald-600 text-white px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.15)]" style={{ borderRadius: '20px' }}>
                Check Insights
              </Link>
              <Link to="/timeline" className="text-slate-900 px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] glass-btn hover:border-emerald-600/30 transition-all" style={{ borderRadius: '20px' }}>
                View Ledger
              </Link>
            </div>
          </div>
          
          <div className="text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">System Suggestions</p>
             <div className="flex justify-center gap-2 flex-wrap">
                {['React', 'TypeScript', 'Node.js', 'Infrastructure', 'Telemetry'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="px-6 py-2 rounded-full text-[10px] font-black text-slate-500 hover:text-emerald-600 glass-btn hover:border-emerald-600/30 transition-all"
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