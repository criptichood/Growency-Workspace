
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
}

interface SearchableDropdownProps {
  label?: string;
  icon?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
}

export function SearchableDropdown({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  searchable = true
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.subtitle && opt.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full relative text-left bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-11 pr-10 text-sm font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${isOpen ? 'ring-4 ring-indigo-500/10 border-indigo-500' : ''}`}
      >
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <span className={`block truncate ${!selectedOption ? 'text-gray-400 font-medium' : 'text-gray-900 dark:text-white'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronDown 
          size={16} 
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
          
          {/* Search Input */}
          {(searchable && options.length > 5) && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto overflow-x-hidden">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 font-medium">No results found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 last:border-0 transition-colors group ${
                    value === opt.value
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {opt.icon && <span className="shrink-0 text-gray-400 group-hover:text-indigo-500 transition-colors">{opt.icon}</span>}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate">{opt.label}</span>
                      {opt.subtitle && (
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 truncate">{opt.subtitle}</span>
                      )}
                    </div>
                  </div>
                  {value === opt.value && <Check size={16} className="shrink-0 ml-2" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
