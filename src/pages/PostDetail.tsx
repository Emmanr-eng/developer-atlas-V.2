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
          
