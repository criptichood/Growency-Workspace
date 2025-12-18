import { useState, useRef, useEffect, Fragment, FormEvent } from 'react';
import { MessageSquare, Send, Paperclip } from 'lucide-react';
import { Project } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { MOCK_USERS } from '../../constants';

interface ChatTabProps {
  project: Project;
  initialMessage?: string;
  onMessageUsed?: () => void;
}

export function ChatTab({ project, initialMessage, onMessageUsed }: ChatTabProps) {
  const { sendMessage } = useProjects();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage) {
      setNewMessage(initialMessage);
      onMessageUsed?.();
    }
  }, [initialMessage, onMessageUsed]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [project.messages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    sendMessage(project.id, newMessage, user.id);
    setNewMessage('');
  };

  const formatDateLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[520px] overflow-hidden transition-all">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-none mb-1">Team Chat</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{project.messages.length} messages</p>
              </div>
            </div>
            <div className="flex -space-x-1.5">
               {project.assignedUsers.map(uid => (
                   MOCK_USERS[uid] && <img key={uid} src={MOCK_USERS[uid].avatarUrl} className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800" title={MOCK_USERS[uid].name} alt={MOCK_USERS[uid].name} />
               ))}
            </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30 dark:bg-gray-900/40 space-y-1">
            {project.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={40} className="mb-2 opacity-10" />
                    <p className="text-xs">No messages yet. Start the conversation!</p>
                </div>
            ) : (
                project.messages.map((msg, index) => {
                    const isMe = msg.userId === user?.id;
                    const prevMsg = project.messages[index - 1];
                    const sender = MOCK_USERS[msg.userId];
                    const date = new Date(msg.timestamp);
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    const isSameUserAsPrev = prevMsg?.userId === msg.userId;
                    const isSameDayAsPrev = prevMsg && new Date(prevMsg.timestamp).toDateString() === date.toDateString();
                    const isFirstInGroup = !isSameUserAsPrev || !isSameDayAsPrev;
                    
                    const showDateSeparator = !isSameDayAsPrev;

                    return (
                        <Fragment key={msg.id}>
                             {showDateSeparator && (
                               <div className="flex items-center justify-center my-4">
                                  <span className="px-2 py-0.5 bg-gray-200/50 dark:bg-gray-700/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 rounded uppercase tracking-wider">
                                    {formatDateLabel(msg.timestamp)}
                                  </span>
                               </div>
                             )}
                             <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''} ${isFirstInGroup ? 'mt-3' : 'mt-0.5'}`}>
                                 <div className="w-8 shrink-0">
                                   {isFirstInGroup && !isMe && (
                                     <img 
                                       src={sender?.avatarUrl || 'https://via.placeholder.com/32'} 
                                       alt={sender?.name}
                                       className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 object-cover border border-white dark:border-gray-800" 
                                     />
                                   )}
                                 </div>
                                 <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                     {isFirstInGroup && (
                                       <div className={`flex items-center gap-2 mb-0.5 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{isMe ? 'You' : (sender?.name || 'Unknown')}</span>
                                          <span className="text-[9px] text-gray-400 font-medium">{timeString}</span>
                                       </div>
                                     )}
                                     <div 
                                       title={timeString}
                                       className={`px-3 py-1.5 rounded-xl text-sm shadow-sm transition-all hover:brightness-95 active:scale-[0.98] ${
                                         isMe 
                                         ? 'bg-indigo-600 text-white ' + (isFirstInGroup ? 'rounded-tr-none' : 'rounded-tr-xl')
                                         : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 ' + (isFirstInGroup ? 'rounded-tl-none' : 'rounded-tl-xl')
                                       }`}
                                     >
                                         <p className="leading-snug break-words">{msg.text}</p>
                                     </div>
                                 </div>
                             </div>
                        </Fragment>
                    );
                })
            )}
            <div ref={messagesEndRef} className="h-2" />
        </div>

        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2 items-center">
                 <div className="relative flex-1 group">
                   <input 
                     type="text" 
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     placeholder="Message your team..." 
                     className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-900 dark:white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all pr-10"
                   />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 pointer-events-none group-hover:text-gray-500">
                     <Paperclip size={14} />
                   </div>
                 </div>
                 <button 
                   type="submit" 
                   disabled={!newMessage.trim()}
                   className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:grayscale transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
                 >
                     <Send size={16} />
                 </button>
            </form>
        </div>
    </div>
  );
}