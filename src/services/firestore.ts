// ═══════════════════════════════════════════════════
// Centralized Firestore CRUD service.
// Replaces raw Firestore calls scattered across
// Admin, Blog, Portfolio, Contact, and PostDetail.
// ═══════════════════════════════════════════════════

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';

// ── helpers ──────────────────────────────────────

function mapDocs<T>(snapshot: { docs: Array<{ id: string; data: () => DocumentData }> }): T[] {
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

function ensureDb() {
  if (!db) throw new Error('Firestore is not initialized');
  return db;
}

// ── generic queries ──────────────────────────────

export async function fetchCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
): Promise<T[]> {
  const database = ensureDb();
  const q = query(collection(database, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return mapDocs<T>(snapshot);
}

export async function fetchDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const database = ensureDb();
  const snap = await getDoc(doc(database, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

// ── posts ────────────────────────────────────────

export async function fetchPublishedPosts<T>(): Promise<T[]> {
  return fetchCollection<T>('posts', [
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
  ]);
}

export async function fetchAllPosts<T>(): Promise<T[]> {
  return fetchCollection<T>('posts', [orderBy('createdAt', 'desc')]);
}

export async function fetchPostById<T>(id: string): Promise<T | null> {
  return fetchDocument<T>('posts', id);
}

// ── projects ─────────────────────────────────────

export async function fetchProjects<T>(): Promise<T[]> {
  return fetchCollection<T>('projects', [orderBy('createdAt', 'desc')]);
}

// ── inquiries ────────────────────────────────────

export async function fetchInquiries<T>(): Promise<T[]> {
  return fetchCollection<T>('inquiries', [orderBy('createdAt', 'desc')]);
}

export async function createInquiry(data: { name: string; email: string; message: string }) {
  const database = ensureDb();
  return addDoc(collection(database, 'inquiries'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export async function markInquiryRead(id: string) {
  const database = ensureDb();
  return updateDoc(doc(database, 'inquiries', id), { status: 'read' });
}

// ── generic CRUD ─────────────────────────────────

export async function createDocument(collectionName: string, data: Record<string, unknown>) {
  const database = ensureDb();
  return addDoc(collection(database, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDocument(collectionName: string, id: string, data: Record<string, unknown>) {
  const database = ensureDb();
  return updateDoc(doc(database, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, id: string) {
  const database = ensureDb();
  return deleteDoc(doc(database, collectionName, id));
}

// ── error wrapper ────────────────────────────────

export { OperationType, handleFirestoreError } from '../lib/firebase';