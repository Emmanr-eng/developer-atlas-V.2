import React, { useEffect, useState } from 'react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, Code, Mail, Plus, Trash2, Edit2, CheckCircle, XCircle, ChevronRight, Save, Eye } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'inquiries'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [postForm, setPostForm] = useState({ title: '', summary: '', content: '', tags: '', status: 'draft' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', codeSnippet: '', demoUrl: '', imageUrl: '', category: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!db) return;
      const postsQ = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const projectsQ = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const inquiriesQ = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));

      const [postsSnap, projectsSnap, inquiriesSnap] = await Promise.all([
        getDocs(postsQ),
        getDocs(projectsQ),
        getDocs(inquiriesQ)
      ]);

      setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setProjects(projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setInquiries(inquiriesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'admin-data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    try {
      const postData = {
        ...postForm,
        tags: postForm.tags.split(',').map(t => t.trim()).filter(t => t),
        authorId: user.uid,
        authorName: user.displayName,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'posts', editingId), postData);
      } else {
        await addDoc(collection(db, 'posts'), { ...postData, createdAt: serverTimestamp() });
      }

      setPostForm({ title: '', summary: '', content: '', tags: '', status: 'draft' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'posts');
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    try {
      const projectData = {
        ...projectForm,
        authorId: user.uid,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
      } else {
        await addDoc(collection(db, 'projects'), { ...projectData, createdAt: serverTimestamp() });
      }

      setProjectForm({ title: '', description: '', codeSnippet: '', demoUrl: '', imageUrl: '', category: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    if (!db) return;
    try {
      await deleteDoc(doc(db, coll, id));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${coll}/${id}`);
    }
  };

  if (loading) return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" />
        Loading admin
      </div>
    </div>
  );

  const listItems = activeTab === 'posts' ? posts : activeTab === 'projects' ? projects : inquiries;

  return (
    <div className="space-y-10 pb-20">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="section-kicker">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin dashboard
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Content operations</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Manage posts, projects, and inbound inquiries from a unified workspace. Hello, {user?.displayName}.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveTab('posts'); setEditingId(null); }}
              className={cn(
                'rounded-full border px-4 py-2.5 text-sm font-medium transition-all',
                activeTab === 'posts'
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              )}
            >
              <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4" /> Posts</span>
            </button>
            <button
              onClick={() => { setActiveTab('projects'); setEditingId(null); }}
              className={cn(
                'rounded-full border px-4 py-2.5 text-sm font-medium transition-all',
                activeTab === 'projects'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              )}
            >
              <span className="inline-flex items-center gap-2"><Code className="h-4 w-4" /> Projects</span>
            </button>
            <button
              onClick={() => { setActiveTab('inquiries'); setEditingId(null); }}
              className={cn(
                'relative rounded-full border px-4 py-2.5 text-sm font-medium transition-all',
                activeTab === 'inquiries'
                  ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              )}
            >
              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Inquiries</span>
              {inquiries.filter(i => i.status === 'new').length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                  {inquiries.filter(i => i.status === 'new').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800 md:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Current view</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {activeTab === 'posts' && 'Blog posts'}
                  {activeTab === 'projects' && 'Portfolio projects'}
                  {activeTab === 'inquiries' && 'Contact inquiries'}
                </h2>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {activeTab === 'posts' && posts.map(post => (
                <div key={post.id} className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50/80 dark:hover:bg-slate-950/40 md:flex-row md:items-center md:justify-between md:px-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className={cn(
                        'rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                        post.status === 'published'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                          : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300'
                      )}>
                        {post.status}
                      </span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                    <button onClick={() => { setPostForm(post); setEditingId(post.id); }} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:text-indigo-300"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete('posts', post.id)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}

              {activeTab === 'projects' && projects.map(proj => (
                <div key={proj.id} className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50/80 dark:hover:bg-slate-950/40 md:flex-row md:items-center md:justify-between md:px-8">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{proj.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">{proj.category}</span>
                      <span>{formatDate(proj.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                    <button onClick={() => { setProjectForm(proj); setEditingId(proj.id); }} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:text-blue-300"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete('projects', proj.id)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}

              {activeTab === 'inquiries' && inquiries.map(inq => (
                <div key={inq.id} className="space-y-4 px-6 py-5 transition hover:bg-slate-50/80 dark:hover:bg-slate-950/40 md:px-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{inq.name}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-300">{inq.email}</p>
                    </div>
                    <span className={cn(
                      'inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                      inq.status === 'new'
                        ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    )}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">“{inq.message}”</p>
                  <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
                    <span>{formatDate(inq.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      {inq.status === 'new' && (
                        <button
                          onClick={async () => {
                            if (!db) return;
                            const ref = doc(db, 'inquiries', inq.id);
                            await updateDoc(ref, { status: 'read' });
                            fetchData();
                          }}
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500/30 dark:hover:text-emerald-300"
                          title="Mark as Read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete('inquiries', inq.id)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}

              {listItems.length === 0 && (
                <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400 md:px-8">
                  No items found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1">
          {activeTab !== 'inquiries' && (
            <div className="sticky top-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 md:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-2xl',
                  editingId ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                )}>
                  {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Editor</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {editingId ? `Edit ${activeTab === 'posts' ? 'post' : 'project'}` : `New ${activeTab === 'posts' ? 'post' : 'project'}`}
                  </h3>
                </div>
              </div>

              {activeTab === 'posts' ? (
                <form onSubmit={handlePostSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Title</label>
                    <input required value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Summary</label>
                    <textarea value={postForm.summary} onChange={e => setPostForm({...postForm, summary: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/10" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Content (Markdown)</label>
                    <textarea required value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/10" rows={8} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Tags</label>
                      <input value={postForm.tags} onChange={e => setPostForm({...postForm, tags: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Status</label>
                      <select value={postForm.status} onChange={e => setPostForm({...postForm, status: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/10">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="inline-flex grow items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-500">
                      <Save className="h-4 w-4" /> {editingId ? 'Update' : 'Create'}
                    </button>
                    {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-500 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:text-red-300"><XCircle className="h-5 w-5" /></button>}
                  </div>
                </form>
              ) : (
                <form onSubmit={handleProjectSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Title</label>
                    <input required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Description</label>
                    <textarea required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10" rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Category</label>
                      <input required value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Demo URL</label>
                      <input value={projectForm.demoUrl} onChange={e => setProjectForm({...projectForm, demoUrl: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Image URL</label>
                    <input value={projectForm.imageUrl} onChange={e => setProjectForm({...projectForm, imageUrl: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Code Snippet</label>
                    <textarea value={projectForm.codeSnippet} onChange={e => setProjectForm({...projectForm, codeSnippet: e.target.value})} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10" rows={4} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="inline-flex grow items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500">
                      <Save className="h-4 w-4" /> {editingId ? 'Update' : 'Create'}
                    </button>
                    {editingId && <button type="button" onClick={() => setEditingId(null)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-500 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:text-red-300"><XCircle className="h-5 w-5" /></button>}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
