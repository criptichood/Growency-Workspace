import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, FileText, MessageSquare, ClipboardList, ChevronRight } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { SearchResult } from '../../types';

const MAX_PREVIEW_ITEMS = 5;

export function GlobalSearch() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { performSearch } = useProjects();
  const { user } = useAuth();

  const results = user ? performSearch(query, user.id, user.role) : { projects: [], briefs: [], messages: [], notes: [] };
  
  // Calculate total results for the "See all" logic
  const totalResults = results.projects.length + results.briefs.length + results.messages.length + results.notes.length;
  const hasResults = totalResults > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (path: string) => {
    navigate(path);
    setQuery('');
    setIsFocused(false);
  };

  const handleSeeAllClick = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery('');
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleSeeAllClick();
      }
  }

  const renderSection = (title: string, items: SearchResult[], icon: ReactNode) => {
    if (items.length === 0) return null;
    
    // Only show first 5 items in dropdown
    const displayItems = items.slice(0, MAX_PREVIEW_ITEMS);
    
    return (
      <div className="py-2">
        <h4 className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          {icon} {title}
        </h4>
        {displayItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleResultClick(item.path)}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col group transition-colors"
          >
            <span className="text-sm font-bold text-gray-900 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">{item.title}</span>
            {item.subtitle && <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</span>}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className={`flex items-center bg-gray-50 dark:bg-gray-700/50 border rounded-xl px-3 py-1.5 w-64 transition-all ${
        isFocused ? 'ring-2 ring-indigo-500/20 border-indigo-500 dark:border-indigo-400 w-80' : 'border-gray-200 dark:border-gray-600'
      }`}>
        <Search size={16} className="text-gray-400 dark:text-gray-500" />
        <input 
          type="text" 
          placeholder="Search everything..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {isFocused && query && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-gray-700 max-h-[28rem] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 z-[70] flex flex-col">
           {hasResults ? (
             <>
               <div className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto">
                  {renderSection('Projects', results.projects, <FolderKanban size={10} />)}
                  {renderSection('Briefs', results.briefs, <FileText size={10} />)}
                  {renderSection('Messages', results.messages, <MessageSquare size={10} />)}
                  {renderSection('Notes', results.notes, <ClipboardList size={10} />)}
               </div>
               
               {/* Show 'See all' if there are more results than we are showing or just as a general footer */}
               <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 sticky bottom-0">
                 <button 
                    onClick={handleSeeAllClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                 >
                    View all {totalResults} results
                    <ChevronRight size={12} />
                 </button>
               </div>
             </>
           ) : (
             <div className="p-8 text-center">
               <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-full inline-block mb-3">
                 <Search size={20} className="text-gray-300" />
               </div>
               <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No results for "{query}"</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}