// ═══════════════════════════════════════════════════
// Pure search/filter helpers — extracted from
// Portfolio and Blog inline filter lambdas.
// ═══════════════════════════════════════════════════

import type { BlogPost, Project } from '../types';

/**
 * Case-insensitive substring match.
 */
function includes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Filter blog posts by search query across title, summary, and tags.
 */
export function filterPosts(posts: BlogPost[], search: string): BlogPost[] {
  if (!search.trim()) return posts;
  const q = search.toLowerCase();
  return posts.filter(
    (p) =>
      includes(p.title, q) ||
      includes(p.summary, q) ||
      p.tags.some((tag) => includes(tag, q)),
  );
}

/**
 * Filter projects by category and search query.
 */
export function filterProjects(
  projects: Project[],
  category: string,
  search: string,
): Project[] {
  return projects.filter((p) => {
    const matchesCategory = category === 'All' || p.category === category;
    if (!matchesCategory) return false;

    if (!search.trim()) return true;

    const q = search.toLowerCase();
    const text = `${p.title} ${p.description} ${p.category}`.toLowerCase();

    // Direct text match
    if (text.includes(q)) return true;

    // Special "react" fuzzy match for UI-related projects
    if (q === 'react' && text.match(/ui|module|state|rendering|service/)) return true;

    return false;
  });
}

/**
 * Extract unique categories from a project list, prefixed with "All".
 */
export function getCategories(projects: Project[]): string[] {
  const unique = [...new Set(projects.map((p) => p.category))];
  return ['All', ...unique];
}