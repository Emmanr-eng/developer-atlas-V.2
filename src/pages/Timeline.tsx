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
        <div className="section-kicker border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <Bug className="h-3.5 w-3.5" />
          Engineering notes
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">A structured log of common bugs, root causes, and cleaner implementation patterns.</h1>
        <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Each entry captures a practical debugging lesson with the trigger case and the recommended fix side by side.
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
                'overflow-hidden rounded-3xl border bg-white shadow-sm shadow-slate-900/5 transition-all duration-300 dark:bg-slate-900',
                isExpanded
                  ? 'border-red-200 shadow-xl shadow-red-500/8 dark:border-red-500/20 dark:shadow-black/25'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
              )}
              id={item.id}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <div className="flex items-center justify-between gap-4 px-6 py-6 md:px-8">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300',
                    isExpanded
                      ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
                      : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400'
                  )}>
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Bug review</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{item.bug}</h2>
                  </div>
                </div>
                <ChevronDown className={cn('h-5 w-5 text-slate-400 transition-transform duration-300', isExpanded && 'rotate-180 text-red-500 dark:text-red-300')} />
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 0 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="grid grid-cols-1 gap-8 border-t border-slate-200 px-6 py-8 dark:border-slate-800 md:px-8 lg:grid-cols-2">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-600 dark:text-red-300">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            The problem
                          </p>
                          <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">{item.problem}</p>
                        </div>
                        <div className="code-surface overflow-x-auto">
                          <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">Trigger code</p>
                          <pre><code>{item.problemCode}</code></pre>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" />
                            The solution
                          </p>
                          <p className="text-lg leading-8 text-slate-700 dark:text-slate-100">{item.solution}</p>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 font-mono text-sm leading-7 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                          <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">Resolution logic</p>
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
