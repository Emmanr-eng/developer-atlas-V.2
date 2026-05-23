// ═══════════════════════════════════════════════════
// Terminal command processor — pure function, no DOM.
// Previously duplicated inline in Home.tsx (keyboard
// handler + button handler each had their own copy).
// ═══════════════════════════════════════════════════

const SUGGESTIONS = ['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'] as const;

const STATIC_RESPONSES: Record<string, string> = {
  '--atlas-info':
    'DIRECTORY CORE: The Developer Atlas is a unified mapping protocol. It provides deep visibility into ecosystem services, Physical Playground Primitives, and Architectural Nodes.',
  '--map-usage':
    'NAVIGATION LOGIC: Navigate via the [ECOSYSTEM] for production-ready services. Use the [BUG TIMELINE] for Technical Friction retrospectives and debugging patterns.',
  '--ops-status':
    'OPS CENTER: Managed by Core Systems. Monitoring parity is synced with Aether Auth. No active incidents on Flux Core Gateway. Mesh stability: OPTIMAL.',
  '--vitals':
    'SYSTEM HEALTH: \n- Uptime: 99.9% \n- Latency: 14ms \n- Technical Friction rate: 94.2% \n- Active modules: 124',
  '--lab':
    'PHYSICAL PLAYGROUND PRIMITIVES: \n- Haptic Glow Trace\n- Magnetic Impulse\n- Refractive Glass\n- Volumetric Tilt\n- Elastic Modal Grid\n- Spotlight Masking',
  '--debug-ledger':
    'BUG_LEDGER_ENTRIES: \n- Infinite Re-render Loops\n- Stale Closures\n- Floating Point Imprecision\n- Untyped Payloads',
};

const ARTICLE_MAPPING: Record<string, string> = {
  react: 'ARCHITECTURAL NODE: Modern Web Architecture: Server Components vs. Client-side Hydration',
  typescript: 'ARCHITECTURAL NODE: Scaling Reliability: The Outbox Pattern (TS Implementation)',
  'junior experience': 'ARCHITECTURAL NODE: The Junior Experience: Accelerated Growth',
  'node.js': 'ARCHITECTURAL NODE: Scaling Reliability: Microservices Topology',
  microservices: 'ARCHITECTURAL NODE: The Outbox Pattern in Distributed Systems',
  serverless: 'ARCHITECTURAL NODE: Fullstack Performance: Edge Caching for Vitals',
};

/**
 * Process a terminal command string and return the response text.
 * Pure function — no side effects, no DOM access.
 */
export function processCommand(rawCmd: string): string {
  const cmd = rawCmd.toLowerCase().trim();

  if (!cmd) return 'USAGE: Enter a command. Try --atlas-info for help.';

  // Exact static match
  if (STATIC_RESPONSES[cmd]) return STATIC_RESPONSES[cmd];

  // --lab <filter>
  if (cmd.startsWith('--lab ')) {
    const filter = cmd.slice(6).trim();
    return `FILTERING PHYSICAL PLAYGROUND PRIMITIVES for [${filter}]... \nMatch found: [${filter.toUpperCase()}] status: STABLE.`;
  }

  // --query-insights [topic]
  if (cmd.startsWith('--query-insights')) {
    const topic = cmd.replace('--query-insights', '').trim();
    if (!topic) return 'USAGE: --query-insights [topic]. Suggested: React, TypeScript, Node.js...';

    const matched = ARTICLE_MAPPING[topic.toLowerCase()];
    if (matched) return matched;

    const isSuggested = SUGGESTIONS.some((s) => s.toLowerCase() === topic.toLowerCase());
    if (isSuggested) return `MATCH FOUND: Retrieving Architectural Nodes for [${topic.toUpperCase()}]...`;

    return (
      `NO INSIGHTS FOUND for [${topic.toUpperCase()}]. Suggested Architectural Nodes:\n` +
      SUGGESTIONS.map((s) => ` - ${s}`).join('\n')
    );
  }

  return `CRITICAL ERROR: Command '${cmd}' unrecognized. Source --atlas-info for usage mapping.`;
}

/** Quick-access button commands and their responses */
export const QUICK_COMMANDS = ['--atlas-info', '--lab', '--debug-ledger', '--query-insights'] as const;

export function getQuickResponse(cmd: string): string {
  if (cmd === '--query-insights') {
    return 'USAGE: --query-insights [topic]. Topics: React, Node.js, Junior Experience...';
  }
  return STATIC_RESPONSES[cmd] ?? processCommand(cmd);
}