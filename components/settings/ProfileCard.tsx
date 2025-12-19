import React, { useState, useEffect, useCallback } from 'react';
import { User as UserIcon, Check, ChevronDown, CloudUpload, Loader2 } from 'lucide-react';
import { User, UserStatusType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { STATUS_OPTIONS } from '../../constants';

interface ProfileCardProps {
  user: User;
  onLogout?: () => void;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { updateProfile } = useAuth();
  
  // Local state for immediate input feedback
  const nameParts = user.name.split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [username, setUsername] = useState(user.username || '');
  
  // Status tracking
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Unified save function
  const saveUpdates = useCallback((updates: Partial<User>) => {
    setSaveStatus('saving');
    // Simulate minor network delay for feedback
    setTimeout(() => {
      updateProfile(updates);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 400);
  }, [updateProfile]);

  // Debounce effect for inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if anything actually changed before triggering a "save"
      const currentFullName = `${firstName} ${lastName}`.trim();
      if (
        username !== user.username || 
        currentFullName !== user.name
      ) {
        saveUpdates({
          username,
          name: currentFullName
        });
      }
    }, 5000); // 5 seconds of inactivity

    return () => clearTimeout(timer);
  }, [username, firstName, lastName, user.username, user.name, saveUpdates]);

  const handleStatusChange = (newStatus: UserStatusType) => {
    saveUpdates({ status: newStatus });
  };

  const handleBlur = () => {
    const currentFullName = `${firstName} ${lastName}`.trim();
    if (username !== user.username || currentFullName !== user.name) {
      saveUpdates({
        username,
        name: currentFullName
      });
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all group">
      <div className="p-8 sm:flex gap-10">
        <div className="sm:w-1/3 mb-6 sm:mb-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
              Workspace Identity
            </h3>
            
            {/* Auto-save Indicator */}
            <div className="flex items-center gap-1.5 transition-all duration-300">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  <Loader2 size={10} className="animate-spin" /> Syncing
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest">
                  <Check size={10} /> Saved
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Your profile updates automatically as you type.</p>
        </div>

        <div className="sm:w-2/3 space-y-8">
          <div className="flex items-center gap-6">
            <div className="relative group/avatar">
              <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-[2rem] border-4 border-white dark:border-gray-700 shadow-xl bg-gray-100 dark:bg-gray-700 object-cover transition-transform group-hover/avatar:scale-105" />
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 border-4 border-white dark:border-gray-800 rounded-full transition-colors duration-500 ${STATUS_OPTIONS[user.status].color}`} />
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2rem] opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <CloudUpload className="text-white" size={24} />
              </button>
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-white">@{user.username}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{user.roles.join(', ')} • Joined 2023</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                  onBlur={handleBlur}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-9 pr-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Status</label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${STATUS_OPTIONS[user.status].color}`} />
                <select 
                  value={user.status} 
                  onChange={(e) => handleStatusChange(e.target.value as UserStatusType)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm appearance-none cursor-pointer" 
                >
                  {(Object.keys(STATUS_OPTIONS) as UserStatusType[]).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={handleBlur}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                onBlur={handleBlur}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium">
              <CloudUpload size={14} />
              Workspace Email: <span className="font-bold text-gray-900 dark:text-white ml-1">{user.email}</span>
              <span className="ml-auto text-[10px] font-black bg-gray-200/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg text-gray-400 dark:text-gray-500 uppercase">System Locked</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}