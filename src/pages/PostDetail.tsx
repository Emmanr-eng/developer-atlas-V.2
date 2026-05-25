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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="pixel-heading text-[10px] text-arcade-purple coin-blink">LOADING ARTICLE...</div>
    </div>
  );

  if (!post) return null;

  const readTime = estimateReadTime(post.content);

  return (
    <>
      <ReadingProgressBar progress={progress} />

      <div ref={articleRef} className="max-w-4xl mx-auto space-y-12 mb-20 pt-8">
        <button
          onClick={() => navigate('/#blog')}
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#2a2a4a] hover:text-arcade-cyan transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span>Back to Guides</span>
        </button>

        <section className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-arcade-magenta/10 text-arcade-magenta text-[8px] font-mono font-bold uppercase tracking-widest rounded-lg border border-arcade-magenta/20">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="pixel-heading text-lg md:text-2xl text-white leading-relaxed">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[#2a2a4a] text-[8px] font-mono font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-arcade-purple" />
                <span className="text-neutral-200">{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-arcade-cyan" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-arcade-yellow" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start space-x-4">
            <button onClick={() => share('twitter')} className="p-3 rounded-lg bg-[#12121f] border-2 border-[#2a2a4a] hover:border-arcade-cyan/50 text-[#2a2a4a] hover:text-arcade-cyan transition-all">
              <Twitter className="w-5 h-5" />
            </button>
            <button onClick={() => share('linkedin')} className="p-3 rounded-lg bg-[#12121f] border-2 border-[#2a2a4a] hover:border-arcade-purple/50 text-[#2a2a4a] hover:text-arcade-purple transition-all">
              <Linkedin className="w-5 h-5" />
            </button>
            <button onClick={() => share('copy')} className="p-3 rounded-lg bg-[#12121f] border-2 border-[#2a2a4a] hover:border-arcade-magenta/50 text-[#2a2a4a] hover:text-arcade-magenta transition-all">
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
        </section>

        <div className="prose prose-invert max-w-none p-8 md:p-12 bg-[#12121f] rounded-xl border-2 border-[#2a2a4a] backdrop-blur-sm
                        prose-headings:font-mono prose-headings:text-arcade-cyan
                        prose-a:text-arcade-magenta prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-arcade-yellow
                        prose-code:text-arcade-green prose-code:bg-[#0a0a12] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-[#0a0a12] prose-pre:border-2 prose-pre:border-[#2a2a4a] prose-pre:rounded-xl"
             style={{ boxShadow: '0 0 40px rgba(0, 240, 255, 0.03)' }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <section className="bg-[#12121f] p-12 rounded-xl border-2 border-[#2a2a4a] text-center space-y-6"
                 style={{ boxShadow: '0 0 30px rgba(255, 0, 170, 0.05)' }}>
          <h3 className="pixel-heading text-sm text-white leading-relaxed">ENJOYED THIS ARTICLE?</h3>
          <p className="text-[#2a2a4a] max-w-md mx-auto font-mono text-xs">
            Share it with your network or subscribe to get notified about future technical deep dives.
          </p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => share('twitter')} className="arcade-btn bg-arcade-magenta border-[#cc0088] text-white text-[8px] flex items-center gap-2"
                    style={{ boxShadow: '0 0 15px rgba(255, 0, 170, 0.3), 0 3px 0 #cc0088' }}>
              <Share2 className="w-4 h-4" /> SHARE POST
            </button>
          </div>
        </section>
      </div>
    </>
  );
}