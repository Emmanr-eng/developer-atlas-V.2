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
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="pixel-heading text-[10px] text-arcade-purple coin-blink">LOADING ADMIN...</div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#12121f] p-8 rounded-xl border-2 border-[#2a2a4a]"
           style={{ boxShadow: '0 0 30px rgba(180, 74, 255, 0.05)' }}>
        <div className="space-y-1">
          <h1 className="pixel-heading text-sm neon-cyan leading-relaxed">ADMIN DASHBOARD</h1>
          <p className="text-[8px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest">Hello, {user?.displayName}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => { setActiveTab('posts'); setEditingId(null); }}
            className={cn(
              "px-4 py-2.5 rounded-lg text-[8px] font-mono font-bold flex items-center gap-2 border-2 transition-all",
              activeTab === 'posts'
                ? "bg-arcade-purple border-arcade-purple text-white shadow-[0_0_15px_rgba(180,74,255,0.3)]"
                : "border-[#2a2a4a] text-[#2a2a4a] hover:text-arcade-purple hover:border-arcade-purple/50"
            )}
          >
            <FileText className="w-4 h-4" /> Posts
          </button>
          <button
            onClick={() => { setActiveTab('projects'); setEditingId(null); }}
            className={cn(
              "px-4 py-2.5 rounded-lg text-[8px] font-mono font-bold flex items-center gap-2 border-2 transition-all",
              activeTab === 'projects'
                ? "bg-arcade-cyan border-arcade-cyan text-[#0a0a12] shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "border-[#2a2a4a] text-[#2a2a4a] hover:text-arcade-cyan hover:border-arcade-cyan/50"
            )}
          >
            <Code className="w-4 h-4" /> Projects
          </button>
          <button
            onClick={() => { setActiveTab('inquiries'); setEditingId(null); }}
            className={cn(
              "px-4 py-2.5 rounded-lg text-[8px] font-mono font-bold flex items-center gap-2 border-2 transition-all relative",
              activeTab === 'inquiries'
                ? "bg-arcade-yellow border-arcade-yellow text-[#0a0a12] shadow-[0_0_15px_rgba(255,230,0,0.3)]"
                : "border-[#2a2a4a] text-[#2a2a4a] hover:text-arcade-yellow hover:border-arcade-yellow/50"
            )}
          >
            <Mail className="w-4 h-4" />
            Inquiries
            {inquiries.filter(i => i.status === 'new').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-arcade-red text-white rounded-full pixel-heading text-[5px] flex items-center justify-center leading-none border-2 border-[#0a0a12]">
                {inquiries.filter(i => i.status === 'new').length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Management List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="pixel-heading text-[9px] text-[#2a2a4a] px-2 flex items-center gap-2 leading-relaxed">
            {activeTab === 'posts' && <><FileText className="w-5 h-5 text-arcade-purple" /> BLOG POSTS</>}
            {activeTab === 'projects' && <><Code className="w-5 h-5 text-arcade-cyan" /> PORTFOLIO PROJECTS</>}
            {activeTab === 'inquiries' && <><Mail className="w-5 h-5 text-arcade-yellow" /> CONTACT INQUIRIES</>}
          </h2>

          <div className="bg-[#12121f] rounded-xl border-2 border-[#2a2a4a] overflow-hidden">
            {activeTab === 'posts' && posts.map(post => (
              <div key={post.id} className="p-6 border-b border-[#2a2a4a]/30 last:border-0 flex justify-between items-center group hover:bg-[#1a1a2e] transition-colors">
                <div className="space-y-1">
                  <h3 className="font-mono font-bold text-sm text-neutral-200">{post.title}</h3>
                  <div className="flex items-center space-x-3 text-[8px] font-mono">
                    <span className={cn(
                      "px-2 py-0.5 rounded font-bold uppercase tracking-wider border",
                      post.status === 'published'
                        ? "bg-arcade-green/10 text-arcade-green border-arcade-green/20"
                        : "bg-arcade-yellow/10 text-arcade-yellow border-arcade-yellow/20"
                    )}>
                      {post.status}
                    </span>
                    <span className="text-[#2a2a4a]">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setPostForm(post); setEditingId(post.id); }} className="p-2 hover:bg-arcade-purple/10 text-arcade-purple rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('posts', post.id)} className="p-2 hover:bg-arcade-red/10 text-arcade-red rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === 'projects' && projects.map(proj => (
              <div key={proj.id} className="p-6 border-b border-[#2a2a4a]/30 last:border-0 flex justify-between items-center group hover:bg-[#1a1a2e] transition-colors">
                <div className="space-y-1">
                  <h3 className="font-mono font-bold text-sm text-neutral-200">{proj.title}</h3>
                  <div className="flex items-center space-x-3 text-[8px] font-mono">
                    <span className="bg-arcade-cyan/10 text-arcade-cyan px-2 py-0.5 rounded font-bold border border-arcade-cyan/20">{proj.category}</span>
                    <span className="text-[#2a2a4a]">{formatDate(proj.createdAt)}</span>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setProjectForm(proj); setEditingId(proj.id); }} className="p-2 hover:bg-arcade-cyan/10 text-arcade-cyan rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('projects', proj.id)} className="p-2 hover:bg-arcade-red/10 text-arcade-red rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === 'inquiries' && inquiries.map(inq => (
              <div key={inq.id} className="p-6 border-b border-[#2a2a4a]/30 last:border-0 hover:bg-[#1a1a2e] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="font-mono font-bold text-sm text-neutral-200">{inq.name}</h3>
                    <p className="text-[8px] text-arcade-cyan font-mono font-bold">{inq.email}</p>
                  </div>
                  <span className={cn(
                    "text-[7px] px-2 py-1 rounded font-mono font-bold uppercase tracking-wider border",
                    inq.status === 'new'
                      ? "bg-arcade-red/10 text-arcade-red border-arcade-red/20"
                      : "bg-[#2a2a4a]/20 text-[#2a2a4a] border-[#2a2a4a]/30"
                  )}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-xs text-[#2a2a4a] font-mono mb-4">"{inq.message}"</p>
                <div className="flex justify-between items-center">
                  <span className="text-[7px] text-[#2a2a4a] font-mono">{formatDate(inq.createdAt)}</span>
                  <div className="flex space-x-2">
                    {inq.status === 'new' && (
                      <button
                        onClick={async () => {
                          if (!db) return;
                          const ref = doc(db, 'inquiries', inq.id);
                          await updateDoc(ref, { status: 'read' });
                          fetchData();
                        }}
                        className="p-1 hover:bg-arcade-green/10 text-arcade-green rounded"
                        title="Mark as Read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete('inquiries', inq.id)} className="p-1 hover:bg-arcade-red/10 text-arcade-red rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'posts' ? posts : activeTab === 'projects' ? projects : inquiries).length === 0 && (
              <div className="p-20 text-center text-[#2a2a4a] font-mono text-xs">
                No items found.
              </div>
            )}
          </div>
        </div>

        {/* Editor Side */}
        <div className="lg:col-span-1">
          {activeTab !== 'inquiries' && (
            <div className="bg-[#12121f] rounded-xl border-2 border-[#2a2a4a] p-8 h-fit sticky top-28">
              <h3 className="pixel-heading text-[8px] mb-8 flex items-center gap-2 leading-relaxed">
                {editingId
                  ? <><Edit2 className="w-5 h-5 text-arcade-yellow" /> <span className="text-arcade-yellow">EDIT {activeTab === 'posts' ? 'POST' : 'PROJECT'}</span></>
                  : <><Plus className="w-5 h-5 text-arcade-green" /> <span className="text-arcade-green">NEW {activeTab === 'posts' ? 'POST' : 'PROJECT'}</span></>
                }
              </h3>

              {activeTab === 'posts' ? (
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">TITLE</label>
                    <input required value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-purple/50 text-xs font-mono outline-none text-neutral-200" />
                  </div>
                  <div className="space-y-1">
                    <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">SUMMARY</label>
                    <textarea value={postForm.summary} onChange={e => setPostForm({...postForm, summary: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-purple/50 text-xs font-mono outline-none resize-none text-neutral-200" rows={3} />
                  </div>
                  <div className="space-y-1">
                    <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">CONTENT (MARKDOWN)</label>
                    <textarea required value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-purple/50 text-xs font-mono outline-none resize-none text-neutral-200" rows={8} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">TAGS</label>
                      <input value={postForm.tags} onChange={e => setPostForm({...postForm, tags: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-purple/50 text-xs font-mono outline-none text-neutral-200" />
                    </div>
                    <div className="space-y-1">
                      <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">STATUS</label>
                      <select value={postForm.status} onChange={e => setPostForm({...postForm, status: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-purple/50 text-xs font-mono outline-none text-neutral-200">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="grow arcade-btn bg-arcade-purple border-[#8833cc] text-white text-[8px] flex items-center justify-center gap-2"
                            style={{ boxShadow: '0 0 15px rgba(180, 74, 255, 0.2), 0 3px 0 #8833cc' }}>
                      <Save className="w-4 h-4" /> {editingId ? 'UPDATE' : 'CREATE'}
                    </button>
                    {editingId && <button type="button" onClick={() => setEditingId(null)} className="p-3 bg-[#0a0a12] border-2 border-[#2a2a4a] rounded-lg text-[#2a2a4a] hover:text-arcade-red"><XCircle className="w-5 h-5" /></button>}
                  </div>
                </form>
              ) : (
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">TITLE</label>
                    <input required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 text-xs font-mono outline-none text-neutral-200" />
                  </div>
                  <div className="space-y-1">
                    <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">DESCRIPTION</label>
                    <textarea required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 text-xs font-mono outline-none resize-none text-neutral-200" rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">CATEGORY</label>
                      <input required value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 text-xs font-mono outline-none text-neutral-200" />
                    </div>
                    <div className="space-y-1">
                      <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">DEMO URL</label>
                      <input value={projectForm.demoUrl} onChange={e => setProjectForm({...projectForm, demoUrl: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 text-xs font-mono outline-none text-neutral-200" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">IMAGE URL</label>
                    <input value={projectForm.imageUrl} onChange={e => setProjectForm({...projectForm, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 text-xs font-mono outline-none text-neutral-200" />
                  </div>
                  <div className="space-y-1">
                    <label className="pixel-heading text-[6px] text-[#2a2a4a] leading-relaxed">CODE SNIPPET</label>
                    <textarea value={projectForm.codeSnippet} onChange={e => setProjectForm({...projectForm, codeSnippet: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 text-xs font-mono outline-none resize-none text-neutral-200" rows={4} />
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="grow arcade-btn bg-arcade-cyan border-[#0099aa] text-[#0a0a12] text-[8px] flex items-center justify-center gap-2"
                            style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.2), 0 3px 0 #0099aa' }}>
                      <Save className="w-4 h-4" /> {editingId ? 'UPDATE' : 'CREATE'}
                    </button>
                    {editingId && <button type="button" onClick={() => setEditingId(null)} className="p-3 bg-[#0a0a12] border-2 border-[#2a2a4a] rounded-lg text-[#2a2a4a] hover:text-arcade-red"><XCircle className="w-5 h-5" /></button>}
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