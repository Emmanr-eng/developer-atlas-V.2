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
          navigate('/blog');
        }
      } catch (error) {
        handleFirestoreError(OperationType.READ, error);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const readTime = estimateReadTime(post.content);
  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(post.title);

  return (
    <>
      <ReadingProgressBar progress={progress} />
      <motion.article
        ref={articleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 py-12"
      >
        <Link to="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <User size={14} /> {post.authorName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {readTime} min read
          </span>
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none mb-12">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="flex items-center gap-4 border-t border-gray-700 pt-6">
          <Share2 size={16} className="text-gray-400" />
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400"
          >
            <Twitter size={18} />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400"
          >
            <Linkedin size={18} />
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="text-gray-400 hover:text-blue-400"
          >
            <LinkIcon size={18} />
          </button>
        </div>
      </motion.article>
    </>
  );
}
