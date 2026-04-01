import { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CalendarEvent, Category } from '@/store/useAppStore';

interface EventModalProps {
  date: string;
  onClose: () => void;
  onAdd: (event: Omit<CalendarEvent, 'id'>) => void;
}

const categories: { value: Category; label: string }[] = [
  { value: 'work', label: '💼 Work' },
  { value: 'personal', label: '🏠 Personal' },
  { value: 'meeting', label: '📹 Meeting' },
  { value: 'project', label: '🚀 Project' },
  { value: 'health', label: '💪 Health' },
];

export function EventModal({ date, onClose, onAdd }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isMeeting, setIsMeeting] = useState(false);
  const [isTask, setIsTask] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      date,
      time: time || undefined,
      endTime: endTime || undefined,
      category,
      isMeeting,
      isTask,
      completed: false,
      kanbanColumn: isTask ? 'todo' : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative glass-panel glow-primary p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold">New Event</h3>
          <button onClick={onClose} className="glass-button p-1.5"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Event title..."
            className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Start Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">End Time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setCategory(cat.value);
                    if (cat.value === 'meeting') setIsMeeting(true);
                    else setIsMeeting(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    category === cat.value
                      ? `cat-bg-${cat.value} border-current`
                      : 'bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isMeeting} onChange={e => setIsMeeting(e.target.checked)}
                className="rounded accent-[hsl(var(--cat-meeting))]" />
              <span className="text-muted-foreground">Meeting</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isTask} onChange={e => setIsTask(e.target.checked)}
                className="rounded accent-primary" />
              <span className="text-muted-foreground">Add as task</span>
            </label>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:opacity-90 glow-primary">
            Create Event
          </button>
        </form>
      </motion.div>
    </div>
  );
}
