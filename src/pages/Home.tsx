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

        {/* Hero Tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 md:row-span-1 bento-card flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe className="w-32 h-32 rotate-12" />
          </div>
          <div className="absolute top-4 right-4">
            <span className="pixel-heading text-[7px] text-arcade-magenta coin-blink">● REC</span>
          </div>
          <h1 className="pixel-heading text-lg md:text-2xl mb-4 leading-relaxed">
            <span className="neon-cyan">SYNCHRONIZING</span>
            <br />
            <span className="text-white">THE ARCHITECTURAL</span>
            <br />
            <span className="neon-magenta">SUBSTRATE.</span>
          </h1>
          <p className="text-[#2a2a4a] max-w-md text-xs md:text-sm leading-relaxed font-mono">
            Atlas_Terminal v3.0 is now active. Real-time synchronization of Physical Playground Primitives, Technical Friction Ledgers, and universal Architectural Nodes.
          </p>
        </motion.div>

        {/* Central Directory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 md:row-span-2 bento-card flex flex-col"
        >
          <div className="aspect-square bg-linear-to-br from-arcade-purple to-arcade-cyan rounded-xl mb-6 flex items-center justify-center p-4 border-2 border-arcade-purple/50"
               style={{ boxShadow: '0 0 30px rgba(180, 74, 255, 0.2)' }}>
            <div className="pixel-heading text-white text-xl text-center leading-relaxed">CORE<br/>ECO</div>
          </div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="pixel-heading text-[10px] text-white leading-relaxed">Service Directory</h3>
            <span className="text-[8px] font-mono font-bold bg-arcade-cyan/10 text-arcade-cyan px-2 py-0.5 rounded border border-arcade-cyan/20 uppercase">MAP</span>
          </div>
          <p className="text-[#2a2a4a] text-xs leading-relaxed font-mono mb-6">
            A comprehensive catalog of Technical Modules, Production Services, and Foundational Blueprints.
          </p>
          <div className="mt-auto">
            <button
              onClick={() => {
                const el = document.getElementById('portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[9px] font-mono font-bold uppercase tracking-widest text-arcade-cyan hover:text-arcade-magenta flex items-center gap-2 transition-colors"
            >
              Explore Ecosystem <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Atlas Guides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between"
        >
          <h4 className="pixel-heading text-[7px] text-arcade-yellow mb-4 leading-relaxed">ATLAS GUIDES</h4>
          <div className="space-y-3">
            {[
              { icon: BookOpen, label: "Architectural Nodes", color: "#00f0ff" },
              { icon: Terminal, label: "Physical Primitives", color: "#39ff14" },
              { icon: Layers, label: "Friction Ledger", color: "#ff00aa" }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-[#0a0a12]/50 rounded-lg border border-[#2a2a4a]">
                <f.icon className="w-4 h-4" style={{ color: f.color }} />
                <span className="text-[8px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest">{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Terminal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 md:row-span-2 bento-card flex flex-col bg-[#0a0a12] border-arcade-cyan/30 font-mono shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(0, 240, 255, 0.05), inset 0 0 60px rgba(0, 240, 255, 0.02)' }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-arcade-cyan" />
              <h2 className="pixel-heading text-[10px] neon-cyan leading-relaxed">ATLAS_TERMINAL / V3.0</h2>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-arcade-red" />
              <div className="w-2.5 h-2.5 rounded-full bg-arcade-yellow" />
              <div className="w-2.5 h-2.5 rounded-full bg-arcade-green" />
            </div>
          </div>

          <div className="grow flex flex-col">
            <div className="p-5 bg-[#0a0a12] rounded-xl border border-[#2a2a4a]/50 min-h-40 flex flex-col text-xs leading-relaxed relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Terminal className="w-24 h-24" />
              </div>
              <div className="mb-4 space-y-1 text-[#2a2a4a] tracking-wider font-bold uppercase">
                <p className="text-arcade-green/40"># INITIALIZING CONNECTION TO PORTAL_SUBNET...</p>
                <p className="text-arcade-green/40"># SYNCHRONIZING LAB_PROTOCOLS...</p>
                <p className="text-arcade-green/40"># INDEXING BUG_LEDGER...</p>
                <p className="text-arcade-cyan/60 mt-2 lowercase tracking-normal">Available: --atlas-info, --lab, --debug-ledger, --query-insights [topic]</p>
              </div>
              <p id="ama-answer" className="text-arcade-green transition-all font-medium whitespace-pre-wrap">
                &gt; Systems Ready. Awaiting architectural commands...
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 p-3.5 bg-[#0a0a12] rounded-xl border-2 border-[#2a2a4a] group focus-within:border-arcade-cyan/50 transition-all">
                <span className="text-arcade-cyan font-black coin-blink shrink-0">&gt;_</span>
                <input
                  type="text"
                  placeholder="Enter command (e.g. --lab)..."
                  className="bg-transparent border-none outline-none text-arcade-green text-sm w-full placeholder:text-[#2a2a4a]/50 tracking-tight font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget.value.toLowerCase().trim();
                      const el = document.getElementById('ama-answer');
                      if (!el) return;

                      const suggestions = ['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'];

                      const processCommand = (cmd: string) => {
                        const responses: Record<string, string> = {
                          '--atlas-info': "DIRECTORY CORE: The Developer Atlas is a unified mapping protocol. It provides deep visibility into ecosystem services, Physical Playground Primitives (Lab), and Architectural Nodes (Guides). Navigate: [ECOSYSTEM] | [LAB] | [GUIDES]",
                          '--map-usage': "NAVIGATION LOGIC: Navigate via the [ECOSYSTEM] for production-ready services. Use the [BUG TIMELINE] for Technical Friction retrospectives and debugging patterns.",
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
                          '--atlas-info': "DIRECTORY CORE: The Developer Atlas is a unified mapping protocol. It provides deep visibility into ecosystem services, Physical Playground Primitives (Lab), and Architectural Nodes (Guides). Navigate: [ECOSYSTEM] | [LAB] | [GUIDES]",
                          '--lab': "PHYSICAL PLAYGROUND PRIMITIVES: \n- Haptic Glow Trace\n- Magnetic Impulse\n- Refractive Glass\n- Volumetric Tilt\n- Elastic Modal Grid\n- Spotlight Masking",
                          '--debug-ledger': "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads",
                          '--query-insights': "USAGE: --query-insights [topic]. Topics: React, Node.js, Junior Experience..."
                        };
                        el.innerText = responses[cmd];
                      }
                    }}
                    className="text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 bg-[#0a0a12] border border-[#2a2a4a] text-[#2a2a4a] hover:text-arcade-cyan hover:border-arcade-cyan/50 rounded-lg transition-all"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center text-[9px] text-[#2a2a4a] font-mono font-bold uppercase tracking-widest pt-4 border-t border-[#2a2a4a]/30">
            <div className="flex gap-4">
              <button onClick={() => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-arcade-green transition-colors">
                🎮 Open_Lab
              </button>
              <button
                onClick={() => {
                  document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                  const el = document.getElementById('ama-answer');
                  if (el) el.innerText = "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads";
                }}
                className="hover:text-arcade-red transition-colors"
              >
                🐛 Bug_Timeline
              </button>
            </div>
            <button onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })} className="text-arcade-cyan hover:text-arcade-magenta font-bold transition-colors">
              📖 Open_Guides →
            </button>
          </div>
        </motion.div>

        {/* Bug Timeline Tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-1 md:row-span-1 bg-linear-to-br from-arcade-red to-arcade-magenta rounded-xl p-8 text-white flex flex-col justify-between group cursor-pointer border-2 border-arcade-red/50"
          style={{ boxShadow: '0 0 30px rgba(255, 51, 51, 0.2)' }}
          onClick={() => {
            const el = document.getElementById('timeline');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="pixel-heading text-[7px] uppercase opacity-80 leading-relaxed">Bug_Trace_Central</div>
          <div>
            <div className="pixel-heading text-4xl mb-1 leading-relaxed">04</div>
            <div className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              Critical Bugs Logged <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>

        {/* Onboarding Tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between"
        >
          <h3 className="pixel-heading text-[10px] text-white leading-relaxed">ONBOARDING.</h3>
          <p className="text-xs text-[#2a2a4a] leading-relaxed font-mono mt-2">Join the directory or schedule an architectural walkthrough.</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 block w-full py-4 bg-arcade-yellow text-[#0a0a12] text-center rounded-lg transition-all hover:bg-[#ffee44] arcade-btn border-[#ccb800] text-[8px]"
            style={{ boxShadow: '0 0 15px rgba(255, 230, 0, 0.2), 0 3px 0 #ccb800' }}
          >
            🎮 PRESS START
          </button>
        </motion.div>

        {/* Local Vitals Tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-1 md:row-span-1 bento-card flex flex-col justify-between bg-[#0a0a12] border-[#2a2a4a]"
        >
          <div className="flex justify-between items-start">
            <h4 className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">LOCAL_VITALS</h4>
            <div className="w-2 h-2 rounded-full bg-arcade-green coin-blink" />
          </div>

          <div className="space-y-1 my-4">
            <div className="pixel-heading text-lg text-arcade-cyan leading-relaxed">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#2a2a4a]">
              {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a2a4a]/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cloud className="w-3 h-3 text-arcade-cyan" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#2a2a4a]">22°C // Stable</span>
            </div>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest neon-green">LIVE</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}