import { useState, FormEvent } from 'react';
import { ClipboardList, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Project, Note, NoteType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { MOCK_USERS } from '../../constants';

function NoteTypeBadge({ type }: { type: NoteType }) {
  const styles = {
    'Decision': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'Architecture': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    'Note': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[type]}`}>
      {type}
    </span>
  );
}

interface NotesTabProps {
  project: Project;
}

export function NotesTab({ project }: NotesTabProps) {
  const { user } = useAuth();
  const { addNote, updateNote, deleteNote } = useProjects();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  const [noteForm, setNoteForm] = useState<{title: string, content: string, type: NoteType}>({
    title: '',
    content: '',
    type: 'Note'
  });

  const handleStartCreate = () => {
    setNoteForm({ title: '', content: '', type: 'Note' });
    setIsCreating(true);
    setEditingNoteId(null);
  };

  const handleStartEdit = (note: Note) => {
    setNoteForm({ title: note.title, content: note.content, type: note.type });
    setEditingNoteId(note.id);
    setIsCreating(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingNoteId) {
      updateNote(project.id, editingNoteId, {
        title: noteForm.title,
        content: noteForm.content,
        type: noteForm.type,
      });
    } else {
      addNote(project.id, {
        userId: user.id,
        title: noteForm.title,
        content: noteForm.content,
        type: noteForm.type,
      });
    }
    setIsCreating(false);
    setEditingNoteId(null);
  };

  const handleDelete = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(project.id, noteId);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes & Decisions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track architecture decisions, meeting notes, and important updates.</p>
          </div>
          <button 
            onClick={handleStartCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Plus size={16} />
            Add Note
          </button>
       </div>

       {isCreating && (
         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">{editingNoteId ? 'Edit Note' : 'New Note'}</h4>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input 
                      type="text" 
                      required
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Database Schema Update"
                    />
                 </div>
                 <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select
                      value={noteForm.type}
                      onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value as NoteType })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Note">Note</option>
                      <option value="Decision">Decision</option>
                      <option value="Architecture">Architecture</option>
                    </select>
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                  <textarea 
                    required
                    rows={5}
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                    placeholder="Write your note details here..."
                  />
               </div>
               <div className="flex justify-end gap-3 pt-2">
                 <button 
                   type="button" 
                   onClick={() => setIsCreating(false)}
                   className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
                 >
                   {editingNoteId ? 'Update Note' : 'Create Note'}
                 </button>
               </div>
            </form>
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(!project.notes || project.notes.length === 0) && !isCreating ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
               <ClipboardList size={48} className="mb-3 opacity-20" />
               <p className="text-sm">No notes yet. Create your first decision record.</p>
            </div>
          ) : (
            (project.notes || []).map(note => {
              const author = MOCK_USERS[note.userId];
              const isAuthor = user?.id === note.userId;
              const canModify = isAuthor || user?.role === 'Admin';

              return (
                <div key={note.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                   <div className="flex justify-between items-start mb-3">
                      <NoteTypeBadge type={note.type} />
                      {canModify && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleStartEdit(note)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors">
                             <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(note.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                             <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                   </div>
                   <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{note.title}</h4>
                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1 whitespace-pre-line line-clamp-6">{note.content}</p>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <div className="flex items-center gap-2">
                        <img src={author?.avatarUrl} alt={author?.name} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{author?.name || 'Unknown'}</span>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                </div>
              );
            })
          )}
       </div>
    </div>
  );
}