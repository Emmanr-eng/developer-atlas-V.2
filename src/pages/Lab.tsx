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
    <div className="space-y-10 pb-24">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
          <FlaskConical className="w-3 h-3" />
          <span>Component Lab</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Component Lab</h1>
          <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider mt-1">Interactive experiments in UI architecture</p>
        </div>
        <p className="text-neutral-500 max-w-2xl text-sm leading-relaxed">
          A physical playground for structural UI primitives. Interact with the workbench below to explore different architectural nodes.
        </p>
      </div>

      <div className="border border-neutral-200 rounded-xl min-h-187.5 flex flex-col md:flex-row overflow-hidden relative bg-white">
        {/* Workspace Sidebar */}
        <div className="w-full md:w-72 border-r border-neutral-200 bg-neutral-50 p-5 flex flex-col space-y-4">
          <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Experiments</div>
          <div className="space-y-1 grow overflow-y-auto pr-1">
            {experiments.map((exp) => ( 
              <button
                key={exp.id}
                onClick={() => { setSelectedId(exp.id); setShowCode(false); }}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors duration-200 group relative",
                  selectedId === exp.id 
                    ? "bg-neutral-900 text-white" 
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                <div className="text-xs font-medium relative z-10">{exp.title}</div>
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-neutral-200">
             <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                System Stable
             </div>
          </div>
        </div>

        {/* Workspace Action Area */}
        <div className="grow flex flex-col relative bg-neutral-900">
          {/* Action Area Header */}
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center relative z-20">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white tracking-tight transition-all">
                {activeExp.title}
              </h2>
              <p className="text-xs text-neutral-400">{activeExp.description}</p>
            </div>
            <button 
              onClick={() => setShowCode(!showCode)}
              className={cn(
                "px-5 py-2 rounded-lg border font-medium text-xs transition-all duration-200",
                showCode 
                  ? "bg-white border-white text-neutral-900" 
                  : "bg-transparent border-neutral-700 text-neutral-300 hover:border-neutral-500"
              )}
            >
              {showCode ? 'Preview' : 'Code'}
            </button>
          </div>

          {/* Interaction Stage */}
          <div className="grow relative flex items-center justify-center p-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex items-center justify-center relative z-10"
              >
                {activeExp.component}
              </motion.div>
            </AnimatePresence>
            
            {/* Source Code Overlay */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-neutral-950 z-50 p-8 overflow-y-auto"
                >
                  <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-6">
                       <div className="space-y-1">
                          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Source</span>
                          <h3 className="text-lg font-semibold text-white">{activeExp.title}</h3>
                       </div>
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => copyToClipboard(activeExp.code)}
                            className="border border-neutral-700 px-4 py-1.5 rounded-lg text-neutral-300 text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2"
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                          <button 
                            onClick={() => setShowCode(false)}
                            className="text-neutral-500 hover:text-white text-xs font-medium transition-colors"
                          >
                            Close
                          </button>
                       </div>
                    </div>
                    
                    <motion.pre 
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-emerald-400 text-sm font-mono leading-relaxed whitespace-pre-wrap p-6 bg-neutral-900 rounded-lg border border-neutral-800"
                    >
                      <code>{activeExp.code}</code>
                    </motion.pre>
                    
                    <div className="grid grid-cols-3 gap-4">
                       {['REACTIVE', 'THREAD_SAFE', 'ATOMIC'].map((label) => (
                         <div key={label} className="p-4 border border-neutral-800 rounded-lg text-center">
                            <div className="text-[10px] font-medium text-neutral-600 uppercase tracking-wider">{label}</div>
                            <div className="text-emerald-500 font-medium text-sm mt-1">VERIFIED</div>
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
        <Sparkles className="w-8 h-8 text-neutral-700 group-hover/glow:text-emerald-500 transition-colors duration-700" />
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
      className="px-8 py-4 bg-white rounded-lg font-medium text-xs text-neutral-900 shadow-lg relative group border border-neutral-200"
    >
      <span className="relative z-10 flex items-center gap-2">
        <MousePointer2 className="w-3 h-3" />
        Trace Momentum
      </span>
    </motion.button>
  );
}

function GlassRefraction() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-neutral-800 via-neutral-900 to-neutral-800" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-48 h-48 bg-neutral-700/30 rounded-full blur-3xl absolute"
      />
      <div className="relative w-full max-w-50 aspect-square rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-6 text-center">
        <Layers className="w-6 h-6 text-white/40 mb-4" />
        <span className="text-xs font-medium text-white/60 tracking-wider">Refraction Layer</span>
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
        className="w-48 h-64 bg-gradient-to-br from-neutral-800 to-neutral-950 rounded-xl border border-neutral-700 shadow-2xl flex items-center justify-center relative group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-4 border border-neutral-600 rounded-lg" style={{ transform: 'translateZ(20px)' }} />
        <Maximize2 className="w-8 h-8 text-neutral-400" style={{ transform: 'translateZ(50px)' }} />
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
        "bg-white text-neutral-900 font-medium cursor-pointer border border-neutral-200",
        expanded ? "w-64 h-64 rounded-2xl p-8" : "w-16 h-16 rounded-xl p-4 flex items-center justify-center"
      )}
    >
      {expanded ? (
        <div className="space-y-4">
          <p className="text-xs font-medium">Elastic Node</p>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <motion.div animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-neutral-900 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-neutral-100 rounded-lg" />
            <div className="h-8 bg-neutral-100 rounded-lg" />
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
        <span className="text-8xl font-semibold text-white">ATLAS</span>
      </div>
      <div 
        className="absolute inset-0 flex items-center justify-center bg-white"
        style={{
          clipPath: `circle(80px at ${pos.x}px ${pos.y}px)`
        }}
      >
        <span className="text-8xl font-semibold text-neutral-900">ATLAS</span>
      </div>
      <div 
        className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}
