import { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { ProjectModal } from '../components/ProjectModal';
import { ProjectListTable } from '../components/project/ProjectListTable';
import { ProjectStatus } from '../types';

export function Projects() {
  const { user } = useAuth();
  const { projects, addProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const canCreateProject = user?.role === 'Admin' || user?.role === 'Sales';

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: (ProjectStatus | 'All')[] = ['All', 'In Progress', 'Pending', 'On Hold', 'Completed'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your team's initiatives and track progress.</p>
        </div>
        {canCreateProject && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 text-sm font-black text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[2.5rem] shadow-sm overflow-hidden transition-all">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or client..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto relative">
            <div className="hidden lg:flex items-center gap-2 mr-2">
                {statusOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === opt 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
            </div>

            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest border transition-all rounded-2xl ${
                statusFilter !== 'All' 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' 
                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-indigo-300'
              }`}
            >
              <Filter size={16} />
              {statusFilter === 'All' ? 'Filter' : statusFilter}
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 z-50 animate-in zoom-in-95 duration-200">
                {statusOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === opt 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            
            {statusFilter !== 'All' && (
              <button 
                onClick={() => setStatusFilter('All')}
                className="p-3 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-700 rounded-2xl"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <ProjectListTable projects={filteredProjects} />
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => addProject(data)}
        title="Create New Project"
      />
    </div>
  );
}