import React, { useState } from 'react';
import { Shield, Key, Smartphone, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function SecurityCard() {
  const { user, updateProfile } = useAuth();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleToggle2FA = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      updateProfile({ twoFactorEnabled: !user?.twoFactorEnabled });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 400);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all">
      <div className="p-8 sm:flex gap-10">
        <div className="sm:w-1/3 mb-6 sm:mb-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
              Security
            </h3>
            {/* Sync Indicator */}
            <div className="flex items-center gap-1.5 h-4">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-in fade-in">
                  <Loader2 size={10} className="animate-spin" /> Syncing
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest animate-in fade-in">
                  <Check size={10} /> Saved
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Manage your workspace access and verification methods.</p>
        </div>
        <div className="sm:w-2/3 space-y-8">
          <div className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors hover:bg-white dark:hover:bg-gray-750">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600">
                <Key size={22} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Workspace Password</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Last changed 3 months ago</p>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all shadow-sm active:scale-95">
              Change
            </button>
          </div>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <Smartphone size={18} className="text-gray-400" />
                Two-Factor Authentication
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Add an extra layer of security by requiring a code when signing in from unrecognized devices.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={user?.twoFactorEnabled || false}
                onChange={handleToggle2FA}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/30 dark:peer-focus:ring-indigo-800/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-inner"></div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}