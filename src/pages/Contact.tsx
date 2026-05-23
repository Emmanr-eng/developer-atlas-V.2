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
      showToast('Message sent successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
      setStatus('error');
      showToast('Failed to send. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900">
          Let's talk about your <span className="text-neutral-400 italic">project.</span>
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-sm leading-relaxed">
          Collaborations, engineering inquiries, or technical consultations. Reach out and let's craft something significant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Contact</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-4 p-5 border border-neutral-200 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-neutral-900 font-medium text-sm">hello@devflow.design</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 border border-neutral-200 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-neutral-900 font-medium text-sm">San Francisco, CA (GMT-7)</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 border border-neutral-200 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5">Status</p>
                <p className="text-neutral-900 font-medium text-sm">Active & Accepting Queries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 border border-neutral-200 rounded-xl p-6 md:p-8 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Name</label>
                <input
                  id="contact-name"
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors text-sm placeholder:text-neutral-300"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Email</label>
                <input
                  id="contact-email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors text-sm placeholder:text-neutral-300"
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

            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Message</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors text-sm resize-none placeholder:text-neutral-300"
                placeholder="Describe your vision or inquiry..."
              />
            </div>

            <button
              disabled={status === 'submitting' || status === 'success' || isRateLimited}
              className={cn(
                "w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition-all",
                status === 'success' ? "bg-emerald-600 text-white" : "bg-neutral-900 text-white hover:bg-neutral-800",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {status === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sent</span>
                </>
              ) : isRateLimited ? (
                <span>Wait {remainingSeconds}s</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
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
