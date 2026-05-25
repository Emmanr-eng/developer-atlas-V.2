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

  const articleRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(articleRef);

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
      if (!db) {
        navigate('/blog');
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as BlogPost;
          setPost(data);
        } else {
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
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-400" />
        Loading article
      </div>
    </div>
  );

  if (!post) return null;

  const readTime = estimateReadTime(post.content);

  return (
    <>
      <ReadingProgressBar progress={progress} />

      <div ref={articleRef} className="mx-auto mb-20 max-w-4xl space-y-12 pt-8">
        <button
          onClick={() => navigate('/#blog')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to guides</span>
        </button>

        <section className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 md:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{post.title}</h1>
              <p className="text-base leading-8 text-slate-600 dark:text-slate-300">{post.summary}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-start gap-3">
            <button onClick={() => share('twitter')} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300">
              <Twitter className="h-5 w-5" />
            </button>
            <button onClick={() => share('linkedin')} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300">
              <Linkedin className="h-5 w-5" />
            </button>
            <button onClick={() => share('copy')} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white">
              <LinkIcon className="h-5 w-5" />
            </button>
          </div>
        </section>

        <div className="prose prose-slate max-w-none rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-900/5 dark:prose-invert dark:border-slate-800 dark:bg-slate-900 md:p-12
                        prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 dark:prose-headings:text-white
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-300
                        prose-strong:text-slate-950 dark:prose-strong:text-white
                        prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-indigo-600 dark:prose-code:bg-slate-800 dark:prose-code:text-indigo-300
                        prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-950 dark:prose-pre:border-slate-700">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Enjoyed this article?</h3>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
            Share it with your network or save it as a reference for future architecture conversations.
          </p>
          <div className="mt-8 flex justify-center">
            <button onClick={() => share('twitter')} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500">
              <Share2 className="h-4 w-4" />
              Share post
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
