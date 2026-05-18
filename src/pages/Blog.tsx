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
          // Static seed articles for the Atlas Portal
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter">Insights</h1>
          <p className="text-neutral-400 max-w-2xl text-sm leading-relaxed">
            Exploring software design patterns, fullstack engineering, and modern web architectures.
          </p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 focus:outline-none focus:border-emerald-500/50 text-[10px] font-bold uppercase tracking-widest placeholder:text-neutral-600 transition-all font-mono"
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
              className="bento-card group h-full flex flex-col"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-6">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                      {tag}
                    </span>
                  ))}
                  <div className="h-3 w-px bg-neutral-700" />
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-emerald-400 transition-colors leading-tight">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                
                <p className="text-sm text-neutral-400 mb-8 grow leading-relaxed line-clamp-2">
                  {post.summary}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-neutral-700/30 mt-auto">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-[10px] text-neutral-300">
                      {post.authorName.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{post.authorName}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center py-20 bg-neutral-900/50 border border-neutral-800 rounded-4xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            <Rss className="w-16 h-16 text-emerald-500/20 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">No Insights Found</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8 font-medium">Your search query did not return any architectural nodes. Try one of our suggested topics below.</p>
            
            <button className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform">
              Request an Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Suggested Topics</h4>
              <div className="grid grid-cols-2 gap-3">
                {['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'].map(topic => (
                  <button 
                    key={topic} 
                    onClick={() => setSearch(topic)}
                    className="p-4 rounded-2xl bg-neutral-800/30 border border-neutral-800 text-left hover:border-emerald-500/50 hover:bg-neutral-800/50 transition-all group"
                  >
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-emerald-400">{topic}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Trending Insights</h4>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post, i) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.id}`}
                    className="flex items-center gap-4 group"
                  >
                    <span className="text-2xl font-black text-neutral-800 group-hover:text-emerald-500/20 transition-colors uppercase italic">0{i+1}</span>
                    <div className="grow">
                      <h5 className="text-[11px] font-black text-neutral-300 uppercase italic tracking-tight group-hover:text-white transition-colors">{post.title}</h5>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
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
