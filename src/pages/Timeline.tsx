import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Timeline() {
  const [searchParams] = useSearchParams();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bugs = [
    {
      id: 'infinite-loop',
      bug: "The Infinite Re-render Loop",
      problem: "Updating state directly inside the function body of a functional component without a useEffect wrapper.",
      problemCode: "function Component() {\n  const [count, setCount] = useState(0);\n  setCount(count + 1); // CRITICAL: Updates state on every render\n  return <div>{count}</div>;\n}",
      solution: "Move state updates into a useEffect hook with an appropriate dependency array or a callback event.",
      solutionCode: "useEffect(() => {\n  const timer = setInterval(() => setCount(c => c + 1), 1000);\n  return () => clearInterval(timer);\n}, []); // Empty array ensures this only runs once",
    },
    {
      id: 'stale-closure',
      bug: "Stale Closure in UseEffect",
      problem: "Referring to a state variable inside a hook that isn't listed in the dependency array, causing logic to use old values.",
      problemCode: "useEffect(() => {\n  console.log(user.id); // 'user' is stale if not in deps\n}, []); // Missing [user] dependency",
      solution: "Properly add all external dependencies to the array or use the functional update pattern for setState.",
      solutionCode: "useEffect(() => {\n  if (user.id) syncData(user.id);\n}, [user.id]); // Correctly re-runs when ID changes",
    },
    {
      id: 'float-imprecision',
      bug: "Floating Point Imprecision",
      problem: "Directly comparing 0.1 + 0.2 === 0.3 in JavaScript, which returns false due to binary floating-point math.",
      problemCode: "const result = (0.1 + 0.2 === 0.3);\nconsole.log(result); // returns false (0.30000000000000004)",
      solution: "Use Number.EPSILON for comparison: Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON.",
      solutionCode: "const isEqual = Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON;\n// Returns true (safe comparison)",
    },
    {
      id: 'untyped-payload',
      bug: "Untyped API Response Payload",
      problem: "Accessing deeply nested properties on a JSON response without checking for 'undefined', leading to 'Cannot read property of null'.",
      problemCode: "const userName = response.data.user.profile.name;\n// Crashes if 'user' or 'profile' is null",
      solution: "Implement strict TypeScript interfaces and use optional chaining (?.) or Zod for validation.",
      solutionCode: "const userName = response?.data?.user?.profile?.name ?? 'Guest';\n// Gracefully handles null/undefined values",
    }
  ];

  useEffect(() => {
    const bugId = searchParams.get('bug');
    if (bugId && bugs.some(b => b.id === bugId)) {
      setExpandedId(bugId);
    }
  }, [searchParams]);

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest">
          <Bug className="w-3 h-3" />
          <span>Active Debugging Ledger</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic text-gray-900">Bug Timeline Explorer</h1>
        <p className="text-gray-500 max-w-2xl text-sm leading-relaxed font-medium">
          A continuous trace of technical friction: documenting common coding bugs, their internal causes, and the engineering path to resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bugs.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "bento-card transition-all duration-500 overflow-hidden",
                isExpanded ? "p-8 md:p-12 ring-2 ring-red-300/50 shadow-2xl shadow-red-500/5" : "p-6 cursor-pointer"
              )}
              id={item.id}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                    isExpanded ? "bg-red-100 border-red-300" : "bg-white/40 border-white/50"
                  )}>
                    <AlertCircle className={cn("w-6 h-6 transition-colors", isExpanded ? "text-red-500" : "text-gray-400")} />
                  </div>
                  <h2 className={cn(
                    "text-2xl md:text-1xl font-black tracking-tighter uppercase italic transition-colors duration-500",
                    isExpanded ? "text-gray-900" : "text-gray-500"
                  )}>
                    {item.bug}
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "w-6 h-6 text-gray-400 transition-transform duration-500",
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-white/40">
                      {/* Problem Section */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            The Problem
                          </p>
                          <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed">
                            {item.problem}
                          </p>
                        </div>
                        <div className="p-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl font-mono text-xs text-red-700 leading-relaxed overflow-x-auto">
                          <p className="text-[10px] text-red-400 mb-2 font-bold uppercase tracking-widest">// Trigger Code</p>
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
                          <p className="text-lg md:text-xl text-gray-900 font-bold leading-relaxed">
                            {item.solution}
                          </p>
                        </div>
                        <div className="p-6 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 rounded-2xl font-mono text-xs text-emerald-700 leading-relaxed overflow-x-auto shadow-lg shadow-emerald-500/5">
                          <p className="text-[10px] text-emerald-500 mb-2 font-bold uppercase tracking-widest">// Resolution Logic</p>
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
