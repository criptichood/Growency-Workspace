import React, { useState } from 'react';
import { Video, CalendarPlus, Copy, ExternalLink, MessageSquare, Send, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';

interface MeetingLog {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  link: string;
  platform: 'Jitsi' | 'Google Meet';
  timestamp: Date;
  note?: string;
}

export function Meetings() {
  const { user } = useAuth();
  const { users } = useTeam();
  const [activeTab, setActiveTab] = useState<'lounge' | 'history'>('lounge');
  
  // Local state for the "Team Lounge" - in a real app this would be in Context or Backend
  const [loungeFeed, setLoungeFeed] = useState<MeetingLog[]>([
    {
      id: 'm1',
      creatorName: 'Sarah Sales',
      creatorAvatar: 'https://picsum.photos/seed/sarah88/200/200',
      link: 'https://meet.jit.si/growency-demo-123',
      platform: 'Jitsi',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      note: 'Quick sync about Q4 targets if anyone is free!'
    }
  ]);

  const [postNote, setPostNote] = useState('');

  const generateJitsi = () => {
    if (!user) return;
    const roomName = `growency-${Math.random().toString(36).substr(2, 9)}`;
    const link = `https://meet.jit.si/${roomName}`;
    
    const newMeeting: MeetingLog = {
      id: Math.random().toString(36),
      creatorName: user.name,
      creatorAvatar: user.avatarUrl,
      link,
      platform: 'Jitsi',
      timestamp: new Date(),
      note: postNote || 'Started an instant meeting'
    };
    
    setLoungeFeed([newMeeting, ...loungeFeed]);
    setPostNote('');
    window.open(link, '_blank');
  };

  const openGoogleMeet = () => {
    if (!user) return;
    const link = 'https://meet.google.com/new';
    
    const newMeeting: MeetingLog = {
        id: Math.random().toString(36),
        creatorName: user.name,
        creatorAvatar: user.avatarUrl,
        link: 'https://meet.google.com/new', // Placeholder as we can't get the real generated URL back easily without API
        platform: 'Google Meet',
        timestamp: new Date(),
        note: postNote || 'Opened a Google Meet room'
      };
      
      setLoungeFeed([newMeeting, ...loungeFeed]);
      setPostNote('');
      window.open(link, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
       <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-2">
            <Video size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Video Meeting Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
            Generate instant meeting links for your team. Post them to the Team Lounge to gather people quickly.
          </p>
       </div>

       {/* Actions */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jitsi Card */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-bl-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Instant</span>
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Growency Meet</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Powered by Jitsi. No login required. Perfect for quick huddles.</p>
             
             <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Add a topic (optional)..." 
                  value={postNote}
                  onChange={(e) => setPostNote(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button 
                  onClick={generateJitsi}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   <Video size={20} />
                   Start Instant Meeting
                </button>
             </div>
          </div>

          {/* Google Meet Card */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Google Meet</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Create a room using your Google Workspace account.</p>
             
             <div className="space-y-4 mt-auto">
                 <div className="h-[50px] sm:h-[50px] flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs font-medium italic">
                    Redirects to meet.new
                 </div>
                <button 
                  onClick={openGoogleMeet}
                  className="w-full py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   <CalendarPlus size={20} />
                   Schedule / Create
                </button>
             </div>
          </div>
       </div>

       {/* Team Lounge Feed */}
       <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                Team Lounge
             </h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recent meeting links posted by the team.</p>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
             {loungeFeed.map(meet => (
                <div key={meet.id} className="p-6 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                   <img src={meet.creatorAvatar} alt="" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                         <div>
                            <span className="font-bold text-gray-900 dark:text-white text-sm">{meet.creatorName}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{meet.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                             meet.platform === 'Jitsi' 
                             ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                             : 'bg-green-50 dark:bg-green-900/20 text-green-600'
                         }`}>
                            {meet.platform}
                         </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-3">{meet.note}</p>
                      
                      <div className="flex items-center gap-3">
                         <a 
                           href={meet.link} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                         >
                            Join Meeting <ExternalLink size={12} />
                         </a>
                         <button 
                            onClick={() => navigator.clipboard.writeText(meet.link)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Copy Link"
                         >
                            <Copy size={16} />
                         </button>
                      </div>
                   </div>
                </div>
             ))}
             
             {loungeFeed.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                   <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                   <p className="text-sm">The lounge is quiet. Start a meeting to wake everyone up!</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}