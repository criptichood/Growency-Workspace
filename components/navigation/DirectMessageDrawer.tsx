import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Search, MessageSquare, ChevronLeft, Paperclip, File, Image as ImageIcon, Download, AlertCircle } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import { INPUT_LIMITS } from '../../constants';
import { DirectMessageThread, Attachment } from '../../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function DirectMessageDrawer() {
  const { isDmDrawerOpen, toggleDmDrawer, activeDmThreadId, dmThreads, sendDmMessage, openDmWithUser } = useProjects();
  const { user } = useAuth();
  const { users } = useTeam();
  const [activeThread, setActiveThread] = useState<DirectMessageThread | null>(null);
  const [messageText, setMessageText] = useState('');
  const [userSearch, setUserSearch] = useState('');
  
  // File Upload State
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Image Preview Modal State
  const [previewImage, setPreviewImage] = useState<{url: string, name: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync active thread when ID changes
  useEffect(() => {
    if (activeDmThreadId) {
      const thread = dmThreads.find(t => t.id === activeDmThreadId);
      setActiveThread(thread || null);
    } else {
      setActiveThread(null);
    }
  }, [activeDmThreadId, dmThreads]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (activeThread && isDmDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages, isDmDrawerOpen, attachments]); 

  if (!isDmDrawerOpen || !user) return null;

  // Filter threads where current user is participant
  const myThreads = dmThreads.filter(t => t.participants.includes(user.id));

  // Find users for "New Chat" search who are NOT current user
  const searchableUsers = users.filter(u => 
    u.id !== user.id && 
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.username.includes(userSearch.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageText.trim() && attachments.length === 0) || !activeThread) return;
    
    sendDmMessage(activeThread.id, messageText, user.id, attachments);
    setMessageText('');
    setAttachments([]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = [];
      let hasError = false;
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Size Restriction Check
        if (file.size > MAX_FILE_SIZE) {
            alert(`File "${file.name}" is too large. Max file size is 5MB.`);
            hasError = true;
            continue;
        }

        // Convert to Base64 for local storage demo
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64
        });
      }
      
      setAttachments(prev => [...prev, ...newAttachments]);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const getOtherParticipant = (thread: DirectMessageThread) => {
    const otherId = thread.participants.find(id => id !== user.id);
    return users.find(u => u.id === otherId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => toggleDmDrawer(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white dark:bg-gray-800 shadow-2xl z-[70] flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          {activeThread ? (
             <div className="flex items-center gap-2">
                <button onClick={() => openDmWithUser(user.id, user.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                   <ChevronLeft size={20} className="text-gray-500" />
                </button>
                <div className="flex items-center gap-3">
                   <img src={getOtherParticipant(activeThread)?.avatarUrl} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
                   <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{getOtherParticipant(activeThread)?.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{getOtherParticipant(activeThread)?.status}</p>
                   </div>
                </div>
             </div>
          ) : (
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Messages</h2>
          )}
          <button onClick={() => toggleDmDrawer(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
           {activeThread ? (
              <div className="p-4 space-y-4 min-h-full flex flex-col justify-end">
                 {activeThread.messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                       <p className="text-sm">No messages yet. Say hi!</p>
                    </div>
                 ) : (
                    activeThread.messages.map(msg => {
                        const isMe = msg.userId === user.id;
                        return (
                           <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                                 isMe 
                                 ? 'bg-indigo-600 text-white rounded-br-none' 
                                 : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-none'
                              }`}>
                                 {/* Attachments Rendering */}
                                 {msg.attachments && msg.attachments.length > 0 && (
                                   <div className={`space-y-2 mb-2 ${isMe ? 'items-end' : 'items-start'}`}>
                                     {msg.attachments.map(att => (
                                       <div key={att.id} className="rounded-xl overflow-hidden">
                                         {att.type.startsWith('image/') ? (
                                           <div className="relative group cursor-pointer" onClick={() => setPreviewImage({ url: att.url, name: att.name })}>
                                              <img 
                                                src={att.url} 
                                                alt={att.name} 
                                                className="max-w-full h-auto rounded-lg max-h-48 object-cover hover:opacity-90 transition-opacity" 
                                              />
                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                 <ImageIcon size={20} className="text-white drop-shadow-md" />
                                              </div>
                                           </div>
                                         ) : (
                                           <a 
                                             href={att.url} 
                                             download={att.name}
                                             className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                               isMe 
                                               ? 'bg-indigo-500/50 hover:bg-indigo-500 text-white border border-indigo-400/50' 
                                               : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                             }`}
                                           >
                                             <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-white dark:bg-gray-600'}`}>
                                               <File size={16} className={isMe ? 'text-white' : 'text-gray-500 dark:text-gray-300'} />
                                             </div>
                                             <div className="min-w-0 flex-1">
                                               <p className="font-bold text-xs truncate max-w-[150px]">{att.name}</p>
                                               <p className={`text-[10px] ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>{formatFileSize(att.size)}</p>
                                             </div>
                                             <Download size={14} className={isMe ? 'text-white/70' : 'text-gray-400'} />
                                           </a>
                                         )}
                                       </div>
                                     ))}
                                   </div>
                                 )}

                                 {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                                 
                                 <p className={`text-[9px] mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                 </p>
                              </div>
                           </div>
                        );
                    })
                 )}
                 <div ref={messagesEndRef} />
              </div>
           ) : (
              // Thread List View
              <div className="p-4 space-y-2">
                 {/* New Chat Search */}
                 <div className="relative mb-6">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search people..." 
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
                    />
                 </div>

                 {userSearch ? (
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">People</h4>
                        {searchableUsers.map(u => (
                            <button 
                                key={u.id}
                                onClick={() => {
                                    openDmWithUser(user.id, u.id);
                                    setUserSearch('');
                                }}
                                className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                            >
                                <img src={u.avatarUrl} className="w-10 h-10 rounded-full bg-gray-200" alt="" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{u.name}</p>
                                    <p className="text-xs text-gray-500">@{u.username}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                 ) : (
                    <div className="space-y-2">
                        {myThreads.length === 0 ? (
                           <div className="flex flex-col items-center justify-center py-20 opacity-50">
                              <MessageSquare size={48} className="mb-4 text-gray-300" />
                              <p className="text-sm font-medium text-gray-500">No active conversations</p>
                           </div>
                        ) : (
                           myThreads.map(thread => {
                               const other = getOtherParticipant(thread);
                               return (
                                   <button 
                                      key={thread.id}
                                      onClick={() => openDmWithUser(user.id, other?.id || '')}
                                      className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600 group"
                                   >
                                       <div className="relative">
                                          <img src={other?.avatarUrl} className="w-12 h-12 rounded-xl object-cover bg-gray-200" alt="" />
                                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${other?.status === 'Available' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                       </div>
                                       <div className="flex-1 min-w-0 text-left">
                                           <div className="flex justify-between items-baseline mb-0.5">
                                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{other?.name}</p>
                                              <span className="text-[10px] text-gray-400">{new Date(thread.lastUpdated).toLocaleDateString()}</span>
                                           </div>
                                           <p className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                              {thread.lastMessage || 'Start a conversation'}
                                           </p>
                                       </div>
                                   </button>
                               );
                           })
                        )}
                    </div>
                 )}
              </div>
           )}
        </div>

        {/* Footer Input (Only if thread active) */}
        {activeThread && (
           <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
              {attachments.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
                  {attachments.map(att => (
                    <div key={att.id} className="relative group shrink-0 w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center">
                       {att.type.startsWith('image/') ? (
                         <img src={att.url} alt="preview" className="w-full h-full object-cover" />
                       ) : (
                         <File size={24} className="text-gray-400" />
                       )}
                       <button 
                        onClick={() => removeAttachment(att.id)}
                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                       >
                         <X size={10} />
                       </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSend} className="flex gap-2 items-end">
                 <input 
                   type="file" 
                   multiple 
                   hidden 
                   ref={fileInputRef} 
                   onChange={handleFileSelect} 
                 />
                 <button 
                   type="button"
                   onClick={() => fileInputRef.current?.click()}
                   className="p-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors mb-0.5"
                   title="Attach files (Max 5MB)"
                 >
                   <Paperclip size={20} />
                 </button>
                 <textarea 
                   value={messageText}
                   onChange={(e) => setMessageText(e.target.value)}
                   maxLength={INPUT_LIMITS.CHAT_MESSAGE}
                   placeholder="Type a message..."
                   rows={1}
                   className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none max-h-32"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSend(e);
                     }
                   }}
                 />
                 <button 
                   type="submit" 
                   disabled={!messageText.trim() && attachments.length === 0}
                   className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-colors mb-0.5 shadow-md shadow-indigo-500/20"
                 >
                    <Send size={18} />
                 </button>
              </form>
           </div>
        )}
      </div>

      {/* Image Lightbox Overlay */}
      {previewImage && (
         <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
            <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
                <X size={24} />
            </button>
            
            <img 
                src={previewImage.url} 
                alt={previewImage.name} 
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()} 
            />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4" onClick={(e) => e.stopPropagation()}>
                <a 
                    href={previewImage.url} 
                    download={previewImage.name}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg"
                >
                    <Download size={16} />
                    Download Original
                </a>
            </div>
         </div>
      )}
    </>
  );
}