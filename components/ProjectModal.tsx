
import { useState, useEffect, FormEvent } from 'react';
import { X, Save, Calendar, Loader2, Check, Hash, Sparkles } from 'lucide-react';
import { Project, ProjectStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { INPUT_LIMITS } from '../constants';
import { SearchableDropdown } from './ui/SearchableDropdown';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Project;
  title: string;
}

const STATUS_OPTIONS: { value: ProjectStatus, label: string }[] = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Completed', label: 'Completed' }
];

export function ProjectModal({ isOpen, onClose, onSubmit, initialData, title }: ProjectModalProps) {
  const { user } = useAuth();
  const { users } = useTeam();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const isAdmin = user?.roles.includes('Admin');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    clientName: '',
    status: 'Pending' as ProjectStatus,
    dueDate: '',
    description: '',
    assignedUsers: [] as string[]
  });

  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
      setSaveSuccess(false);
      if (initialData) {
        setFormData({
          name: initialData.name,
          code: initialData.code || '',
          clientName: initialData.clientName,
          status: initialData.status,
          dueDate: initialData.dueDate,
          description: initialData.description,
          assignedUsers: initialData.assignedUsers || []
        });
      } else {
        setFormData({
          name: '',
          code: '',
          clientName: '',
          status: 'Pending',
          dueDate: '',
          description: '',
          assignedUsers: user ? [user.id] : []
        });
      }
    }
  }, [initialData, isOpen, user]);

  if (!isOpen) return null;

  const generateCode = () => {
    if (!formData.name) return;
    const cleanName = formData.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const suggested = cleanName.substring(0, 4) + '-' + Math.floor(10 + Math.random() * 90);
    setFormData(prev => ({ ...prev, code: suggested }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const finalData = {
        ...formData,
        code: formData.code.toUpperCase().replace(/\s/g, '-'),
        createdBy: initialData?.createdBy || user?.id || '1',
        assignedUsers: formData.assignedUsers.length > 0 ? formData.assignedUsers : [user?.id || '1']
    };

    await new Promise(resolve => setTimeout(resolve, 800));
    setSaveSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    onSubmit(finalData);
    setIsSaving(false);
    onClose();
  };

  const handleUserToggle = (userId: string) => {
      setFormData(prev => ({
          ...prev,
          assignedUsers: prev.assignedUsers.includes(userId) 
            ? prev.assignedUsers.filter(id => id !== userId)
            : [...prev.assignedUsers, userId]
      }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
            <div className="flex flex-col">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{title}</h3>
                {initialData && (
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                        Current Progress: {initialData.progress}% (Auto-calculated)
                    </span>
                )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={INPUT_LIMITS.PROJECT_NAME}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Website Redesign"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Project Code (Unique Slug)</label>
                <div className="relative">
                    <Hash size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s/g, '-') })}
                      maxLength={INPUT_LIMITS.PROJECT_CODE}
                      className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white pl-12 pr-24 py-3 text-sm font-black tracking-widest focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      placeholder="GRW-01"
                    />
                    <button 
                        type="button" 
                        onClick={generateCode}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                        <Sparkles size={12} />
                        Auto
                    </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  maxLength={INPUT_LIMITS.CLIENT_NAME}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <SearchableDropdown
                  label="Status"
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val as ProjectStatus })}
                  options={STATUS_OPTIONS}
                  searchable={false}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Due Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white pl-12 pr-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Only Admins can assign team members */}
              {isAdmin && (
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Assigned Team</label>
                    <div className="flex flex-wrap gap-2">
                       {users.map(u => (
                           <button
                             key={u.id}
                             type="button"
                             onClick={() => handleUserToggle(u.id)}
                             className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                 formData.assignedUsers.includes(u.id) 
                                 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                 : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-indigo-300'
                             }`}
                           >
                               <img src={u.avatarUrl} alt="" className="w-4 h-4 rounded-lg object-cover" />
                               {u.name.split(' ')[0]}
                           </button>
                       ))}
                    </div>
                  </div>
              )}

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                   <span className={`text-[10px] font-medium ${formData.description.length >= INPUT_LIMITS.DESCRIPTION ? 'text-red-500' : 'text-gray-400'}`}>
                      {formData.description.length}/{INPUT_LIMITS.DESCRIPTION}
                   </span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={INPUT_LIMITS.DESCRIPTION}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-white px-5 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all"
                  placeholder="Short summary of the project goals..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 bg-transparent rounded-2xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 min-w-[140px] ${
                  saveSuccess 
                    ? 'bg-green-600 shadow-green-500/20' 
                    : 'bg-indigo-600 shadow-indigo-500/20'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Syncing...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check size={16} />
                    Saved
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
