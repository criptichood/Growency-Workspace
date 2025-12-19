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
  const { projects, openDmWithUser } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const getProjectsCount = (userId: string) => {
    return projects.filter(p => p.assignedUsers.includes(userId)).length;
  };

  const isAdmin = currentUser?.roles.includes('Admin') || currentUser?.roles.includes('SuperAdmin');

  const roleColors: Record<Role, string> = {
    'SuperAdmin': 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800',
    'Admin': 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800',
    'Manager': 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800',
    'Sales': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800',
    'Developer': 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800'
  };

  const handleChat = (targetUserId: string) => {
    if (currentUser) {
        openDmWithUser(currentUser.id, targetUserId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Team Members</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your workspace team and their project access.</p>
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
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, @username, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium shadow-sm"
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
                : 'bg-white dark:bg-[#151921] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
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
            <div key={member.id} className="group relative bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Card Header Decoration */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-slate-50/50 dark:bg-[#1e222e]/50 border-b border-slate-100 dark:border-slate-800/50" />
              
              <div className="absolute top-4 right-4 z-10">
                 <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <MoreHorizontal size={18} />
                 </button>
              </div>

              <div className="relative flex flex-col items-center text-center mt-2">
                <div className="relative mb-3">
                  <img 
                    src={member.avatarUrl} 
                    alt={member.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-[#151921] shadow-lg bg-slate-100 transition-transform group-hover:scale-105" 
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-[3px] border-white dark:border-[#151921] rounded-full transition-colors duration-500 ${STATUS_OPTIONS[member.status]?.color || 'bg-slate-400'}`} />
                </div>
                
                <h3 className="font-bold text-slate-900 dark:text-white mb-0.5 text-lg">{member.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-3">@{member.username}</p>
                
                <div className="flex flex-wrap justify-center gap-1">
                    {member.roles.slice(0, 2).map(role => (
                        <span key={role} className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${roleColors[role] || roleColors['Developer']}`}>
                        {role}
                        </span>
                    ))}
                    {member.roles.length > 2 && (
                        <span className="px-2 py-1 text-[10px] font-black bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full border border-gray-200 dark:border-gray-700">+{member.roles.length - 2}</span>
                    )}
                </div>

                <div className="mt-6 w-full grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 dark:bg-[#1e222e] p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Projects</p>
                      <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{getProjectsCount(member.id)}</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-[#1e222e] p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center justify-center gap-1.5 overflow-hidden">
                         <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_OPTIONS[member.status]?.color || 'bg-slate-400'}`} />
                         <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase truncate" title={member.status}>
                           {member.status}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="mt-6 w-full flex gap-3">
                   <a 
                     href={`mailto:${member.email}`}
                     className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all"
                   >
                     <Mail size={14} />
                     Email
                   </a>
                   <button 
                     onClick={() => handleChat(member.id)}
                     className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                   >
                     <MessageCircle size={14} />
                     Chat
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-[#151921] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <div className="p-5 bg-white dark:bg-[#1e222e] rounded-full shadow-sm mb-4">
                <Search size={32} className="opacity-20" />
             </div>
             <p className="font-bold text-lg text-slate-600 dark:text-slate-300">No members found</p>
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