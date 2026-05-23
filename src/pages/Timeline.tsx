import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { BUG_ENTRIES } from '../data/fallbacks';

export default function Timeline() {
  const [searchParams] = useSearchParams();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const bugId = searchParams.get('bug');
    if (bugId && BUG_ENTRIES.some((b) => b.id === bugId)) {
      setExpandedId(bugId);
    }
  }, [searchParams]);

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
          <Bug className="w-3 h-3" />
          <span>Active Debugging Ledger</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic text-slate-900">Bug Timeline Explorer</h1>
        <p className="text-slate-500 max-w-2xl text-sm leading-relaxed font-medium">
          A continuous trace of technical friction: documenting common coding bugs, their internal causes, and the engineering path to resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {BUG_ENTRIES.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "bento-card transition-all duration-500 overflow-hidden",
                isExpanded ? "p-8 md:p-12 ring-2 ring-red-300/40 shadow-[0_16px_48px_rgba(0,0,0,0.06),0_0_30px_rgba(239,68,68,0.06)]" : "p-6 cursor-pointer"
              )}
              id={item.id}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 flex items-center justify-center transition-all duration-500",
                      isExpanded ? "text-red-600" : "text-slate-400"
                    )}
                    style={{
                      background: isExpanded ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                      backdropFilter: 'blur(8px)',
                      border: isExpanded ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0, 0, 0, 0.06)',
                      borderRadius: '16px',
                    }}
                  >
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h2 className={cn(
                    "text-2xl md:text-1xl font-black tracking-tighter uppercase italic transition-colors duration-500",
                    isExpanded ? "text-slate-900" : "text-slate-400"
                  )}>
                    {item.bug}
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "w-6 h-6 text-slate-400 transition-transform duration-500",
                  isExpanded ? "rotate-180 text-red-500" : "rotate-0"
                )} />
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 32 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-black/6">
                      {/* Problem Section */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            The Problem
                          </p>
                          <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                            {item.problem}
                          </p>
                        </div>
                        <div
                          className="p-6 font-mono text-xs text-red-400 leading-relaxed overflow-x-auto"
                          style={{
                            background: 'rgba(15, 23, 42, 0.92)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '20px',
                          }}
                        >
                          <p className="text-[10px] text-neutral-500 mb-2 font-bold uppercase tracking-widest">// Trigger Code</p>
                          <pre><code>{item.problemCode}</code></pre>
                        </div>
                      </div>

                      {/* Solution Section */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" />
                            The Solution
                          </p>
                          <p className="text-lg md:text-xl text-slate-800 font-bold leading-relaxed">
                            {item.solution}
                          </p>
                        </div>
                        <div
                          className="p-6 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto"
                          style={{
                            background: 'rgba(15, 23, 42, 0.88)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            borderRadius: '20px',
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.05)',
                          }}
                        >
                          <p className="text-[10px] text-emerald-500/60 mb-2 font-bold uppercase tracking-widest">// Resolution Logic</p>
                          <pre><code>{item.solutionCode}</code></pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}