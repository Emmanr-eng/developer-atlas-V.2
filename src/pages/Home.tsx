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
      {/* Main Atlas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-4 grow">
        
        {/* The Map Concept */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-center relative overflow-hidden group p-8"
        >
          <h1 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight leading-[1.1] text-neutral-900">
            Synchronizing the <br/> Architectural <span className="text-neutral-400 italic">Substrate.</span>
          </h1>
          <p className="text-neutral-500 max-w-md text-sm leading-relaxed">
            Atlas Terminal v3.0 is now active. Real-time synchronization of Physical Playground Primitives, Technical Friction Ledgers, and universal Architectural Nodes.
          </p>
        </motion.div>

        {/* Central Directory / Ecosystem */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 md:row-span-2 bento-card flex flex-col p-6"
        >
          <div className="aspect-square bg-neutral-900 rounded-xl mb-6 flex items-center justify-center p-4 relative">
            <div className="text-white font-semibold text-3xl text-center leading-none tracking-tight">CORE<br/>ECO</div>
          </div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Service Directory</h3>
            <span className="text-[10px] font-medium bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full border border-neutral-200 uppercase tracking-wider">Map</span>
          </div>
          <p className="text-neutral-500 text-xs leading-relaxed mb-6">
            A comprehensive catalog of Technical Modules, Production Services, and Foundational Blueprints.
          </p>
          <div className="mt-auto">
            <button 
              onClick={() => {
                const el = document.getElementById('portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-medium text-neutral-900 hover:text-neutral-600 flex items-center gap-2 transition-colors"
            >
              Explore Ecosystem <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Technical Guidance */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between p-6"
        >
          <h4 className="text-[11px] text-neutral-400 uppercase tracking-widest font-medium mb-4">Atlas Guides</h4>
          <div className="space-y-2">
             {[
               { icon: BookOpen, label: "Architectural Nodes" },
               { icon: Terminal, label: "Physical Primitives" },
               { icon: Layers, label: "Friction Ledger" }
             ].map((f, i) => (
               <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <f.icon className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-600">{f.label}</span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Terminal Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 md:row-span-2 border border-neutral-200 rounded-xl p-8 flex flex-col font-mono relative overflow-hidden bg-neutral-50"
        >
          <div className="flex justify-between items-center mb-6 relative">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-neutral-400" />
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 font-sans">Atlas Terminal / v3.0</h2>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            </div>
          </div>
          
          <div className="grow flex flex-col relative">
            <div className="p-5 bg-white rounded-lg border border-neutral-200 min-h-40 flex flex-col text-xs leading-relaxed relative overflow-hidden">
               <div className="mb-4 space-y-1 text-neutral-400 font-mono text-[11px]">
                 <p># INITIALIZING CONNECTION TO PORTAL_SUBNET...</p>
                 <p># SYNCHRONIZING LAB_PROTOCOLS...</p>
                 <p># INDEXING BUG_LEDGER...</p>
                 <p className="text-neutral-500 mt-2 font-mono">Available: --atlas-info, --lab, --debug-ledger, --query-insights [topic]</p>
               </div>
               <p id="ama-answer" className="text-neutral-700 transition-all font-medium whitespace-pre-wrap font-mono text-[11px]">
                  Systems Ready. Awaiting architectural commands...
               </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 focus-within:border-neutral-400 transition-colors">
                <span className="text-neutral-400 font-mono shrink-0">&gt;</span>
                <input 
                  type="text" 
                  placeholder="Enter command (e.g. --lab)..."
                  className="bg-transparent border-none outline-none text-neutral-700 text-sm w-full placeholder:text-neutral-300 font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget.value.toLowerCase().trim();
                      const el = document.getElementById('ama-answer');
                      if (!el) return;
                      
                      const suggestions = ['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'];

                      const processCommand = (cmd: string) => {
                        const responses: Record<string, string> = {
                          '--atlas-info': "DIRECTORY CORE: The Developer Atlas is a unified mapping protocol. It provides deep visibility into ecosystem services, Physical Playground Primitives (Lab), and Technical Friction Ledgers (Bug Timeline).",
                          '--map-usage': "NAVIGATION LOGIC: Navigate via the [ECOSYSTEM] for production-ready services. Use the [BUG TIMELINE] for Technical Friction retrospectives and debugging history.",
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
                          '--atlas-info': "DIRECTORY CORE: The Developer Atlas is a unified mapping protocol. It provides deep visibility into ecosystem services, Physical Playground Primitives (Lab), and Technical Friction Ledgers (Bug Timeline).",
                          '--lab': "PHYSICAL PLAYGROUND PRIMITIVES: \n- Haptic Glow Trace\n- Magnetic Impulse\n- Refractive Glass\n- Volumetric Tilt\n- Elastic Modal Grid\n- Spotlight Masking",
                          '--debug-ledger': "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads",
                          '--query-insights': "USAGE: --query-insights [topic]. Topics: React, Node.js, Junior Experience..."
                        };
                        el.innerText = responses[cmd];
                      }
                    }}
                    className="text-[11px] font-medium px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all font-mono"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center text-xs text-neutral-400 font-medium pt-4 border-t border-neutral-200 relative font-sans">
             <div className="flex gap-4">
                <button onClick={() => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-neutral-900 transition-colors underline underline-offset-2 decoration-neutral-300">
                  Lab
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                    const el = document.getElementById('ama-answer');
                    if (el) el.innerText = "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads";
                  }} 
                  className="hover:text-neutral-900 transition-colors underline underline-offset-2 decoration-neutral-300"
                >
                  Bug Timeline
                </button>
             </div>
             <button onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })} className="text-neutral-900 hover:text-neutral-600 font-medium transition-colors">Open Guides →</button>
          </div>
        </motion.div>

        {/* Bug Timeline Quick Access Tile */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-1 md:row-span-1 rounded-xl p-8 text-white flex flex-col justify-between group cursor-pointer relative overflow-hidden bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors"
          onClick={() => {
            const el = document.getElementById('timeline');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">Bug Trace</div>
          <div className="relative">
            <div className="text-5xl font-semibold tracking-tight mb-1">04</div>
            <div className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 group-hover:text-neutral-300 transition-colors flex items-center gap-2">
              Critical Bugs Logged <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>

        {/* Onboarding / Connection */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between p-6"
        >
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Onboarding.</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">Join the directory or schedule an architectural walkthrough.</p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 block w-full py-3 text-center font-medium rounded-lg text-xs transition-colors bg-neutral-900 text-white hover:bg-neutral-800"
          >
            Connect
          </button>
        </motion.div>

        {/* Local Environment Tile */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between p-6"
        >
          <div className="flex justify-between items-start">
            <h4 className="text-[11px] text-neutral-400 uppercase tracking-widest font-medium">Local Vitals</h4>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          
          <div className="space-y-1 my-4">
             <div className="text-2xl font-semibold tracking-tight text-neutral-900">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
             </div>
             <div className="text-[11px] font-medium text-neutral-400">
                {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
             </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Cloud className="w-3 h-3 text-neutral-400" />
                <span className="text-[11px] font-medium text-neutral-400">22°C · Stable</span>
             </div>
             <span className="text-[11px] font-medium text-emerald-600">Live</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
