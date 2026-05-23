import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRateLimit } from '../hooks/useRateLimit';
import { Toast, type ToastType } from '../components/Toast';
import { createInquiry } from '../services/firestore';
import { db } from '../lib/firebase';

const INITIAL_FORM = { name: '', email: '', message: '', website: '' };

export default function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { isRateLimited, remainingSeconds, recordSubmission } = useRateLimit();
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({ message: '', type: 'success', visible: false });

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.website) {
      setStatus('success');
      resetForm();
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
      await createInquiry({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setStatus('success');
      resetForm();
      recordSubmission();
      showToast('Message transmitted successfully!', 'success');
    } catch {
      setStatus('error');
      showToast('Transmission failed. Please try again.', 'error');
    }
  };

  const handleChange = useCallback((field: keyof typeof INITIAL_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">
          Let's talk about your <span className="text-emerald-600 font-serif italic">project.</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed font-medium">
          Collaborations, engineering inquiries, or technical consultations. Reach out and let's craft something significant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Global Reach</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-8 bento-card">
                <div className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(16, 185, 129, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '16px' }}>
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Line</p>
                  <p className="text-slate-800 font-bold">hello@devflow.design</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-8 bento-card">
                <div className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(59, 130, 246, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '16px' }}>
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base of Ops</p>
                  <p className="text-slate-800 font-bold text-sm">San Francisco, CA (GMT-7)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-8 bento-card">
                <div className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(245, 158, 11, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '16px' }}>
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-slate-800 font-bold text-sm">Active & Accepting Queries</p>
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
                <label htmlFor="contact-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity</label>
                <input id="contact-name" required type="text" value={formData.name} onChange={handleChange('name')}
                  className="w-full px-6 py-4 glass-input text-xs font-bold outline-none placeholder:text-slate-400" style={{ borderRadius: '16px' }} placeholder="Full Name" />
              </div>
              <div className="space-y-3">
                <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Protocol</label>
                <input id="contact-email" required type="email" value={formData.email} onChange={handleChange('email')}
                  className="w-full px-6 py-4 glass-input text-xs font-bold outline-none placeholder:text-slate-400" style={{ borderRadius: '16px' }} placeholder="name@provider.com" />
              </div>
            </div>

            {/* Honeypot */}
            <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" type="text" value={formData.website} onChange={handleChange('website')} tabIndex={-1} autoComplete="off" />
            </div>

            <div className="space-y-3">
              <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Transmission</label>
              <textarea id="contact-message" required rows={5} value={formData.message} onChange={handleChange('message')}
                className="w-full px-6 py-4 glass-input text-xs font-bold outline-none resize-none placeholder:text-slate-400" style={{ borderRadius: '16px' }} placeholder="Describe your vision or inquiry..." />
            </div>

            <button disabled={status === 'submitting' || status === 'success' || isRateLimited}
              className={cn(
                "w-full py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.01] active:scale-95",
                status === 'success'
                  ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-[0_0_24px_rgba(0,0,0,0.08)]",
                "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              )}
              style={{ borderRadius: '20px' }}
            >
              {status === 'success' ? (<><CheckCircle2 className="w-5 h-5" /><span>Verified Transmission</span></>)
                : isRateLimited ? (<span>Wait {remainingSeconds}s</span>)
                : (<><Send className="w-5 h-5" /><span>{status === 'submitting' ? 'Transmitting...' : 'Initiate Contact'}</span></>)}
            </button>
          </form>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </div>
  );
}