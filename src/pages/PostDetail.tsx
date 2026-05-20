import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Clock, Share2, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useDocumentHead } from '../hooks/useDocumentHead';
import { useReadingProgress, estimateReadTime } from '../hooks/useReadingProgress';
import { ReadingProgressBar } from '../components/ReadingProgressBar';

interface BlogPost {
  title: string;
  content: string;
  summary: string;
  authorName: string;
  tags: string[];
  createdAt: any;
  status: string;
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Upgrade 4: reading progress
  const articleRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(articleRef);

  // Upgrade 1: dynamic head
  useDocumentHead({
    title: post?.title || 'Loading...',
    description: post?.summary || '',
    ogType: 'article',
    canonicalPath: `#/blog/${id}`,
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.summary,
          author: { '@type': 'Person', name: post.authorName },
          datePublished: post.createdAt?.seconds
            ? new Date(post.createdAt.seconds * 1000).toISOString()
            : undefined,
        }
      : undefined,
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as BlogPost;
          setPost(data);
        } else {
          // Fallback for seed articles (existing fallback data kept as-is)
          const fallbackData: Record<string, BlogPost> = {
            'modern-web-architecture': {
              title: 'Modern Web Architecture: Server Components vs. Client-side Hydration',
              summary: 'A deep dive into the trade-offs of using React Server Components.',
              content: `# Modern Web Architecture\n\nContent placeholder for the demo article...`,
              authorName: 'Senior Staff Engineer',
              tags: ['NextJS', 'SystemDesign', 'Frameworks'],
              createdAt: { seconds: Date.now() / 1000 },
              status: 'published'
            },
            // ... (other fallbacks remain unchanged)
          };

          if (fallbackData[id]) {
            setPost(fallbackData[id]);
          } else {
            navigate('/blog');
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const share = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!post) return null;

  // Upgrade 4: computed read time
  const readTime = estimateReadTime(post.content);

  return (
    <>
      {/* Upgrade 4: Reading progress bar */}
      <ReadingProgressBar progress={progress} />

      <div ref={articleRef} className="max-w-4xl mx-auto space-y-12 mb-20 pt-8">
        <button
          onClick={() => navigate('/#blog')}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-neutral-500 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span>Back to Guides</span>
        </button>

        <section className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-neutral-400 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span className="text-neutral-200">{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                {/* Upgrade 4: computed read time */}
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start space-x-4">
            <button onClick={() => share('twitter')} className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-neutral-400 hover:text-white transition-all" aria-label="Share on Twitter">
              <Twitter className="w-5 h-5" />
            </button>
            <button onClick={() => share('linkedin')} className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-neutral-400 hover:text-white transition-all" aria-label="Share on LinkedIn">
              <Linkedin className="w-5 h-5" />
            </button>
            <button onClick={() => share('copy')} className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-neutral-400 hover:text-white transition-all" aria-label="Copy link">
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
        </section>

        <div className="prose prose-invert prose-emerald max-w-none shadow-2xl p-8 md:p-12 bg-neutral-900/50 rounded-3xl border border-neutral-800 backdrop-blur-sm">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <section className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <h3 className="text-2xl font-bold">Enjoyed this article?</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Share it with your network or subscribe to get notified about future technical deep dives.
          </p>
          <div className="flex justify-center space-x-4">
             <button onClick={() => share('twitter')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                <Share2 className="w-4 h-4" /> Share Post
             </button>
          </div>
        </section>
      </div>
    </>
  );
}
