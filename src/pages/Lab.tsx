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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
          <FlaskConical className="w-3 h-3" />
          <span>Component Lab</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic text-gray-900">Component Lab</h1>
          <p className="text-emerald-600 text-xs font-medium uppercase tracking-[0.2em] mt-1">Interactive experiments in UI architecture</p>
        </div>
        <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
          A physical playground for structural UI primitives. Interact with the workbench below to explore different architectural nodes.
        </p>
      </div>

      <div className="bento-card min-h-187.5 flex flex-col md:flex-row overflow-hidden relative">
        {/* Workspace Sidebar - glass on light */}
        <div className="w-full md:w-80 border-r border-white/30 bg-white/20 backdrop-blur-md p-6 flex flex-col space-y-6">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Experiment Library</div>
          <div className="space-y-2 grow overflow-y-auto pr-2">
            {experiments.map((exp) => ( 
              <button
                key={exp.id}
                onClick={() => { setSelectedId(exp.id); setShowCode(false); }}
                className={cn(
                  "w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  selectedId === exp.id 
                    ? "bg-emerald-500 text-white" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                )}
              >
                <div className="text-xs font-black uppercase tracking-tighter italic relative z-10">{exp.title}</div>
                {selectedId === exp.id && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-emerald-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="pt-6 border-t border-white/30">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Stable
             </div>
          </div>
        </div>

        {/* Workspace Action Area - keep dark for contrast with experiments */}
        <div className="grow flex flex-col relative bg-gray-900/90 backdrop-blur-md rounded-r-[2rem]">
          {/* Action Area Header */}
          <div className="p-8 border-b border-white/10 bg-black/20 backdrop-blur-md flex justify-between items-center relative z-20">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter transition-all">
                {activeExp.title}
              </h2>
              <p className="text-xs text-gray-400 font-medium">{activeExp.description}</p>
            </div>
            <button 
              onClick={() => setShowCode(!showCode)}
              className={cn(
                "px-8 py-3 rounded-xl border-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500",
                showCode 
                  ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
                  : "bg-black/30 border-white/20 text-emerald-400 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              )}
            >
              CODE
            </button>
          </div>

          {/* Interaction Stage */}
          <div className="grow relative flex items-center justify-center p-12 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExp.id}
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateX: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex items-center justify-center relative z-10"
              >
                {activeExp.component}
              </motion.div>
            </AnimatePresence>

            {/* Stage Background Decoration */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-[0.03] pointer-events-none">
               {[...Array(100)].map((_, i) => (
                 <div key={i} className="border-[0.5px] border-white" />
               ))}
            </div>
            
            {/* Source Code Overlay */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  className="absolute inset-0 bg-black/80 z-50 p-12 overflow-y-auto"
                >
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex justify-between items-center border-b border-white/10 pb-8">
                       <div className="space-y-1">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Node_Trace // Implement</span>
                          <h3 className="text-1xl font-black text-white italic uppercase tracking-tighter">{activeExp.title}</h3>
                       </div>
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => copyToClipboard(activeExp.code)}
                            className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied" : "Copy Source"}
                          </button>
                          <button 
                            onClick={() => setShowCode(false)}
                            className="text-neutral-500 hover:text-white text-[10px] font-black uppercase tracking-widest"
                          >
                            [ Close ]
                          </button>
                       </div>
                    </div>
                    
                    <motion.pre 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-emerald-400 text-1xl font-mono leading-relaxed italic whitespace-pre-wrap p-8 bg-white/5 rounded-3xl border border-white/10 shadow-2xl"
                    >
                      <code>{activeExp.code}</code>
                    </motion.pre>
                    
                    <div className="grid grid-cols-3 gap-6">
                       {['REACTIVE', 'THREAD_SAFE', 'ATOMIC'].map((label) => (
                         <div key={label} className="p-6 border border-white/10 rounded-2xl bg-black/50 text-center">
                            <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{label}</div>
                            <div className="text-emerald-500 font-bold mt-2">VERIFIED</div>
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
  );
}

// --- Experiment Components (unchanged logic) ---

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
      className="w-full h-full absolute inset-0 cursor-crosshair group/glow"
      style={{
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(16, 185, 129, 0.1), transparent 80%)`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-emerald-500/20 group-hover/glow:text-emerald-500 transition-colors duration-700" />
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
      className="px-8 py-4 bg-emerald-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-black shadow-2xl relative group"
    >
      <span className="relative z-10 flex items-center gap-2">
        <MousePointer2 className="w-3 h-3" />
        Trace Momentum
      </span>
      <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500" />
    </motion.button>
  );
}

function GlassRefraction() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 via-black to-red-900/20" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl absolute"
      />
      <div className="relative w-full max-w-50 aspect-square rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-6 text-center">
        <Layers className="w-6 h-6 text-white/40 mb-4" />
        <span className="text-[10px] font-black text-white/60 tracking-widest uppercase italic">Refraction Layer</span>
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
      className="w-full h-full flex items-center justify-center perspective-[1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-48 h-64 bg-gradient-to-br from-neutral-800 to-black rounded-3xl border border-neutral-700/50 shadow-2xl flex items-center justify-center relative group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-4 border border-emerald-500/20 rounded-2xl" style={{ transform: 'translateZ(20px)' }} />
        <Maximize2 className="w-8 h-8 text-emerald-500 animate-pulse" style={{ transform: 'translateZ(50px)' }} />
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
        "bg-emerald-500 text-black font-black uppercase tracking-widest cursor-pointer",
        expanded ? "w-64 h-64 rounded-[3rem] p-12" : "w-16 h-16 rounded-2xl p-4 flex items-center justify-center"
      )}
    >
      {expanded ? (
        <div className="space-y-4">
          <p className="text-[10px]">Elastic Node</p>
          <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
            <motion.div animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-black" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-black/5 rounded-xl" />
            <div className="h-8 bg-black/5 rounded-xl" />
          </div>
        </div>
      ) : (
        <Activity className="w-6 h-6" />
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
      className="relative w-full h-full bg-neutral-900 overflow-hidden cursor-none"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-8xl font-black text-white italic">ATLAS</span>
      </div>
      <div 
        className="absolute inset-0 flex items-center justify-center bg-emerald-500"
        style={{
          clipPath: `circle(80px at ${pos.x}px ${pos.y}px)`
        }}
      >
        <span className="text-8xl font-black text-black italic">ATLAS</span>
      </div>
      <div 
        className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}
