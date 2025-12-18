import React, { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function NotificationsCard() {
  const { user, updateProfile } = useAuth();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Default values if user doesn't have them yet
  const prefs = user?.notificationPrefs || {
    mentions: true,
    comments: false,
    updates: true
  };

  const handleToggle = (key: keyof typeof prefs) => {
    setSaveStatus('saving');
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    
    setTimeout(() => {
      updateProfile({ notificationPrefs: newPrefs });
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
              <Bell size={20} className="text-indigo-600 dark:text-indigo-400" />
              Notifications
            </h3>
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
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Configure how and when you want to be notified of updates.</p>
        </div>
        <div className="sm:w-2/3 space-y-8">
          <div className="grid grid-cols-1 gap-6">
             <NotifToggle 
                title="Project Mentions" 
                description="Get notified when someone @mentions you in a project chat."
                checked={prefs.mentions}
                onChange={() => handleToggle('mentions')}
             />
             <NotifToggle 
                title="Comment Activity" 
                description="Stay updated when someone posts a comment on your projects."
                checked={prefs.comments}
                onChange={() => handleToggle('comments')}
             />
             <NotifToggle 
                title="Status Updates" 
                description="Daily digests and immediate updates on project phase transitions."
                checked={prefs.updates}
                onChange={() => handleToggle('updates')}
             />
          </div>
        </div>
      </div>
    </section>
  );
}

function NotifToggle({ title, description, checked, onChange }: { title: string, description: string, checked: boolean, onChange: () => void }) {
    return (
        <div className="flex items-start justify-between gap-6 group">
            <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={checked}
                onChange={onChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/30 dark:peer-focus:ring-indigo-800/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    );
}