import { useState } from 'react';
import { Search, UserPlus, Mail, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { useProjects } from '../context/ProjectContext';
import { STATUS_OPTIONS } from '../constants';
import { Role } from '../types';

export function Team() {
  const { user: currentUser } = useAuth();
  const { users } = useTeam();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getProjectsCount = (userId: string) => {
    return projects.filter(p => p.assignedUsers.includes(userId)).length;
  };

  const isAdmin = currentUser?.role === 'Admin';

  const roleColors: Record<Role, string> = {
    'Admin': 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800',
    'Sales': 'text-green-600 bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800',
    'Developer': 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Team Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your workspace team and their project access.</p>
        </div>
        {isAdmin && (
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            <UserPlus size={18} />
            Invite Member
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, @username, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {(['All', 'Admin', 'Sales', 'Developer'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                roleFilter === role 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((member) => (
            <div key={member.id} className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-4 right-4">
                 <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <MoreHorizontal size={18} />
                 </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img 
                    src={member.avatarUrl} 
                    alt={member.name} 
                    className="w-20 h-20 rounded-[2rem] object-cover border-4 border-white dark:border-gray-700 shadow-sm transition-transform group-hover:scale-105" 
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white dark:border-gray-800 rounded-full transition-colors duration-500 ${STATUS_OPTIONS[member.status]?.color || 'bg-gray-400'}`} />
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-white mb-0.5">{member.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2">@{member.username}</p>
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${roleColors[member.role]}`}>
                  {member.role}
                </span>

                <div className="mt-6 w-full grid grid-cols-2 gap-2">
                   <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Projects</p>
                      <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{getProjectsCount(member.id)}</p>
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center justify-center gap-1.5 overflow-hidden">
                         <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_OPTIONS[member.status]?.color || 'bg-gray-400'}`} />
                         <p className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase truncate" title={member.status}>
                           {member.status}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="mt-6 w-full flex gap-2">
                   <a 
                     href={`mailto:${member.email}`}
                     className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                   >
                     <Mail size={14} />
                     Email
                   </a>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/10 transition-all active:scale-95">
                     <MessageCircle size={14} />
                     Chat
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-gray-900/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
             <div className="p-5 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
                <Search size={32} className="opacity-20" />
             </div>
             <p className="font-bold text-lg text-gray-600 dark:text-gray-300">No members found</p>
             <p className="text-sm">Try adjusting your search or role filters.</p>
             <button 
               onClick={() => { setSearchTerm(''); setRoleFilter('All'); }}
               className="mt-6 px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
             >
                Reset Filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
}