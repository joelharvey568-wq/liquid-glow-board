import { useState, useCallback } from 'react';

export type Category = 'work' | 'personal' | 'meeting' | 'project' | 'health';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  endTime?: string;
  category: Category;
  isMeeting: boolean;
  isTask: boolean;
  completed: boolean;
  description?: string;
  kanbanColumn?: 'todo' | 'in-progress' | 'done';
}

const generateId = () => Math.random().toString(36).slice(2, 10);

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

const initialEvents: CalendarEvent[] = [
  { id: generateId(), title: 'Team Standup', date: fmt(today), time: '09:00', endTime: '09:30', category: 'meeting', isMeeting: true, isTask: false, completed: false, kanbanColumn: 'todo' },
  { id: generateId(), title: 'Design Review', date: fmt(addDays(today, 1)), time: '14:00', endTime: '15:00', category: 'meeting', isMeeting: true, isTask: false, completed: false, kanbanColumn: 'todo' },
  { id: generateId(), title: 'Build Dashboard UI', date: fmt(today), category: 'work', isMeeting: false, isTask: true, completed: false, kanbanColumn: 'in-progress' },
  { id: generateId(), title: 'Update API Docs', date: fmt(addDays(today, 2)), category: 'project', isMeeting: false, isTask: true, completed: false, kanbanColumn: 'todo' },
  { id: generateId(), title: 'Morning Run', date: fmt(addDays(today, 1)), time: '07:00', category: 'health', isMeeting: false, isTask: true, completed: true, kanbanColumn: 'done' },
  { id: generateId(), title: 'Lunch with Sarah', date: fmt(addDays(today, 3)), time: '12:30', category: 'personal', isMeeting: false, isTask: false, completed: false, kanbanColumn: 'todo' },
  { id: generateId(), title: 'Sprint Planning', date: fmt(addDays(today, 4)), time: '10:00', endTime: '11:30', category: 'meeting', isMeeting: true, isTask: false, completed: false, kanbanColumn: 'todo' },
];

export function useAppStore() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [activeView, setActiveView] = useState<'calendar' | 'kanban'>('calendar');

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: generateId() }]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const completed = !e.completed;
      return { ...e, completed, kanbanColumn: completed ? 'done' : 'todo' };
    }));
  }, []);

  const moveToColumn = useCallback((id: string, column: 'todo' | 'in-progress' | 'done') => {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      return { ...e, kanbanColumn: column, completed: column === 'done' };
    }));
  }, []);

  const convertToTask = useCallback((id: string) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, isTask: true, kanbanColumn: 'todo' } : e
    ));
  }, []);

  return {
    events, activeView, setActiveView,
    addEvent, updateEvent, deleteEvent,
    toggleComplete, moveToColumn, convertToTask,
  };
}
