import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, FolderKanban, FileText, MessageSquare, ClipboardList, ArrowRight, ExternalLink } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { SearchResult } from '../types';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { performSearch } = useProjects();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';
  
  // Local state to handle input if user wants to refine search on this page
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const results = user ? performSearch(query, user.id, user.role) : { projects: [], briefs: [], messages: [], notes: [] };
  
  const totalResults = results.projects.length + results.briefs.length + results.messages.length + results.notes.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(localQuery)}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Search Results</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Found {totalResults} matches for "{query}" in your workspace.</p>
      </div>

      {/* Refine Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
         <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
         <input 
            type="text" 
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm text-base font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
            placeholder="Search projects, messages, briefs..."
         />
         <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            <ArrowRight size={18} />
         </button>
      </form>

      {totalResults === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
             <div className="p-6 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-6">
               <Search size={40} className="text-gray-300" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
             <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
               We couldn't find anything matching "{query}". Try checking for typos or use more general keywords.
             </p>
          </div>
      ) : (
          <div className="space-y-10">
             {/* Projects */}
             <ResultSection 
               title="Projects" 
               items={results.projects} 
               icon={<FolderKanban className="text-indigo-600 dark:text-indigo-400" size={24} />}
               emptyMessage="No matching projects found."
             />

             {/* Briefs */}
             <ResultSection 
               title="Briefs & Requirements" 
               items={results.briefs} 
               icon={<FileText className="text-pink-600 dark:text-pink-400" size={24} />}
               emptyMessage="No matching brief documents."
             />

             {/* Messages */}
             <ResultSection 
               title="Team Chat History" 
               items={results.messages} 
               icon={<MessageSquare className="text-blue-600 dark:text-blue-400" size={24} />}
               emptyMessage="No matching conversations."
             />

             {/* Notes */}
             <ResultSection 
               title="Notes & Decisions" 
               items={results.notes} 
               icon={<ClipboardList className="text-amber-600 dark:text-amber-400" size={24} />}
               emptyMessage="No matching notes."
             />
          </div>
      )}
    </div>
  );
}

function ResultSection({ title, items, icon, emptyMessage }: { title: string, items: SearchResult[], icon: React.ReactNode, emptyMessage: string }) {
    if (items.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    {icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">{items.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <ResultCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

const ResultCard: React.FC<{ item: SearchResult }> = ({ item }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(item.path)}
            className="group cursor-pointer bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                    {item.projectCode}
                </span>
                <ExternalLink size={14} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{item.title}</h3>
            {item.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.subtitle}</p>
            )}
        </div>
    );
}