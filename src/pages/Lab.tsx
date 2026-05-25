import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FlaskConical, MousePointer2, Sparkles, Layers, Activity, Maximize2, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Experiment {
  id: string;
  title: string;
  description: string;
  code: string;
  component: React.ReactNode;
}

export default function Lab() {
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState('haptic-glow');
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const expId = searchParams.get('exp');
    if (expId && experiments.some(e => e.id === expId)) {
      setSelectedId(expId);
    }
  }, [searchParams]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const experiments: Experiment[] = [
    {
      id: 'haptic-glow',
      title: 'Haptic Glow Trace',
      description: 'A responsive radial gradient that tracks cursor proximity with high-frequency interpolation.',
      code: `const [pos, setPos] = useState({ x: 0, y: 0 });

// radial-gradient tracking logic
background: radial-gradient(
  400px circle at \${pos.x}px \${pos.y}px,
  rgba(16, 185, 129, 0.1),
  transparent 80%
)`,
      component: <HapticGlow />
    },
    {
      id: 'magnetic-button',
      title: 'Magnetic Impulse',
      description: 'Zero-gravity navigation element that warps toward the cursor using spring physics.',
      code: `<motion.button
  onMouseMove={handleMouseMove}
  animate={{ 
    x: pos.x * 0.35, 
    y: pos.y * 0.35 
  }}
  transition={{ 
    type: "spring", 
    stiffness: 200, 
    damping: 20 
  }}
/>`,
      component: <MagneticButton />
    },
    {
      id: 'glass-refraction',
      title: 'Refractive Glass',
      description: 'Multi-layer backdrop filtering with dynamic saturation and grain overlays.',
      code: `// Refraction architecture configuration
.glass {
  backdrop-filter: blur(12px) saturate(180%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`,
      component: <GlassRefraction />
    },
    {
      id: 'parallax-depth',
      title: 'Volumetric Tilt',
      description: '3D perspective shifting based on container-relative cursor orientation.',
      code: `// 3D Perspective mapping
animate={{ 
  rotateX: tilt.y, 
  rotateY: tilt.x 
}}
transition={{ 
  type: "spring", 
  stiffness: 300, 
  damping: 30 
}}`,
      component: <ParallaxDepth />
    },
    {
      id: 'elastic-expand',
      title: 'Elastic Modal Grid',
      description: 'Layout transitions using non-linear easing for organic structural shifts.',
      code: `<motion.div
  layout
  transition={{ 
    type: "spring", 
    stiffness: 400, 
    damping: 10,
    mass: 0.5
  }}
/>`,
      component: <ElasticExpand />
    },
    {
      id: 'fluid-spotlight',
      title: 'Spotlight Masking',
      description: 'Dynamic SVG clip-paths revealing underlying visual textures through interaction.',
      code: `// SVG Dynamic Masking logic
style={{
  clipPath: \`circle(80px at \${pos.x}px \${pos.y}px)\`
}}`,
      component: <FluidSpotlight />
    }
  ];

  const activeExp = experiments.find(e => e.id === selectedId) || experiments[0];

  return (
    <div className="space-y-12 pb-24">
      <div className="space-y-4">
        <div className="section-kicker">
          <FlaskConical className="h-3.5 w-3.5" />
          Interaction lab
        </div>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">A curated workbench for UI motion studies, surface treatments, and interaction experiments.</h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Explore the same experimental logic through a cleaner, dashboard-inspired interface designed for focused review.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex min-h-184 flex-col md:flex-row">
          <div className="w-full border-b border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-950/70 md:w-80 md:border-b-0 md:border-r">
            <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Experiment library</div>
            <div className="space-y-2 pr-1">
              {experiments.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => { setSelectedId(exp.id); setShowCode(false); }}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-4 text-left transition-all',
                    selectedId === exp.id
                      ? 'border-blue-200 bg-white text-slate-950 shadow-sm dark:border-blue-500/20 dark:bg-slate-900 dark:text-white'
                      : 'border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-white'
                  )}
                >
                  <div className="text-sm font-semibold">{exp.title}</div>
                  <div className="mt-1 text-xs leading-6 text-slate-400 dark:text-slate-500">{exp.description}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                System stable
              </div>
            </div>
          </div>

          <div className="flex grow flex-col">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-white/90 px-6 py-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:flex-row md:items-center md:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Selected experiment</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{activeExp.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{activeExp.description}</p>
              </div>
              <button
                onClick={() => setShowCode(!showCode)}
                className={cn(
                  'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition',
                  showCode
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                )}
              >
                {'</>'} Code
              </button>
            </div>

            <div className="relative flex grow items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_40%)] p-8 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_34%)] md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExp.id}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.03, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 flex h-full w-full items-center justify-center"
                >
                  {activeExp.component}
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 opacity-50 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[48px_48px] dark:bg-[linear-gradient(to_right,rgba(71,85,105,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.18)_1px,transparent_1px)]" />

              <AnimatePresence>
                {showCode && (
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    className="absolute inset-0 z-50 overflow-y-auto bg-white/88 p-8 dark:bg-slate-950/88 md:p-12"
                  >
                    <div className="mx-auto max-w-4xl space-y-10">
                      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 md:flex-row md:items-center">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Implementation details</p>
                          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{activeExp.title}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => copyToClipboard(activeExp.code)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-500/30 dark:hover:text-blue-300"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => setShowCode(false)}
                            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      <motion.pre
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-950 p-6 font-mono text-sm leading-7 text-slate-200 dark:border-slate-700"
                      >
                        <code>{activeExp.code}</code>
                      </motion.pre>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {['Reactive', 'Thread-safe', 'Atomic'].map((label) => (
                          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{label}</div>
                            <div className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">Verified</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HapticGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group/glow absolute inset-0 h-full w-full cursor-crosshair rounded-4xl"
      style={{
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(37, 99, 235, 0.16), transparent 80%)`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-blue-300/70 transition-colors duration-700 group-hover/glow:text-blue-500" />
      </div>
    </div>
  );
}

function MagneticButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x, y });
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x * 0.35, y: pos.y * 0.35 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative rounded-2xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-600/20"
    >
      <span className="relative z-10 flex items-center gap-2">
        <MousePointer2 className="h-4 w-4" />
        Trace momentum
      </span>
      <div className="absolute inset-0 rounded-2xl bg-white/15 opacity-0 transition group-hover:opacity-100" />
    </motion.button>
  );
}

function GlassRefraction() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-4xl p-12">
      <div className="absolute inset-0 bg-linear-to-tr from-blue-100 via-transparent to-indigo-100 dark:from-blue-500/10 dark:via-transparent dark:to-indigo-500/10" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute h-48 w-48 rounded-full bg-blue-400/20 blur-3xl"
      />
      <div className="glass relative flex aspect-square w-full max-w-52 flex-col items-center justify-center rounded-4xl p-6 text-center">
        <Layers className="mb-4 h-6 w-6 text-slate-500 dark:text-slate-300" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Refraction</span>
      </div>
    </div>
  );
}

function ParallaxDepth() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 40, y: y * -40 });
  };

  return (
    <div
      className="flex h-full w-full items-center justify-center perspective-[1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex h-64 w-48 items-center justify-center rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-4 rounded-2xl border border-blue-200/80 dark:border-blue-500/20" style={{ transform: 'translateZ(20px)' }} />
        <Maximize2 className="h-8 w-8 text-blue-600 dark:text-blue-300" style={{ transform: 'translateZ(50px)' }} />
      </motion.div>
    </div>
  );
}

function ElasticExpand() {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 400, damping: 10, mass: 0.5 }}
      onClick={() => setExpanded(!expanded)}
      className={cn(
        'cursor-pointer rounded-4xl-white text-slate-900 shadow-xl shadow-slate-900/8 dark:bg-slate-900 dark:text-white',
        expanded ? 'h-64 w-64 p-10' : 'flex h-20 w-20 items-center justify-center'
      )}
    >
      {expanded ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Elastic node</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <motion.div animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-blue-600" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ) : (
        <Activity className="h-6 w-6 text-blue-600 dark:text-blue-300" />
      )}
    </motion.div>
  );
}

function FluidSpotlight() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full w-full overflow-hidden rounded-4xl bg-slate-950 cursor-none"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-4xl font-semibold tracking-tight text-white">ATLAS</span>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-600 to-indigo-500"
        style={{
          clipPath: `circle(80px at ${pos.x}px ${pos.y}px)`
        }}
      >
        <span className="text-4xl font-semibold tracking-tight text-white">ATLAS</span>
      </div>
      <div
        className="pointer-events-none absolute h-2 w-2 rounded-full bg-white"
        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}
