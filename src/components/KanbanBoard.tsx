import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, GripVertical, Video, Trash2 } from 'lucide-react';
import type { CalendarEvent, Category } from '@/store/useAppStore';

interface KanbanBoardProps {
  events: CalendarEvent[];
  onToggleComplete: (id: string) => void;
  onMoveToColumn: (id: string, column: 'todo' | 'in-progress' | 'done') => void;
  onDeleteEvent: (id: string) => void;
}

const columns: { key: 'todo' | 'in-progress' | 'done'; label: string; glow: string }[] = [
  { key: 'todo', label: 'To Do', glow: 'hsl(var(--primary) / 0.2)' },
  { key: 'in-progress', label: 'In Progress', glow: 'hsl(var(--secondary) / 0.2)' },
  { key: 'done', label: 'Done', glow: 'hsl(150 80% 50% / 0.2)' },
];

const catDot: Record<Category, string> = {
  work: 'cat-dot-work', personal: 'cat-dot-personal', meeting: 'cat-dot-meeting',
  project: 'cat-dot-project', health: 'cat-dot-health',
};

const catClass: Record<Category, string> = {
  work: 'cat-bg-work', personal: 'cat-bg-personal', meeting: 'cat-bg-meeting',
  project: 'cat-bg-project', health: 'cat-bg-health',
};

export function KanbanBoard({ events, onToggleComplete, onMoveToColumn, onDeleteEvent }: KanbanBoardProps) {
  const tasks = events.filter(e => e.isTask || e.kanbanColumn);

  const getColumnTasks = (col: 'todo' | 'in-progress' | 'done') =>
    tasks.filter(t => (t.kanbanColumn || 'todo') === col);

  const handleDrop = (e: React.DragEvent, column: 'todo' | 'in-progress' | 'done') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onMoveToColumn(id, column);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {columns.map((col, ci) => (
        <motion.div
          key={col.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ci * 0.1 }}
          className="glass-panel p-4 flex flex-col"
          style={{ boxShadow: `0 0 30px -10px ${col.glow}` }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, col.key)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{col.label}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
              {getColumnTasks(col.key).length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
            <AnimatePresence mode="popLayout">
              {getColumnTasks(col.key).map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`
                    group p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-200
                    ${catClass[task.category]}
                    ${task.completed ? 'completed-event' : ''}
                    hover:scale-[1.02]
                  `}
                  {...{ draggable: true } as any}
                  onDragStartCapture={undefined}
                  ref={(node: HTMLDivElement | null) => {
                    if (node) {
                      node.ondragstart = (ev) => {
                        ev.dataTransfer?.setData('text/plain', task.id);
                      };
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button onClick={() => onToggleComplete(task.id)} className="mt-0.5 flex-shrink-0">
                      {task.completed
                        ? <CheckCircle2 className="w-4 h-4 text-primary" />
                        : <Circle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${catDot[task.category]}`} />
                        <span className="text-[10px] text-muted-foreground capitalize">{task.category}</span>
                        {task.isMeeting && <Video className="w-3 h-3 text-[hsl(var(--cat-meeting))]" />}
                        {task.date && <span className="text-[10px] text-muted-foreground">{task.date.slice(5)}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteEvent(task.id)}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Column move buttons */}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {columns.filter(c => c.key !== (task.kanbanColumn || 'todo')).map(c => (
                      <button
                        key={c.key}
                        onClick={() => onMoveToColumn(task.id, c.key)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → {c.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {getColumnTasks(col.key).length === 0 && (
              <div className="flex items-center justify-center h-24 text-xs text-muted-foreground/50 border border-dashed border-border/30 rounded-xl">
                Drop tasks here
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
