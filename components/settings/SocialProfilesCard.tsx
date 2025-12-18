import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Linkedin, Github, Twitter, Instagram, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

export function SocialProfilesCard() {
  const { user, updateProfile } = useAuth();
  
  const [links, setLinks] = useState({
    linkedin: user?.socialLinks?.linkedin || '',
    github: user?.socialLinks?.github || '',
    twitter: user?.socialLinks?.twitter || '',
    instagram: user?.socialLinks?.instagram || ''
  });
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const saveUpdates = useCallback((newLinks: typeof links) => {
    setSaveStatus('saving');
    setTimeout(() => {
      updateProfile({ socialLinks: newLinks });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 400);
  }, [updateProfile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasChanged = JSON.stringify(links) !== JSON.stringify(user?.socialLinks || {});
      if (hasChanged) {
        saveUpdates(links);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [links, user?.socialLinks, saveUpdates]);

  const handleBlur = () => {
    const hasChanged = JSON.stringify(links) !== JSON.stringify(user?.socialLinks || {});
    if (hasChanged) {
      saveUpdates(links);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all">
      <div className="p-8 sm:flex gap-10">
        <div className="sm:w-1/3 mb-6 sm:mb-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe size={20} className="text-indigo-600 dark:text-indigo-400" />
              Social Profiles
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
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Connect your professional profiles for team visibility.</p>
        </div>
        <div className="sm:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SocialInput 
              label="LinkedIn" 
              icon={Linkedin} 
              placeholder="linkedin.com/in/username" 
              value={links.linkedin}
              onChange={(val) => setLinks({...links, linkedin: val})}
              onBlur={handleBlur}
            />
            <SocialInput 
              label="GitHub" 
              icon={Github} 
              placeholder="github.com/username" 
              value={links.github}
              onChange={(val) => setLinks({...links, github: val})}
              onBlur={handleBlur}
            />
            <SocialInput 
              label="Twitter" 
              icon={Twitter} 
              placeholder="@username" 
              value={links.twitter}
              onChange={(val) => setLinks({...links, twitter: val})}
              onBlur={handleBlur}
            />
            <SocialInput 
              label="Instagram" 
              icon={Instagram} 
              placeholder="@username" 
              value={links.instagram}
              onChange={(val) => setLinks({...links, instagram: val})}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialInput({ label, icon: Icon, placeholder, value, onChange, onBlur }: { label: string, icon: any, placeholder: string, value: string, onChange: (v: string) => void, onBlur: () => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder} 
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
        />
      </div>
    </div>
  );
}