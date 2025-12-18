import React, { useState, useRef } from 'react';
import { 
  FileBox, Search, Plus, FolderOpen, Image as ImageIcon, FileText, 
  FileCode, Download, Trash2, X, MoreVertical, HardDrive 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useTeam } from '../context/TeamContext';
import { ResourceCategory, ResourceFile } from '../types';

const CATEGORIES: ResourceCategory[] = ['General', 'Brand', 'HR', 'Sales', 'Engineering', 'Templates'];

export function Resources() {
  const { user } = useAuth();
  const { resources, addResource, deleteResource } = useProjects();
  const { getUser } = useTeam();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'All'>('All');
  
  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Lightbox State
  const [previewImage, setPreviewImage] = useState<{url: string, name: string} | null>(null);

  if (!user) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit for resources

      if (file.size > MAX_SIZE) {
        alert("File too large. Max size is 10MB.");
        return;
      }

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Simple heuristic for category based on file type or extension could go here
      // For now, default to 'General' or the active category if not 'All'
      const category: ResourceCategory = activeCategory === 'All' ? 'General' : activeCategory;

      addResource({
        name: file.name,
        type: file.type,
        size: file.size,
        url: base64,
        category,
        uploadedBy: user.id,
        description: 'Uploaded via Resources Vault'
      });

      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="text-purple-500" />;
    if (mimeType.includes('pdf')) return <FileText className="text-red-500" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileText className="text-green-500" />;
    if (mimeType.includes('presentation')) return <FileText className="text-orange-500" />;
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return <FileBox className="text-gray-500" />;
    if (mimeType.includes('code') || mimeType.includes('json') || mimeType.includes('javascript')) return <FileCode className="text-blue-500" />;
    return <FileText className="text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <HardDrive className="text-indigo-600 dark:text-indigo-400" size={32} />
            Resource Vault
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Centralized storage for company assets, policies, and templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search files..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
           </div>
           
           <input 
             type="file" 
             ref={fileInputRef} 
             hidden 
             onChange={handleFileUpload} 
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
           >
             <Plus size={18} />
             Upload
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
         {/* Sidebar / Categories */}
         <div className="lg:w-64 shrink-0 space-y-1 overflow-y-auto">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Categories</h3>
            <button 
              onClick={() => setActiveCategory('All')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeCategory === 'All' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
               <span className="flex items-center gap-3">
                 <FolderOpen size={18} /> All Files
               </span>
               <span className={`text-xs ${activeCategory === 'All' ? 'text-indigo-200' : 'text-gray-400'}`}>
                 {resources.length}
               </span>
            </button>
            
            {CATEGORIES.map(cat => {
               const count = resources.filter(r => r.category === cat).length;
               return (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                     activeCategory === cat 
                     ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-sm' 
                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                   }`}
                 >
                    <span>{cat}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">{count}</span>
                 </button>
               );
            })}
         </div>

         {/* File Grid */}
         <div className="flex-1 bg-gray-50 dark:bg-gray-900/20 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            {filteredResources.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                   <FolderOpen size={48} className="mb-4 opacity-20" />
                   <p className="font-bold text-lg">No files found</p>
                   <p className="text-sm">Try uploading a new resource to this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                   {filteredResources.map(file => {
                      const uploader = getUser(file.uploadedBy);
                      const isImage = file.type.startsWith('image/');

                      return (
                        <div key={file.id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
                           <div className="flex items-start justify-between mb-4">
                              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                 {getFileIcon(file.type)}
                              </div>
                              <div className="relative">
                                 <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <MoreVertical size={16} />
                                 </button>
                                 {/* Simple Dropdown for Delete - mostly needed for admins */}
                                 <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10">
                                     <button 
                                       onClick={() => {
                                           if(confirm('Delete this file permanently?')) deleteResource(file.id);
                                       }}
                                       className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs font-bold text-red-600 whitespace-nowrap hover:bg-red-50 dark:hover:bg-red-900/20"
                                     >
                                        <Trash2 size={12} /> Delete
                                     </button>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate mb-1" title={file.name}>{file.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 h-8">{file.description || 'No description'}</p>
                              
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                 <span>{formatFileSize(file.size)}</span>
                                 <span>•</span>
                                 <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                              </div>
                           </div>

                           <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <img src={uploader?.avatarUrl} className="w-5 h-5 rounded-full bg-gray-200" title={`Uploaded by ${uploader?.name}`} alt="" />
                                 <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate max-w-[80px]">{uploader?.name.split(' ')[0]}</span>
                              </div>
                              
                              {isImage ? (
                                <button 
                                  onClick={() => setPreviewImage({ url: file.url, name: file.name })}
                                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                >
                                   View
                                </button>
                              ) : (
                                <a 
                                  href={file.url} 
                                  download={file.name}
                                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                >
                                   Download <Download size={12} />
                                </a>
                              )}
                           </div>
                        </div>
                      );
                   })}
                </div>
            )}
         </div>
      </div>

      {/* Lightbox Reuse */}
      {previewImage && (
         <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
            <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
                <X size={24} />
            </button>
            
            <img 
                src={previewImage.url} 
                alt={previewImage.name} 
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()} 
            />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4" onClick={(e) => e.stopPropagation()}>
                <a 
                    href={previewImage.url} 
                    download={previewImage.name}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg"
                >
                    <Download size={16} />
                    Download Original
                </a>
            </div>
         </div>
      )}
    </div>
  );
}