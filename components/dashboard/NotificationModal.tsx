import React, { useState } from 'react';
import { X, Send, Megaphone, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { INPUT_LIMITS } from '../../constants';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { user } = useAuth();
  const { addNotification } = useProjects();
  const [type, setType] = useState<'info' | 'alert' | 'success'>('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addNotification({
      type,
      title,
      message,
      createdBy: user.id
    });

    onClose();
    setTitle('');
    setMessage('');
    setType('info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
              <Megaphone size={20} className="text-indigo-600" />
              Announcement
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setType('info')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                    type === 'info' 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400 shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Info size={18} />
                  <span className="text-[10px] font-bold uppercase">Info</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('alert')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                    type === 'alert' 
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 text-amber-600 dark:text-amber-400 shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <AlertTriangle size={18} />
                  <span className="text-[10px] font-bold uppercase">Alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('success')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                    type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-600 dark:text-green-400 shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <CheckCircle2 size={18} />
                  <span className="text-[10px] font-bold uppercase">Success</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={INPUT_LIMITS.SHORT_TEXT}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. System Maintenance"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                 <span className={`text-[10px] font-medium ${message.length >= INPUT_LIMITS.LONG_TEXT ? 'text-red-500' : 'text-gray-400'}`}>
                    {message.length}/{INPUT_LIMITS.LONG_TEXT}
                 </span>
              </div>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={INPUT_LIMITS.LONG_TEXT}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white px-5 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all"
                placeholder="Details about the announcement..."
              />
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 bg-transparent rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-2xl shadow-xl hover:shadow-indigo-500/20 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}