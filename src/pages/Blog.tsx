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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="pixel-heading text-[10px] text-arcade-purple coin-blink">LOADING INSIGHTS...</div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="pixel-heading text-xl neon-magenta leading-relaxed">INSIGHTS</h1>
          <p className="text-[#2a2a4a] max-w-2xl text-xs leading-relaxed font-mono">
            Exploring software design patterns, fullstack engineering, and modern web architectures.
          </p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2a2a4a]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#12121f] border-2 border-[#2a2a4a] focus:outline-none focus:border-arcade-magenta/50 text-xs font-mono font-bold text-arcade-magenta placeholder:text-[#2a2a4a]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.article
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bento-card group h-full flex flex-col hover:border-arcade-magenta/40"
              style={{ transition: 'box-shadow 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 170, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-6">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[7px] font-mono font-bold uppercase tracking-[0.2em] text-arcade-magenta bg-arcade-magenta/10 px-2 py-0.5 rounded border border-arcade-magenta/20">
                      {tag}
                    </span>
                  ))}
                  <div className="h-3 w-px bg-[#2a2a4a]" />
                  <span className="text-[7px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <h2 className="text-lg font-bold tracking-tight mb-4 group-hover:text-arcade-magenta transition-colors leading-tight font-mono">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-[#2a2a4a] mb-8 grow leading-relaxed line-clamp-2 font-mono">
                  {post.summary}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-[#2a2a4a]/30 mt-auto">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#1a1a2e] border border-[#2a2a4a] flex items-center justify-center font-mono font-bold text-[10px] text-arcade-purple">
                      {post.authorName.charAt(0)}
                    </div>
                    <span className="text-[8px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest">{post.authorName}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-2 text-[9px] font-mono font-bold uppercase tracking-widest text-arcade-cyan hover:text-arcade-magenta transition-colors"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center py-20 bg-[#12121f] border-2 border-[#2a2a4a] rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-arcade-magenta/5 to-transparent pointer-events-none" />
            <Rss className="w-16 h-16 text-arcade-magenta/20 mx-auto mb-6 coin-blink" />
            <h3 className="pixel-heading text-sm text-white mb-4 leading-relaxed">NO INSIGHTS FOUND</h3>
            <p className="text-[#2a2a4a] text-xs max-w-md mx-auto mb-8 font-mono">Your search query did not return any architectural nodes.</p>

            <button className="arcade-btn bg-arcade-magenta border-[#cc0088] text-white text-[8px]">
              Request an Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">SUGGESTED TOPICS</h4>
              <div className="grid grid-cols-2 gap-3">
                {['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSearch(topic)}
                    className="p-4 rounded-lg bg-[#0a0a12] border border-[#2a2a4a] text-left hover:border-arcade-magenta/50 transition-all group"
                  >
                    <span className="text-xs font-mono font-bold text-[#2a2a4a] group-hover:text-arcade-magenta">{topic}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">TRENDING INSIGHTS</h4>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="flex items-center gap-4 group"
                  >
                    <span className="pixel-heading text-lg text-[#2a2a4a]/30 group-hover:text-arcade-magenta/30 transition-colors leading-relaxed">0{i+1}</span>
                    <div className="grow">
                      <h5 className="text-[10px] font-mono font-bold text-[#2a2a4a] uppercase tracking-tight group-hover:text-white transition-colors">{post.title}</h5>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#2a2a4a] group-hover:text-arcade-magenta transform group-hover:translate-x-1 transition-all" />
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