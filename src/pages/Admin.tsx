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
      const [postsSnap, projectsSnap, inquiriesSnap] = await Promise.all([getDocs(postsQ), getDocs(projectsQ), getDocs(inquiriesQ)]);
      setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setProjects(projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setInquiries(inquiriesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) { handleFirestoreError(error, OperationType.LIST, 'admin-data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    try {
      const postData = { ...postForm, tags: postForm.tags.split(',').map(t => t.trim()).filter(t => t), authorId: user.uid, authorName: user.displayName, updatedAt: serverTimestamp() };
      if (editingId) { await updateDoc(doc(db, 'posts', editingId), postData); }
      else { await addDoc(collection(db, 'posts'), { ...postData, createdAt: serverTimestamp() }); }
      setPostForm({ title: '', summary: '', content: '', tags: '', status: 'draft' }); setEditingId(null); fetchData();
    } catch (error) { handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'posts'); }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    try {
      const projectData = { ...projectForm, authorId: user.uid, updatedAt: serverTimestamp() };
      if (editingId) { await updateDoc(doc(db, 'projects', editingId), projectData); }
      else { await addDoc(collection(db, 'projects'), { ...projectData, createdAt: serverTimestamp() }); }
      setProjectForm({ title: '', description: '', codeSnippet: '', demoUrl: '', imageUrl: '', category: '' }); setEditingId(null); fetchData();
    } catch (error) { handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'projects'); }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    if (!db) return;
    try { await deleteDoc(doc(db, coll, id)); fetchData(); }
    catch (error) { handleFirestoreError(error, OperationType.DELETE, `${coll}/${id}`); }
  };

  if (loading) return (<div className="flex items-center justify-center min-h-[40vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 shadow-[0_0_16px_rgba(16,185,129,0.2)]"></div></div>);

  const glassInputClass = "w-full px-4 py-3 glass-input text-sm outline-none placeholder:text-slate-400";

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center p-8 glass" style={{ borderRadius: '28px' }}>
        <div className="space-y-1">
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
           <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Hello, {user?.displayName}</p>
        </div>
        <div className="flex space-x-2">
           {(['posts', 'projects', 'inquiries'] as const).map(tab => {
             const icons = { posts: FileText, projects: Code, inquiries: Mail };
             const Icon = icons[tab];
             return (
               <button key={tab}
                 onClick={() => { setActiveTab(tab); setEditingId(null); }}
                 className={cn(
                   "px-4 py-2 text-sm font-bold flex items-center gap-2 relative transition-all",
                   activeTab === tab ? "text-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.10)]" : "text-slate-400 hover:text-slate-900"
                 )}
                 style={{
                   background: activeTab === tab ? 'rgba(99, 102, 241, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                   backdropFilter: 'blur(8px)',
                   border: activeTab === tab ? '1px solid rgba(99, 102, 241, 0.20)' : '1px solid rgba(0, 0, 0, 0.06)',
                   borderRadius: '16px',
                 }}
               >
                 <Icon className="w-4 h-4" /> {tab.charAt(0).toUpperCase() + tab.slice(1)}
                 {tab === 'inquiries' && inquiries.filter(i => i.status === 'new').length > 0 && (
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.3)]">
                     {inquiries.filter(i => i.status === 'new').length}
                   </span>
                 )}
               </button>
             );
           })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Management List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold px-2 flex items-center gap-2 text-slate-900">
             {activeTab === 'posts' && <><FileText className="w-5 h-5" /> Blog Posts</>}
             {activeTab === 'projects' && <><Code className="w-5 h-5" /> Portfolio Projects</>}
             {activeTab === 'inquiries' && <><Mail className="w-5 h-5" /> Contact Inquiries</>}
          </h2>

          <div className="overflow-hidden glass" style={{ borderRadius: '28px' }}>
            {activeTab === 'posts' && posts.map(post => (
              <div key={post.id} className="p-6 border-b border-black/6 last:border-0 flex justify-between items-center group hover:bg-black/2 transition-colors">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">{post.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded-full font-bold backdrop-blur-sm"
                      style={{ background: post.status === 'published' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', color: post.status === 'published' ? 'rgb(5,150,105)' : 'rgb(217,119,6)' }}>
                      {post.status}
                    </span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => { setPostForm(post); setEditingId(post.id); }} className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete('posts', post.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === 'projects' && projects.map(proj => (
              <div key={proj.id} className="p-6 border-b border-black/6 last:border-0 flex justify-between items-center group hover:bg-black/2 transition-colors">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded-full font-bold backdrop-blur-sm" style={{ background: 'rgba(99,102,241,0.08)', color: 'rgb(79,70,229)' }}>{proj.category}</span>
                    <span>{formatDate(proj.createdAt)}</span>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => { setProjectForm(proj); setEditingId(proj.id); }} className="p-2 hover:bg-indigo-500/10 text-indigo-600 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete('projects', proj.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === 'inquiries' && inquiries.map(inq => (
              <div key={inq.id} className="p-6 border-b border-black/6 last:border-0 hover:bg-black/2 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900">{inq.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium">{inq.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm"
                    style={{ background: inq.status === 'new' ? 'rgba(239,68,68,0.08)' : 'rgba(0,0,0,0.03)', color: inq.status === 'new' ? 'rgb(220,38,38)' : 'rgb(148,163,184)' }}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 italic mb-4">"{inq.message}"</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">{formatDate(inq.createdAt)}</span>
                  <div className="flex space-x-2">
                    {inq.status === 'new' && (
                      <button onClick={async () => { if (!db) return; await updateDoc(doc(db, 'inquiries', inq.id), { status: 'read' }); fetchData(); }}
                        className="p-1 hover:bg-emerald-500/10 text-emerald-600 rounded transition-colors" title="Mark as Read">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete('inquiries', inq.id)} className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
            
            {(activeTab === 'posts' ? posts : activeTab === 'projects' ? projects : inquiries).length === 0 && (
              <div className="p-20 text-center text-slate-400 italic text-sm">No items found.</div>
            )}
          </div>
        </div>

        {/* Editor Side */}
        <div className="lg:col-span-1">
          {activeTab !== 'inquiries' && (
            <div className="p-8 h-fit sticky top-28 glass" style={{ borderRadius: '28px' }}>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-900">
                {editingId ? <><Edit2 className="w-5 h-5 text-amber-500" /> Edit {activeTab === 'posts' ? 'Post' : 'Project'}</> : <><Plus className="w-5 h-5 text-indigo-600" /> New {activeTab === 'posts' ? 'Post' : 'Project'}</>}
              </h3>

              {activeTab === 'posts' ? (
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</label>
                    <input required value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} className={glassInputClass} style={{ borderRadius: '16px' }} placeholder="Post title" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Summary</label>
                    <textarea value={postForm.summary} onChange={e => setPostForm({...postForm, summary: e.target.value})} className={`${glassInputClass} resize-none`} style={{ borderRadius: '16px' }} rows={2} placeholder="Brief summary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Content (Markdown)</label>
                    <textarea required value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} className={`${glassInputClass} resize-none font-mono text-xs`} style={{ borderRadius: '16px' }} rows={8} placeholder="Write in Markdown..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tags (comma separated)</label>
                      <input value={postForm.tags} onChange={e => setPostForm({...postForm, tags: e.target.value})} className={glassInputClass} style={{ borderRadius: '16px' }} placeholder="React, TypeScript" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
                      <select value={postForm.status} onChange={e => setPostForm({...postForm, status: e.target.value})} className={glassInputClass} style={{ borderRadius: '16px' }}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="grow py-3 bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]" style={{ borderRadius: '16px' }}>
                      <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Create'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={() => setEditingId(null)} className="p-3 glass-btn text-slate-400 hover:text-slate-900" style={{ borderRadius: '16px' }}>
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</label>
                    <input required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className={glassInputClass} style={{ borderRadius: '16px' }} placeholder="Project title" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                    <textarea required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className={`${glassInputClass} resize-none`} style={{ borderRadius: '16px' }} rows={3} placeholder="Project description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                      <input required value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className={glassInputClass} style={{ borderRadius: '16px' }} placeholder="e.g. Frontend" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Demo URL</label>
                      <input value={projectForm.demoUrl} onChange={e => setProjectForm({...projectForm, demoUrl: e.target.value})} className={glassInputClass} style={{ borderRadius: '16px' }} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Image URL</label>
                    <input value={projectForm.imageUrl} onChange={e => setProjectForm({...projectForm, imageUrl: e.target.value})} className={glassInputClass} style={{ borderRadius: '16px' }} placeholder="https://..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Code Snippet</label>
                    <textarea value={projectForm.codeSnippet} onChange={e => setProjectForm({...projectForm, codeSnippet: e.target.value})} className={`${glassInputClass} resize-none font-mono text-xs`} style={{ borderRadius: '16px' }} rows={4} placeholder="Code example..." />
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="grow py-3 bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]" style={{ borderRadius: '16px' }}>
                      <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Create'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={() => setEditingId(null)} className="p-3 glass-btn text-slate-400 hover:text-slate-900" style={{ borderRadius: '16px' }}>
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
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