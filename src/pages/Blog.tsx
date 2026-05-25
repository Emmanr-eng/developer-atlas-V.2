import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Tag, Search, ArrowRight, Rss } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  tags: string[];
  createdAt: any;
  status: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!db) throw new Error('Database not initialized');
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));

        if (fetched.length > 0) {
          setPosts(fetched);
        } else {
          setPosts([
            {
              id: 'modern-web-architecture',
              title: 'Modern Web Architecture: Server Components vs. Client-side Hydration',
              summary: 'A deep dive into the trade-offs of using React Server Components to reduce client-side overhead while maintaining interactivity in high-scale dashboards.',
              authorName: 'Senior Staff Engineer',
              tags: ['NextJS', 'SystemDesign', 'Frameworks'],
              createdAt: { seconds: Date.now() / 1000 },
              status: 'published'
            },
            {
              id: 'outbox-pattern',
              title: 'Scaling Reliability: The Outbox Pattern in Microservices',
              summary: 'How to ensure data consistency across distributed boundaries by using the Outbox Pattern for atomic state changes and reliable event publishing.',
              authorName: 'Senior Staff Engineer',
              tags: ['Patterns', 'Microservices', 'SystemDesign'],
              createdAt: { seconds: Date.now() / 1000 - 3600 },
              status: 'published'
            },
            {
              id: 'fcp-performance',
              title: 'Fullstack Performance: Strategies for Reducing FCP',
              summary: 'Advanced techniques for optimizing First Contentful Paint in Next.js environments, focusing on edge caching and asset prioritization.',
              authorName: 'Senior Staff Engineer',
              tags: ['NextJS', 'Performance', 'Vitals'],
              createdAt: { seconds: Date.now() / 1000 - 7200 },
              status: 'published'
            },
            {
              id: 'knowledge-scraper',
              title: 'The Knowledge Scraper: Automating Insight Bridges',
              summary: 'A technical overview of building an automated Python bridge to scrape engineering blogs.',
              authorName: 'Atlas Systems',
              tags: ['Python', 'Automation', 'Data'],
              createdAt: { seconds: Date.now() / 1000 - 10800 },
              status: 'published'
            },
            {
              id: 'atlas-prompt-primitives',
              title: 'Engineering Efficiency: The Atlas Prompt Primitives',
              summary: 'A collections of specialized prompts used to automate content, UI redesigns, and knowledge scraping within the Atlas portal.',
              authorName: 'Developer Relations',
              tags: ['AI', 'PromptEngineering', 'Efficiency'],
              createdAt: { seconds: Date.now() / 1000 - 14400 },
              status: 'published'
            },
            {
              id: 'junior-dev-growth',
              title: 'The Junior Experience: Accelerated Growth in the Atlas Ecosystem',
              summary: 'Essential strategies for early-career engineers to navigate complex architectural landscapes and maximize their learning velocity.',
              authorName: 'Engineering Mentor',
              tags: ['Career', 'JuniorDev', 'Growth'],
              createdAt: { seconds: Date.now() / 1000 - 18000 },
              status: 'published'
            }
          ]);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.summary.toLowerCase().includes(search.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-400" />
        Loading articles
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-4">
          <div className="section-kicker">Writing</div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">Technical writing on product architecture, systems thinking, and modern web engineering.</h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            A collection of articles that turn implementation details into reusable product and engineering insight.
          </p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" />
          <input
            type="text"
            placeholder="Search articles"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.article
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-900/8 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30 dark:hover:shadow-black/25"
            >
              <div className="flex h-full flex-col">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                      {tag}
                    </span>
                  ))}
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-slate-950 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>

                <p className="mt-4 grow text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {post.summary}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {post.authorName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{post.authorName}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 transition-colors hover:text-indigo-600 dark:text-blue-300 dark:hover:text-indigo-300"
                  >
                    <span>Read article</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/90 px-6 py-20 text-center shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900/90">
            <Rss className="mx-auto mb-6 h-14 w-14 text-slate-300 dark:text-slate-600" />
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">No articles match your search</h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">Try a broader topic or browse the suggested areas below.</p>

            <button className="mt-8 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500">
              Request an article
            </button>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Suggested topics</h4>
              <div className="grid grid-cols-2 gap-3">
                {['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSearch(topic)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-indigo-300"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Trending insights</h4>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-white/70 dark:hover:border-slate-800 dark:hover:bg-slate-900/60"
                  >
                    <span className="text-3xl font-semibold tracking-tight text-slate-300 dark:text-slate-700">0{i+1}</span>
                    <div className="grow">
                      <h5 className="text-sm font-semibold text-slate-700 transition-colors group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white">{post.title}</h5>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
