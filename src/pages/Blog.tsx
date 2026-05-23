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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Insights</h1>
          <p className="text-neutral-500 max-w-2xl text-sm leading-relaxed">
            Exploring software design patterns, fullstack engineering, and modern web architectures.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm placeholder:text-neutral-300 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.article
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="border border-neutral-200 rounded-xl p-6 group h-full flex flex-col hover:border-neutral-300 transition-colors bg-white"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-4">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {tag}
                    </span>
                  ))}
                  <div className="h-3 w-px bg-neutral-200" />
                  <span className="text-[10px] font-medium text-neutral-400">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight mb-3 text-neutral-900 group-hover:text-neutral-600 transition-colors leading-snug">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                
                <p className="text-sm text-neutral-500 mb-6 grow leading-relaxed line-clamp-2">
                  {post.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center font-medium text-[10px] text-neutral-600">
                      {post.authorName.charAt(0)}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500">{post.authorName}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
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
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center py-16 border border-neutral-200 rounded-xl relative">
            <Rss className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Insights Found</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">Your search did not return any results. Try a suggested topic below.</p>
            
            <button className="bg-neutral-900 text-white px-6 py-2.5 rounded-lg font-medium text-xs hover:bg-neutral-800 transition-colors">
              Request an Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Suggested Topics</h4>
              <div className="grid grid-cols-2 gap-2">
                {['React', 'Node.js', 'Junior Experience', 'Microservices', 'TypeScript', 'Serverless'].map(topic => (
                  <button 
                    key={topic} 
                    onClick={() => setSearch(topic)}
                    className="p-3 rounded-lg border border-neutral-200 text-left hover:border-neutral-300 transition-colors group"
                  >
                    <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-900">{topic}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Trending</h4>
              <div className="space-y-3">
                {posts.slice(0, 3).map((post, i) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-lg font-semibold text-neutral-200 group-hover:text-neutral-400 transition-colors">0{i+1}</span>
                    <div className="grow">
                      <h5 className="text-xs font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors leading-snug">{post.title}</h5>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transform group-hover:translate-x-0.5 transition-all" />
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
