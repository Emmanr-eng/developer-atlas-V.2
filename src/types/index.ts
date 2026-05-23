// ═══════════════════════════════════════════════════
// Centralized type definitions for the entire app
// ═══════════════════════════════════════════════════

import { Timestamp } from 'firebase/firestore';

/** Firestore timestamp or fallback date string */
export type FirestoreDate = Timestamp | string | null;

/** Blog post entity */
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  authorId?: string;
  authorName: string;
  tags: string[];
  createdAt: FirestoreDate;
  updatedAt?: FirestoreDate;
  status: 'draft' | 'published';
}

/** Portfolio project entity */
export interface Project {
  id: string;
  title: string;
  description: string;
  codeSnippet: string;
  demoUrl: string;
  imageUrl: string;
  category: string;
  status: 'Stable' | 'Experimental' | 'Deprecated' | 'Online' | 'Approved Architecture';
  actionLabel?: string;
  actionUrl?: string;
  createdAt?: FirestoreDate;
  updatedAt?: FirestoreDate;
}

/** Contact inquiry entity */
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read';
  createdAt: FirestoreDate;
}

/** Bug timeline entry */
export interface BugEntry {
  id: string;
  bug: string;
  problem: string;
  problemCode: string;
  solution: string;
  solutionCode: string;
}

/** Admin post form shape (tags as comma string for editing) */
export interface PostFormData {
  title: string;
  summary: string;
  content: string;
  tags: string;
  status: string;
}

/** Admin project form shape */
export interface ProjectFormData {
  title: string;
  description: string;
  codeSnippet: string;
  demoUrl: string;
  imageUrl: string;
  category: string;
}

/** Async operation status */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';