import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Minimize2, Maximize2, Bot, User as UserIcon } from 'lucide-react';
import { Project, AiChatMessage } from '../types';
import { streamProjectChat } from '../services/ai';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import ReactMarkdown from 'react-markdown';

interface AiAssistantProps {
  project: Project;
}

const QUICK_ACTIONS = [
  "Summarize project status",
  "Identify risks",
  "Find action items",
  "Draft a status email"
];

export function AiAssistant({ project }: AiAssistantProps) {
  const { user } = useAuth();
  const { aiChats, updateAiChat } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Initialize messages from global context or default
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync with context on mount or project change
  useEffect(() => {
    if (aiChats[project.id]) {
      setMessages(aiChats[project.id]);
    } else {
      setMessages([
        { role: 'model', text: `Hi! I'm your co-pilot for **${project.name}**. How can I help you today?` }
      ]);
    }
  }, [project.id, aiChats]);

  // Persist messages to context whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      updateAiChat(project.id, messages);
    }
  }, [messages, project.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isMinimized, isStreaming]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming || !user) return;

    // 1. Add User Message
    const userMsg: AiChatMessage = { role: 'user', text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    
    // 2. Add Placeholder for AI Message
    setIsStreaming(true);
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
        // 3. Stream Response - PASSING USER FOR RBAC
        const stream = streamProjectChat(project, newHistory, text, user);
        let accumulatedText = "";

        for await (const chunk of stream) {
            if (!chunk) continue;
            accumulatedText += chunk;
            
            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx].role === 'model') {
                    updated[lastIdx] = { ...updated[lastIdx], text: accumulatedText };
                }
                return updated;
            });
            
            // Auto-scroll while streaming
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }
    } catch (e) {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error."}]);
    } finally {
        setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Render Logic
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 group"
        title="Open Project Co-pilot"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all duration-300 animate-in slide-in-from-bottom-10"
      >
        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
           <Bot size={18} />
        </div>
        <span className="font-bold text-sm">Co-pilot Active</span>
        <Maximize2 size={14} className="text-gray-400" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-[90vw] sm:w-[450px] h-[650px] max-h-[85vh] flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-10 duration-300 font-sans">
      {/* Header */}
      <div className="px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md">
             <Sparkles size={18} fill="currentColor" className="text-white/20" />
           </div>
           <div>
             <h3 className="font-bold text-gray-900 dark:text-white leading-none">Co-pilot</h3>
             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1">Context: {project.code}</p>
           </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(true)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Minimize2 size={18} />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50 dark:bg-gray-900/50 scroll-smooth">
        {messages.map((msg, idx) => {
           const isBot = msg.role === 'model';
           return (
             <div key={idx} className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-black/5 dark:border-white/10 ${
                   isBot ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                   {isBot ? (
                     <Bot size={16} />
                   ) : user?.avatarUrl ? (
                     <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon size={16} />
                   )}
                </div>
                
                {/* Bubble */}
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                   isBot 
                   ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none' 
                   : 'bg-indigo-600 text-white rounded-tr-none'
                }`}>
                   {isBot ? (
                     <div className="markdown-content">
                       <ReactMarkdown
                         components={{
                           h3: ({node, ...props}) => <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-4 mb-2 first:mt-0" {...props} />,
                           ul: ({node, ...props}) => <ul className="space-y-1.5 my-2 list-none pl-0" {...props} />,
                           li: ({node, ...props}) => <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-400 dark:before:text-indigo-500 font-medium text-gray-700 dark:text-gray-300" {...props} />,
                           p: ({node, ...props}) => <p className="leading-relaxed mb-2 last:mb-0" {...props} />,
                           strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                           ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 my-2 marker:text-indigo-500 marker:font-bold" {...props} />
                         }}
                       >
                         {msg.text}
                       </ReactMarkdown>
                       {/* Cursor for streaming effect if this is the last message and streaming is active */}
                       {idx === messages.length - 1 && isStreaming && (
                         <span className="inline-block w-1.5 h-3 ml-1 align-middle bg-indigo-500 animate-pulse"></span>
                       )}
                     </div>
                   ) : (
                     <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                   )}
                </div>
             </div>
           );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {!isStreaming && messages.length < 3 && (
        <div className="px-4 pb-2 bg-gray-50 dark:bg-gray-900/50 flex gap-2 overflow-x-auto no-scrollbar">
           {QUICK_ACTIONS.map(action => (
              <button 
                key={action}
                onClick={() => handleSendMessage(action)}
                className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors shadow-sm"
              >
                {action}
              </button>
           ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2 items-center">
           <input 
             type="text" 
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyDown={handleKeyPress}
             placeholder="Ask about this project..."
             disabled={isStreaming}
             className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400 disabled:opacity-50"
           />
           <button 
             onClick={() => handleSendMessage(inputValue)}
             disabled={!inputValue.trim() || isStreaming}
             className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
           >
              <Send size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}