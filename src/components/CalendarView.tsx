import { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Video, CheckCircle2, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CalendarEvent, Category } from '@/store/useAppStore';
import { EventModal } from './EventModal';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onToggleComplete: (id: string) => void;
  onConvertToTask: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const catClass: Record<Category, string> = {
  work: 'cat-bg-work',
  personal: 'cat-bg-personal',
  meeting: 'cat-bg-meeting',
  project: 'cat-bg-project',
  health: 'cat-bg-health',
};

const catDot: Record<Category, string> = {
  work: 'cat-dot-work',
  personal: 'cat-dot-personal',
  meeting: 'cat-dot-meeting',
  project: 'cat-dot-project',
  health: 'cat-dot-health',
};

export function CalendarView({ events, onAddEvent, onToggleComplete, onConvertToTask, onDeleteEvent }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) { days.push(day); day = addDays(day, 1); }

  const getEventsForDay = (d: Date) =>
    events.filter(e => isSameDay(new Date(e.date), d));

  const selectedEvents = selectedDate
    ? events.filter(e => e.date === selectedDate)
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Grid */}
      <div className="flex-1 glass-panel p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="glass-button p-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="glass-button p-2">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const dayEvents = getEventsForDay(d);
            const dateStr = format(d, 'yyyy-MM-dd');
            const isSelected = selectedDate === dateStr;
            const hasMeeting = dayEvents.some(e => e.isMeeting);

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.008 }}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`
                  relative min-h-[80px] p-1.5 rounded-xl text-left transition-all duration-200
                  ${!isSameMonth(d, currentMonth) ? 'opacity-30' : ''}
                  ${isToday(d) ? 'ring-1 ring-primary/50' : ''}
                  ${isSelected ? 'glass-panel glow-primary' : 'hover:bg-muted/30'}
                  ${hasMeeting ? 'ring-1 ring-[hsl(var(--cat-meeting)_/_0.3)]' : ''}
                `}
              >
                <span className={`text-xs font-medium ${isToday(d) ? 'text-primary' : ''}`}>
                  {format(d, 'd')}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      className={`
                        text-[10px] leading-tight truncate rounded px-1 py-0.5 border
                        ${catClass[ev.category]}
                        ${ev.completed ? 'completed-event' : ''}
                        ${ev.isMeeting ? 'cat-glow-meeting' : ''}
                      `}
                    >
                      {ev.isMeeting && <Video className="inline w-2.5 h-2.5 mr-0.5" />}
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} more</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
          {(['work','personal','meeting','project','health'] as Category[]).map(cat => (
            <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`w-2.5 h-2.5 rounded-full ${catDot[cat]}`} />
              <span className="capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side Panel - Selected Day */}
      <div className="w-full lg:w-80 glass-panel p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">
            {selectedDate ? format(new Date(selectedDate), 'EEEE, MMM d') : 'Select a day'}
          </h3>
          {selectedDate && (
            <button onClick={() => setShowModal(true)} className="glass-button p-1.5">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
          <AnimatePresence mode="popLayout">
            {selectedEvents.length === 0 && selectedDate && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground text-center mt-8">
                No events. Click + to add one.
              </motion.p>
            )}
            {selectedEvents.map(ev => (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`
                  p-3 rounded-xl border transition-all duration-300
                  ${catClass[ev.category]}
                  ${ev.completed ? 'completed-event' : ''}
                  ${ev.isMeeting ? 'cat-glow-meeting' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {ev.isMeeting && <Video className="w-3.5 h-3.5 flex-shrink-0 text-[hsl(var(--cat-meeting))]" />}
                      <span className={`text-sm font-medium truncate ${ev.completed ? 'line-through' : ''}`}>
                        {ev.title}
                      </span>
                    </div>
                    {ev.time && (
                      <span className="text-xs text-muted-foreground mt-0.5 block">
                        {ev.time}{ev.endTime ? ` - ${ev.endTime}` : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {ev.isTask && (
                      <button
                        onClick={() => onToggleComplete(ev.id)}
                        className={`p-1 rounded-lg transition-colors ${ev.completed ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {!ev.isTask && !ev.isMeeting && (
                      <button
                        onClick={() => onConvertToTask(ev.id)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                        title="Convert to task"
                      >
                        <ListTodo className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && selectedDate && (
        <EventModal
          date={selectedDate}
          onClose={() => setShowModal(false)}
          onAdd={onAddEvent}
        />
      )}
    </div>
  );
}
