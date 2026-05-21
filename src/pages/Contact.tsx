import React, { useState } from 'react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      if (!db) throw new Error('Database not initialized');
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Let's talk about your <span className="text-emerald-400 font-serif italic">project.</span>
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-sm leading-relaxed font-medium">
          Collaborations, engineering inquiries, or technical consultations. Reach out and let's craft something significant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Global Reach</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-8 bento-card">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Direct Line</p>
                  <p className="text-neutral-200 font-bold">hello@devflow.design</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-8 bento-card">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Base of Ops</p>
                  <p className="text-neutral-200 font-bold text-sm">San Francisco, CA (GMT-7)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-8 bento-card">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Phone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-neutral-200 font-bold text-sm">Active & Accepting Queries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bento-card p-8 md:p-12 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Identity</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-neutral-900 border border-neutral-700/50 focus:border-emerald-500/50 transition-all text-xs font-bold outline-none placeholder:text-neutral-700"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Protocol</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl bg-neutral-900 border border-neutral-700/50 focus:border-emerald-500/50 transition-all text-xs font-bold outline-none placeholder:text-neutral-700"
                  placeholder="name@provider.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Transmission</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-neutral-900 border border-neutral-700/50 focus:border-emerald-500/50 transition-all text-xs font-bold outline-none resize-none placeholder:text-neutral-700"
                placeholder="Describe your vision or inquiry..."
              />
            </div>

            <button
              disabled={status === 'submitting' || status === 'success'}
              className={cn(
                "w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.01] active:scale-95 shadow-2xl",
                status === 'success' ? "bg-emerald-500 text-black" : "bg-neutral-100 text-black hover:bg-white shadow-white/5",
                "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              )}
            >
              {status === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verified Transmission</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{status === 'submitting' ? 'Transmitting...' : 'Initiate Contact'}</span>
                </>
              )}
            </button>

            {status === 'error' && (
              <div className="flex items-center space-x-2 p-4 rounded-xl bg-red-900/10 border border-red-900/30 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle className="w-4 h-4" />
                <span>Link failure. Please re-initiate.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
