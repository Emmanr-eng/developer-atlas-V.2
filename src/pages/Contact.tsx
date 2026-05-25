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
      <div className="text-center space-y-4">
        <h1 className="pixel-heading text-lg md:text-2xl leading-relaxed">
          <span className="neon-yellow">LET'S TALK ABOUT</span>
          <br />
          <span className="neon-cyan">YOUR PROJECT.</span>
        </h1>
        <p className="text-[#2a2a4a] max-w-2xl mx-auto text-xs leading-relaxed font-mono">
          Collaborations, engineering inquiries, or technical consultations. Reach out and let's craft something significant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="space-y-6">
            <h3 className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">GLOBAL REACH</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-6 bento-card hover:border-arcade-cyan/40">
                <div className="w-10 h-10 rounded-lg bg-arcade-cyan/10 flex items-center justify-center shrink-0 border border-arcade-cyan/20">
                  <Mail className="w-5 h-5 text-arcade-cyan" />
                </div>
                <div>
                  <p className="text-[8px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest mb-1">Direct Line</p>
                  <p className="text-neutral-200 font-mono font-bold text-sm">hello@devflow.design</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bento-card hover:border-arcade-purple/40">
                <div className="w-10 h-10 rounded-lg bg-arcade-purple/10 flex items-center justify-center shrink-0 border border-arcade-purple/20">
                  <MapPin className="w-5 h-5 text-arcade-purple" />
                </div>
                <div>
                  <p className="text-[8px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest mb-1">Base of Ops</p>
                  <p className="text-neutral-200 font-mono font-bold text-sm">San Francisco, CA (GMT-7)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bento-card hover:border-arcade-yellow/40">
                <div className="w-10 h-10 rounded-lg bg-arcade-yellow/10 flex items-center justify-center shrink-0 border border-arcade-yellow/20">
                  <Phone className="w-5 h-5 text-arcade-yellow" />
                </div>
                <div>
                  <p className="text-[8px] font-mono font-bold text-[#2a2a4a] uppercase tracking-widest mb-1">Status</p>
                  <p className="text-neutral-200 font-mono font-bold text-sm">Active & Accepting Queries</p>
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
                <label htmlFor="contact-name" className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">PLAYER NAME</label>
                <input
                  id="contact-name"
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 transition-all text-xs font-mono font-bold outline-none placeholder:text-[#2a2a4a]/50 text-arcade-cyan"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="contact-email" className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">PROTOCOL</label>
                <input
                  id="contact-email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 transition-all text-xs font-mono font-bold outline-none placeholder:text-[#2a2a4a]/50 text-arcade-cyan"
                  placeholder="name@provider.com"
                />
              </div>
            </div>

            {/* Honeypot */}
            <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
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
              <label htmlFor="contact-message" className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed">TRANSMISSION</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-4 rounded-lg bg-[#0a0a12] border-2 border-[#2a2a4a] focus:border-arcade-cyan/50 transition-all text-xs font-mono font-bold outline-none resize-none placeholder:text-[#2a2a4a]/50 text-arcade-cyan"
                placeholder="Describe your vision or inquiry..."
              />
            </div>

            <button
              disabled={status === 'submitting' || status === 'success' || isRateLimited}
              className={cn(
                "w-full py-5 rounded-lg font-mono font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all border-2",
                status === 'success'
                  ? "bg-arcade-green border-[#22cc00] text-[#0a0a12] shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                  : "bg-arcade-yellow border-[#ccb800] text-[#0a0a12] hover:bg-[#ffee44]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              style={{ boxShadow: status !== 'success' ? '0 4px 0 #ccb800' : '0 4px 0 #22cc00' }}
            >
              {status === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>✓ TRANSMISSION VERIFIED</span>
                </>
              ) : isRateLimited ? (
                <span>WAIT {remainingSeconds}s</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{status === 'submitting' ? 'TRANSMITTING...' : '🎮 SEND MESSAGE'}</span>
                </>
              )}
            </button>
          </form>
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