
import React, { useState } from 'react';
import { Search, Shield, Check, X, Edit2, UserCog } from 'lucide-react';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import { Role, User } from '../types';

const AVAILABLE_ROLES: Role[] = ['SuperAdmin', 'Admin', 'Manager', 'Sales', 'Developer'];

export function UserManagement() {
  const { users, updateUser } = useTeam();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [tempRoles, setTempRoles] = useState<Role[]>([]);

  if (!currentUser?.roles.includes('SuperAdmin')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <Shield size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Only SuperAdmins can manage user roles.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setTempRoles([...user.roles]);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setTempRoles([]);
  };

  const saveRoles = (userId: string) => {
    updateUser(userId, { roles: tempRoles });
    setEditingUserId(null);
    setTempRoles([]);
  };

  const toggleRole = (role: Role) => {
    setTempRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <UserCog className="text-indigo-600 dark:text-indigo-400" size={32} />
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Manage system access and roles.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search users..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
           />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roles</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map(u => {
                const isEditing = editingUserId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2 max-w-md">
                          {AVAILABLE_ROLES.map(role => (
                            <button
                              key={role}
                              onClick={() => toggleRole(role)}
                              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                                tempRoles.includes(role)
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {u.roles.map(role => (
                            <span key={role} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={cancelEditing}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                          <button 
                            onClick={() => saveRoles(u.id)}
                            className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => startEditing(u)}
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
