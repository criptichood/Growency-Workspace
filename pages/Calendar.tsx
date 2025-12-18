import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Briefcase, Palmtree } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useTeam } from '../context/TeamContext';
import { Link } from 'react-router-dom';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarEvent {
  id: string;
  type: 'deadline' | 'holiday' | 'timeoff';
  title: string;
  date: string;
  meta?: any;
}

export function Calendar() {
  const { projects } = useProjects();
  const { users } = useTeam();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // 1. Generate Project Deadline Events
  const projectEvents: CalendarEvent[] = projects.map(p => ({
    id: p.id,
    type: 'deadline',
    title: `Due: ${p.code}`,
    date: p.dueDate, // Assumes YYYY-MM-DD format
    meta: { projectCode: p.code, name: p.name }
  }));

  // 2. Generate Time Off Events (Based on User Status - Mock Logic for Demo)
  // In a real app, this would come from a specific time-off collection.
  // Here we map "Away" users to "Today" just for visualization
  const timeOffEvents: CalendarEvent[] = users
    .filter(u => u.status === 'Away' || u.status === 'Do Not Disturb')
    .map(u => ({
      id: `to-${u.id}`,
      type: 'timeoff',
      title: `${u.name.split(' ')[0]} Off`,
      date: new Date().toISOString().split('T')[0], // Show as today
      meta: { avatar: u.avatarUrl }
    }));

  // 3. Mock Holidays
  const holidays: CalendarEvent[] = [
    { id: 'h1', type: 'holiday', title: 'New Year', date: `${year}-01-01` },
    { id: 'h2', type: 'holiday', title: 'Labor Day', date: `${year}-05-01` },
    { id: 'h3', type: 'holiday', title: 'Christmas', date: `${year}-12-25` },
    { id: 'h4', type: 'holiday', title: 'Company Retreat', date: `${year}-09-15` },
  ];

  const allEvents = [...projectEvents, ...timeOffEvents, ...holidays];

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const totalSlots = Math.ceil((daysInMonth + startDay) / 7) * 7;

  const renderEvent = (evt: CalendarEvent) => {
    switch (evt.type) {
      case 'deadline':
        return (
          <Link 
            key={evt.id} 
            to={`/projects/${evt.meta.projectCode}`}
            className="block text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-1.5 py-1 rounded border border-indigo-100 dark:border-indigo-800 truncate hover:scale-105 transition-transform cursor-pointer mb-1"
            title={`${evt.meta.name} Due Date`}
          >
            <span className="font-bold">Due:</span> {evt.meta.projectCode}
          </Link>
        );
      case 'timeoff':
        return (
          <div key={evt.id} className="flex items-center gap-1 text-[10px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 py-1 rounded border border-amber-100 dark:border-amber-800/30 mb-1 opacity-80">
            <Palmtree size={10} />
            <span className="truncate">{evt.title}</span>
          </div>
        );
      case 'holiday':
        return (
          <div key={evt.id} className="flex items-center gap-1 text-[10px] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-1.5 py-1 rounded border border-green-100 dark:border-green-800/30 mb-1">
            <span className="truncate font-bold">{evt.title}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const calendarDays = Array.from({ length: totalSlots }).map((_, index) => {
    const day = index - startDay + 1;
    const isCurrentMonth = day > 0 && day <= daysInMonth;
    const dateStr = isCurrentMonth 
      ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      : null;
    
    const dayEvents = dateStr ? allEvents.filter(e => e.date === dateStr) : [];
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    return { day, isCurrentMonth, dateStr, dayEvents, isToday };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <CalendarIcon className="text-indigo-600 dark:text-indigo-400" size={32} />
            Company Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Track project deadlines, holidays, and team availability.
          </p>
        </div>

        <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
            <ChevronLeft size={20} />
          </button>
          <div className="px-4 font-bold text-gray-900 dark:text-white min-w-[140px] text-center">
            {MONTHS[month]} {year}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
            <ChevronRight size={20} />
          </button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <button onClick={goToday} className="px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
            Today
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {DAYS.map(day => (
            <div key={day} className="py-3 text-center text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-900/30">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((cell, idx) => (
            <div 
              key={idx} 
              className={`p-2 border-b border-r border-gray-100 dark:border-gray-700/50 flex flex-col ${
                !cell.isCurrentMonth ? 'bg-gray-50/30 dark:bg-gray-900/20' : ''
              } ${cell.isToday ? 'bg-indigo-50/20 dark:bg-indigo-900/10' : ''}`}
            >
              {cell.isCurrentMonth && (
                <>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                      cell.isToday 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {cell.day}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                    {cell.dayEvents.map(evt => renderEvent(evt))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-indigo-500"></div> Project Deadline
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div> Company Holiday
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500 opacity-80"></div> Team Time Off
        </div>
      </div>
    </div>
  );
}