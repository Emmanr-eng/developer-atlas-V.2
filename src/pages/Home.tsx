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
    <div className="flex h-full flex-col gap-6">
      <div className="grid grow grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card relative flex flex-col justify-center overflow-hidden md:col-span-2 md:row-span-1"
        >
          <div className="absolute right-0 top-0 p-8 text-blue-100 dark:text-blue-500/10">
            <Globe className="h-28 w-28 rotate-12" />
          </div>
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="section-kicker">Full-stack product engineering</div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Building clean, reliable digital experiences for modern teams.
              </h1>
              <p className="max-w-lg text-base leading-8 text-slate-600 dark:text-slate-300">
                Developer Atlas brings projects, experiments, and technical writing together in one polished workspace designed for clarity, depth, and fast exploration.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {features.map((feature) => (
                <div key={feature.name} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                  <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  {feature.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card flex flex-col md:col-span-1 md:row-span-2"
        >
          <div className="mb-6 flex aspect-square items-center justify-center rounded-3xl bg-linear-to-br from-blue-600 via-blue-500 to-indigo-500 p-4 text-center text-white shadow-lg shadow-blue-600/20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Workspace</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">Core Atlas</p>
            </div>
          </div>
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">Project ecosystem</h3>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">Live</span>
          </div>
          <p className="mb-8 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Review product work, reusable patterns, and technical systems organized into a clear, searchable portfolio.
          </p>
          <div className="mt-auto">
            <button
              onClick={() => {
                const el = document.getElementById('portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-300"
            >
              Explore ecosystem <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bento-card flex flex-col justify-between md:col-span-1 md:row-span-1"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">What’s inside</p>
            <div className="mt-5 space-y-3">
              {[
                { icon: BookOpen, label: 'Architecture notes', color: 'text-blue-600 dark:text-blue-400' },
                { icon: Terminal, label: 'Lab experiments', color: 'text-emerald-600 dark:text-emerald-400' },
                { icon: Layers, label: 'System patterns', color: 'text-indigo-600 dark:text-indigo-400' }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
                  <f.icon className={cn('h-4 w-4', f.color)} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bento-card flex flex-col bg-slate-950 text-slate-100 shadow-xl shadow-slate-900/12 dark:border-slate-800 dark:bg-slate-950 md:col-span-2 md:row-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">Atlas console</h2>
                <p className="text-sm text-slate-400">A lightweight command surface for navigating the portfolio.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
          </div>

          <div className="flex grow flex-col">
            <div className="relative min-h-44 rounded-3xl border border-white/10 bg-slate-950 px-5 py-5 text-sm leading-7 shadow-inner shadow-black/20">
              <div className="absolute right-0 top-0 p-4 text-white/5 pointer-events-none">
                <Terminal className="h-24 w-24" />
              </div>
              <div className="mb-4 space-y-1 text-slate-500">
                <p># Connecting to content index...</p>
                <p># Syncing experiments and system notes...</p>
                <p># Workspace ready for guided exploration.</p>
                <p className="mt-2 text-slate-400">Available: --atlas-info, --lab, --debug-ledger, --query-insights [topic]</p>
              </div>
              <p id="ama-answer" className="whitespace-pre-wrap font-medium text-blue-300 transition-all">
                &gt; Workspace ready. Enter a command to explore the atlas.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition-all focus-within:border-blue-400/40 focus-within:bg-white/[0.07]">
                <span className="shrink-0 text-blue-300">&gt;</span>
                <input
                  type="text"
                  placeholder="Enter command (e.g. --lab)..."
                  className="w-full border-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
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

              <div className="flex flex-wrap gap-2">
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
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm font-medium text-slate-400">
            <div className="flex gap-4">
              <button onClick={() => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })} className="transition-colors hover:text-emerald-300">
                Open lab
              </button>
              <button
                onClick={() => {
                  document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                  const el = document.getElementById('ama-answer');
                  if (el) el.innerText = "BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads";
                }}
                className="transition-colors hover:text-red-300"
              >
                View bug timeline
              </button>
            </div>
            <button onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })} className="font-semibold text-blue-300 transition-colors hover:text-white">
              Open guides →
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-red-200 bg-linear-to-br from-white via-white to-red-50 p-8 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/10 dark:border-red-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-red-500/10 md:col-span-1 md:row-span-1"
          onClick={() => {
            const el = document.getElementById('timeline');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600 dark:text-red-300">Bug timeline</div>
          <div>
            <div className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">04</div>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500 transition-opacity group-hover:opacity-100 dark:text-slate-300">
              Critical bugs logged <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bento-card flex flex-col justify-between md:col-span-1 md:row-span-1"
        >
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Ready to collaborate?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Reach out for product engineering, design systems, or technical consulting.</p>
          </div>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Start a conversation
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bento-card flex flex-col justify-between bg-white/95 md:col-span-1 md:row-span-1 dark:bg-slate-900/90"
        >
          <div className="flex items-start justify-between">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Local snapshot</h4>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>

          <div className="my-4 space-y-1">
            <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>22°C · Stable</span>
            </div>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
