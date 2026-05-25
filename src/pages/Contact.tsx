import React, { useState, useCallback } from 'react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRateLimit } from '../hooks/useRateLimit';
import { Toast, type ToastType } from '../components/Toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { isRateLimited, remainingSeconds, recordSubmission } = useRateLimit();

  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '', website: '' });
      return;
    }

    if (isRateLimited) {
      showToast(`Please wait ${remainingSeconds}s before submitting again.`, 'error');
      return;
    }

    if (!db) {
      setStatus('error');
      showToast('Contact service is unavailable. Please try again later.', 'error');
      return;
    }

    setStatus('submitting');

    try {
      await addDoc(collection(db, 'inquiries'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '', website: '' });
      recordSubmission();
      showToast('Message transmitted successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
      setStatus('error');
      showToast('Transmission failed. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-16">
      <div className="space-y-4 text-center">
        <div className="section-kicker">Get in touch</div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">Let’s talk about your next product, system, or engineering challenge.</h1>
        <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Open to collaboration, technical consulting, and thoughtful conversations about building resilient software.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <div className="order-2 space-y-6 lg:col-span-2 lg:order-1">
          <div className="space-y-4">
            {[{
              icon: Mail,
              label: 'Email',
              value: 'hello@devflow.design',
              color: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-50 dark:bg-blue-500/10',
              border: 'border-blue-200 dark:border-blue-500/20'
            }, {
              icon: MapPin,
              label: 'Location',
              value: 'San Francisco, CA (GMT-7)',
              color: 'text-indigo-600 dark:text-indigo-400',
              bg: 'bg-indigo-50 dark:bg-indigo-500/10',
              border: 'border-indigo-200 dark:border-indigo-500/20'
            }, {
              icon: Phone,
              label: 'Availability',
              value: 'Active & Accepting Queries',
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-500/10',
              border: 'border-emerald-200 dark:border-emerald-500/20'
            }].map((item) => (
              <div key={item.label} className="bento-card flex items-start gap-4 p-6">
                <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border', item.bg, item.border)}>
                  <item.icon className={cn('h-5 w-5', item.color)} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{item.label}</p>
                  <p className="mt-2 text-base font-medium text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:col-span-3 lg:order-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label htmlFor="contact-name" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Full name</label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10"
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="contact-email" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Email</label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10"
                    placeholder="name@provider.com"
                  />
                </div>
              </div>

              <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="contact-message" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Project details</label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10"
                  placeholder="Describe your vision or inquiry..."
                />
              </div>

              <button
                disabled={status === 'submitting' || status === 'success' || isRateLimited}
                className={cn(
                  'inline-flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-lg transition',
                  status === 'success'
                    ? 'bg-emerald-600 shadow-emerald-600/20'
                    : 'bg-blue-600 shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-500',
                  'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0'
                )}
              >
                {status === 'success' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Message sent</span>
                  </>
                ) : isRateLimited ? (
                  <span>Wait {remainingSeconds}s</span>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{status === 'submitting' ? 'Sending...' : 'Send message'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
