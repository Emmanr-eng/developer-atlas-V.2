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
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-arcade-green/10 border border-arcade-green/20 text-arcade-green text-[8px] font-mono font-bold uppercase tracking-widest">
          <FlaskConical className="w-3 h-3" />
          <span>Component Lab</span>
        </div>
        <div>
          <h1 className="pixel-heading text-xl neon-green leading-relaxed">COMPONENT LAB</h1>
          <p className="text-arcade-green/60 text-[8px] font-mono font-bold uppercase tracking-[0.2em] mt-1">Interactive experiments in UI architecture</p>
        </div>
        <p className="text-[#2a2a4a] max-w-2xl text-xs leading-relaxed font-mono">
          A physical playground for structural UI primitives. Interact with the workbench below to explore different architectural nodes.
        </p>
      </div>

      <div className="bento-card bg-[#0a0a12] border-[#2a2a4a] min-h-187.5 flex flex-col md:flex-row overflow-hidden relative"
           style={{ boxShadow: '0 0 40px rgba(57, 255, 20, 0.05)' }}>
        {/* Workspace Sidebar */}
        <div className="w-full md:w-80 border-r-2 border-[#2a2a4a] bg-[#0a0a12] p-6 flex flex-col space-y-6">
          <div className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">EXPERIMENT LIBRARY</div>
          <div className="space-y-2 grow overflow-y-auto pr-2">
            {experiments.map((exp) => (
              <button
                key={exp.id}
                onClick={() => { setSelectedId(exp.id); setShowCode(false); }}
                className={cn(
                  "w-full text-left p-4 rounded-lg transition-all duration-300 group relative overflow-hidden border-2",
                  selectedId === exp.id
                    ? "bg-arcade-green text-[#0a0a12] border-arcade-green"
                    : "text-[#2a2a4a] hover:text-arcade-green hover:bg-[#1a1a2e] border-transparent hover:border-arcade-green/30"
                )}
              >
                <div className="text-[9px] font-mono font-bold uppercase tracking-wider relative z-10">{exp.title}</div>
              </button>
            ))}
          </div>
          <div className="pt-6 border-t border-[#2a2a4a]/30">
            <div className="flex items-center gap-2 text-[8px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-arcade-green coin-blink"></span>
              System Stable
            </div>
          </div>
        </div>

        {/* Workspace Action Area */}
        <div className="grow flex flex-col relative bg-[#0a0a12]">
          <div className="p-8 border-b-2 border-[#2a2a4a] bg-[#12121f]/40 backdrop-blur-md flex justify-between items-center relative z-20">
            <div className="space-y-1">
              <h2 className="pixel-heading text-[11px] text-white leading-relaxed">
                {activeExp.title}
              </h2>
              <p className="text-[9px] text-[#2a2a4a] font-mono">{activeExp.description}</p>
            </div>
            <button
              onClick={() => setShowCode(!showCode)}
              className={cn(
                "arcade-btn text-[8px]",
                showCode
                  ? "bg-arcade-green border-[#22cc00] text-[#0a0a12] shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                  : "bg-[#0a0a12] border-[#2a2a4a] text-arcade-green hover:border-arcade-green"
              )}
            >
              {'</>'}  CODE
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

            {/* Grid Background */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-[0.03] pointer-events-none">
              {[...Array(100)].map((_, i) => (
                <div key={i} className="border-[0.5px] border-arcade-cyan" />
              ))}
            </div>

            {/* Code Overlay */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  className="absolute inset-0 bg-[#0a0a12]/90 z-50 p-12 overflow-y-auto"
                >
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex justify-between items-center border-b border-[#2a2a4a] pb-8">
                      <div className="space-y-1">
                        <span className="pixel-heading text-[7px] text-arcade-green leading-relaxed">NODE_TRACE // IMPLEMENT</span>
                        <h3 className="text-lg font-mono font-bold text-white">{activeExp.title}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => copyToClipboard(activeExp.code)}
                          className="arcade-btn bg-arcade-green/10 border-arcade-green/20 text-arcade-green hover:bg-arcade-green hover:text-[#0a0a12] text-[8px] flex items-center gap-2"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => setShowCode(false)}
                          className="text-[#2a2a4a] hover:text-white text-[8px] font-mono font-bold uppercase tracking-widest"
                        >
                          [ CLOSE ]
                        </button>
                      </div>
                    </div>

                    <motion.pre
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-arcade-green text-sm font-mono leading-relaxed whitespace-pre-wrap p-8 bg-[#0a0a12] rounded-xl border-2 border-arcade-green/20"
                      style={{ boxShadow: '0 0 30px rgba(57, 255, 20, 0.05)' }}
                    >
                      <code>{activeExp.code}</code>
                    </motion.pre>

                    <div className="grid grid-cols-3 gap-6">
                      {['REACTIVE', 'THREAD_SAFE', 'ATOMIC'].map((label) => (
                        <div key={label} className="p-6 border-2 border-[#2a2a4a] rounded-xl bg-[#0a0a12] text-center">
                          <div className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">{label}</div>
                          <div className="neon-green font-mono font-bold mt-2 text-sm">VERIFIED</div>
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

// --- Experiment Components (visual-only updates) ---

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
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(0, 240, 255, 0.15), transparent 80%)`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-arcade-cyan/20 group-hover/glow:text-arcade-cyan transition-colors duration-700" />
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
      className="px-8 py-4 bg-arcade-magenta rounded-lg font-mono font-bold text-[10px] uppercase tracking-[0.2em] text-white relative group border-2 border-[#ff44cc]"
      style={{ boxShadow: '0 0 25px rgba(255, 0, 170, 0.3), 0 4px 0 #990066' }}
    >
      <span className="relative z-10 flex items-center gap-2">
        <MousePointer2 className="w-3 h-3" />
        Trace Momentum
      </span>
      <div className="absolute inset-0 bg-white/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500" />
    </motion.button>
  );
}

function GlassRefraction() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-12 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-tr from-arcade-purple/20 via-[#0a0a12] to-arcade-magenta/20" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-48 h-48 bg-arcade-cyan/20 rounded-full blur-3xl absolute"
      />
      <div className="relative w-full max-w-50 aspect-square rounded-xl backdrop-blur-xl bg-white/5 border-2 border-white/10 shadow-2xl flex flex-col items-center justify-center p-6 text-center">
        <Layers className="w-6 h-6 text-white/40 mb-4" />
        <span className="pixel-heading text-[7px] text-white/60 leading-relaxed">REFRACTION</span>
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
        className="w-48 h-64 bg-linear-to-br from-[#1a1a2e] to-[#0a0a12] rounded-xl border-2 border-[#2a2a4a] flex items-center justify-center relative group"
        style={{ transformStyle: 'preserve-3d', boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)' }}
      >
        <div className="absolute inset-4 border border-arcade-cyan/20 rounded-lg" style={{ transform: 'translateZ(20px)' }} />
        <Maximize2 className="w-8 h-8 text-arcade-cyan coin-blink" style={{ transform: 'translateZ(50px)' }} />
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
        "bg-arcade-yellow text-[#0a0a12] font-mono font-bold uppercase tracking-widest cursor-pointer border-2 border-[#ccb800]",
        expanded ? "w-64 h-64 rounded-xl p-12" : "w-16 h-16 rounded-lg p-4 flex items-center justify-center"
      )}
      style={{ boxShadow: '0 0 20px rgba(255, 230, 0, 0.2)' }}
    >
      {expanded ? (
        <div className="space-y-4">
          <p className="pixel-heading text-[7px] leading-relaxed">ELASTIC NODE</p>
          <div className="h-2 w-full bg-[#0a0a12]/10 rounded-full overflow-hidden">
            <motion.div animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-[#0a0a12]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-[#0a0a12]/10 rounded-lg" />
            <div className="h-8 bg-[#0a0a12]/10 rounded-lg" />
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
      className="relative w-full h-full bg-[#0a0a12] overflow-hidden cursor-none"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="pixel-heading text-4xl text-white leading-relaxed">ATLAS</span>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center bg-arcade-magenta"
        style={{
          clipPath: `circle(80px at ${pos.x}px ${pos.y}px)`
        }}
      >
        <span className="pixel-heading text-4xl text-white leading-relaxed">ATLAS</span>
      </div>
      <div
        className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
}