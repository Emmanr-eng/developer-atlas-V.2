import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Code, BookOpen, Layers, Laptop, Zap, Globe, Github, Terminal, Cloud } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const features = [
    { name: 'TypeScript', icon: Code },
    { name: 'React', icon: Laptop },
    { name: 'Node.js', icon: Globe },
    { name: 'Firestore', icon: Zap },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-4 grow">
        
        {/* The Map Concept */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe className="w-32 h-32 rotate-12 text-slate-900" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter leading-[0.9] uppercase italic text-slate-900">
            Synchronizing the <br/> Architectural <span className="text-emerald-600 font-serif italic">Substrate.</span>
          </h1>
          <p className="text-slate-500 max-w-md text-sm md:text-base leading-relaxed font-medium">
            Atlas_Terminal v3.0 is now active. Real-time synchronization of Physical Playground Primitives, Technical Friction Ledgers, and universal Architectural Nodes.
          </p>
        </motion.div>

        {/* Central Directory / Ecosystem */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 md:row-span-2 bento-card flex flex-col"
        >
          <div
            className="aspect-square mb-6 flex items-center justify-center p-4"
            style={{
              background: 'linear-gradient(to bottom right, rgba(99,102,241,0.8), rgba(16,185,129,0.8))',
              borderRadius: '20px',
            }}
          >
            <div className="text-white font-black text-4xl text-center leading-none tracking-tighter">CORE<br/>ECO</div>
          </div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Service Directory</h3>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 uppercase backdrop-blur-sm">Map</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-6">
            A comprehensive catalog of Technical Modules, Production Services, and Foundational Blueprints.
          </p>
          <div className="mt-auto">
            <button 
              onClick={() => {
                const el = document.getElementById('portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 flex items-center gap-2"
            >
              Explore Ecosystem <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Technical Guidance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between"
        >
          <h4 className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-4">Atlas Guides</h4>
          <div className="space-y-3">
             {[
               { icon: BookOpen, label: "Architectural Nodes" },
               { icon: Terminal, label: "Physical Primitives" },
               { icon: Layers, label: "Friction Ledger" }
             ].map((f, i) => (
               <div
                 key={i}
                 className="flex items-center gap-3 p-2"
                 style={{
                   background: 'rgba(0, 0, 0, 0.02)',
                   backdropFilter: 'blur(8px)',
                   border: '1px solid rgba(0, 0, 0, 0.05)',
                   borderRadius: '16px',
                 }}
               >
                  <f.icon className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{f.label}</span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Terminal Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 md:row-span-2 flex flex-col font-mono shadow-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '28px',
            padding: '2rem',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15), 0 0 30px rgba(16, 185, 129, 0.05)',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">Atlas_Terminal / v3.0</h2>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>
          
          <div className="grow flex flex-col">
            <div
              className="min-h-40 flex flex-col text-xs leading-relaxed relative overflow-hidden p-5"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
              }}
            >
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Terminal className="w-24 h-24 text-white" />
               </div>
               <div className="mb-4 space-y-1 text-neutral-500 tracking-wider font-bold uppercase italic">
                 <p># INITIALIZING CONNECTION TO PORTAL_SUBNET...</p>
                 <p># SYNCHRONIZING LAB_PROTOCOLS...</p>
                 <p># INDEXING BUG_LEDGER...</p>
                 <p className="text-emerald-500/60 mt-2 font-mono not-italic lowercase tracking-normal">Available: --atlas-info, --lab, --debug-ledger, --query-insights [topic]</p>
               </div>
               <p id="ama-answer" className="text-neutral-300 transition-all font-medium whitespace-pre-wrap italic">
                  Systems Ready. Awaiting architectural commands...
               </p>
            </div>

            <div className="mt-6 space-y-4">
              <div
                className="flex items-center gap-3 p-3.5 group focus-within:border-emerald-500/50 transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                }}
              >
                <span className="text-emerald-500 font-black animate-pulse shrink-0">&gt;</span>
                <input 
                  type="text" 
                  placeholder="Enter command (e.g. --lab)..."
                  className="bg-transparent border-none outline-none text-emerald-400 text-sm w-full placeholder:text-neutral-600 tracking-tight"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget.value.toLowerCase().trim();
                      const el = document.getElementById('ama-answer');
                      if (!el) return;
                      
                      const suggestions = ['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'];

                      const processCommand = (cmd: string) => {
                        const responses: Record<string, string> = {
                          '--atlas-info': "DIRECTORY CORE: The Developer Atlas is a unified mapping protocol. It provides deep visibility into ecosystem services, Physical Playground Primitives (Lab), Technical Friction Ledgers (Bug Timeline), and Architectural Nodes (Guides).",
                          '--map-usage': "NAVIGATION LOGIC: Navigate via the [ECOSYSTEM] for production-ready services. Use the [BUG TIMELINE] for Technical Friction retrospectives and debugging insights.",
                          '--ops-status': "OPS CENTER: Managed by Core Systems. Monitoring parity is synced with Aether Auth. No active incidents on Flux Core Gateway. Mesh stability: OPTIMAL.",
                          '--vitals': "SYSTEM HEALTH: \n- Uptime: 99.9% \n- Latency: 14ms \n- Technical Friction rate: 94.2% \n- Active modules: 124",
                          '--lab': "PHYSICAL PLAYGROUND PRIMITIVES: \n- Haptic Glow Trace\n- Magnetic Impulse\n- Refractive Glass\n- Volumetric Tilt\n- Elastic Modal Grid\n- Spotlight Masking",
                          '--debug-ledger': "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads",
                        };

                        if (cmd === '--lab') return responses['--lab'];
                        if (cmd.startsWith('--lab ')) {
                           const filter = cmd.replace('--lab ', '').trim();
                           return `FILTERING PHYSICAL PLAYGROUND PRIMITIVES for [${filter}]... \nMatch found: [${filter.toUpperCase()}] status: STABLE.`;
                        }

                        if (cmd.startsWith('--query-insights')) {
                          const topic = cmd.replace('--query-insights', '').trim();
                          if (!topic) return "USAGE: --query-insights [topic]. Suggested: React, TypeScript, Node.js...";
                          
                          if (suggestions.map(s => s.toLowerCase()).includes(topic.toLowerCase())) {
                            const articleMapping: Record<string, string> = {
                              'react': "ARCHITECTURAL NODE: Modern Web Architecture: Server Components vs. Client-side Hydration",
                              'typescript': "ARCHITECTURAL NODE: Scaling Reliability: The Outbox Pattern (TS Implementation)",
                              'junior experience': "ARCHITECTURAL NODE: The Junior Experience: Accelerated Growth",
                              'node.js': "ARCHITECTURAL NODE: Scaling Reliability: Microservices Topology",
                              'microservices': "ARCHITECTURAL NODE: The Outbox Pattern in Distributed Systems",
                              'serverless': "ARCHITECTURAL NODE: Fullstack Performance: Edge Caching for Vitals"
                            };
                            return articleMapping[topic.toLowerCase()] || `MATCH FOUND: Retrieving Architectural Nodes for [${topic.toUpperCase()}]...`;
                          } else {
                            return `NO INSIGHTS FOUND for [${topic.toUpperCase()}]. Suggested Architectural Nodes:\n` + suggestions.map(s => ` - ${s}`).join('\n');
                          }
                        }

                        return responses[cmd] || `CRITICAL ERROR: Command '${cmd}' unrecognized. Source --atlas-info for usage mapping.`;
                      };
                      
                      el.innerText = processCommand(input);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {['--atlas-info', '--lab', '--debug-ledger', '--query-insights'].map(cmd => (
                  <button 
                    key={cmd}
                    onClick={() => {
                      const el = document.getElementById('ama-answer');
                      if (el) {
                        const responses: Record<string, string> = {
                          '--atlas-info': "DIRECTORY CORE: The Developer Atlas is a unified mapping protocol. It provides deep visibility into ecosystem services, Physical Playground Primitives (Lab), Technical Friction Ledgers (Bug Timeline), and Architectural Nodes (Guides).",
                          '--lab': "PHYSICAL PLAYGROUND PRIMITIVES: \n- Haptic Glow Trace\n- Magnetic Impulse\n- Refractive Glass\n- Volumetric Tilt\n- Elastic Modal Grid\n- Spotlight Masking",
                          '--debug-ledger': "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads",
                          '--query-insights': "USAGE: --query-insights [topic]. Topics: React, Node.js, Junior Experience..."
                        };
                        el.innerText = responses[cmd];
                      }
                    }}
                    className="text-[11px] font-black uppercase tracking-widest px-3 py-1.5 text-neutral-500 hover:text-emerald-400 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                    }}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center text-[11px] text-neutral-500 font-bold uppercase tracking-widest pt-4 border-t border-white/6">
             <div className="flex gap-4">
                <button onClick={() => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] underline decoration-neutral-700">Physical_Lab</button>
                <button 
                  onClick={() => {
                    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                    const el = document.getElementById('ama-answer');
                    if (el) el.innerText = "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads";
                  }} 
                  className="hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] underline decoration-neutral-700"
                >
                  Bug_Timeline
                </button>
             </div>
             <button onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })} className="text-emerald-500 hover:text-emerald-400 font-black">Open_Guides &rarr;</button>
          </div>
        </motion.div>

        {/* Bug Timeline Quick Access Tile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-1 md:row-span-1 p-8 text-white flex flex-col justify-between group cursor-pointer"
          style={{
            background: 'linear-gradient(to bottom right, rgba(239,68,68,0.85), rgba(16,185,129,0.85))',
            backdropFilter: 'blur(16px)',
            borderRadius: '28px',
            boxShadow: '0 16px 48px rgba(239,68,68,0.12), 0 0 30px rgba(16,185,129,0.08)',
          }}
          onClick={() => {
            const el = document.getElementById('timeline');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Bug_Trace_Central</div>
          <div>
            <div className="text-6xl font-black tracking-tighter mb-1">04</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              Critical Bugs Logged <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>

        {/* Onboarding / Connection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between"
        >
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Onboarding.</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">Join the directory or schedule an architectural walkthrough.</p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 block w-full py-4 bg-slate-900 text-white text-center font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]"
            style={{ borderRadius: '20px' }}
          >
            Connect
          </button>
        </motion.div>

        {/* Local Environment Tile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Local_Vitals</h4>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          
          <div className="space-y-1 my-4">
             <div className="text-2xl font-bold tracking-tighter text-slate-900">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
             </div>
             <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
             </div>
          </div>

          <div className="pt-4 border-t border-black/6 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">22°C // Stable</span>
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Live</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}