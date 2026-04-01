import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Video, Trash2, ListTodo, ArrowRight } from 'lucide-react';
import type { CalendarEvent, Category } from '@/store/useAppStore';

interface TaskListViewProps {
  events: CalendarEvent[];
  onToggleComplete: (id: string) => void;
  onConvertToTask: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const catDot: Record<Category, string> = {
  work: 'cat-dot-work', personal: 'cat-dot-personal', meeting: 'cat-dot-meeting',
  project: 'cat-dot-project', health: 'cat-dot-health',
};

const catClass: Record<Category, string> = {
  work: 'cat-bg-work', personal: 'cat-bg-personal', meeting: 'cat-bg-meeting',
  project: 'cat-bg-project', health: 'cat-bg-health',
};

export function TaskListView({ events, onToggleComplete, onConvertToTask, onDeleteEvent }: TaskListViewProps) {
  const tasks = events.filter(e => e.isTask);
  const nonTaskEvents = events.filter(e => !e.isTask && !e.isMeeting);
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-thin pb-4">
      {/* Active Tasks */}
      <div className="liquid-glass p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Active Tasks
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full liquid-glass text-muted-foreground">
            {activeTasks.length}
          </span>
        </div>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {activeTasks.map((task, i) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.03 }}
                className={`group p-3 rounded-xl border transition-all duration-200 ${catClass[task.category]} hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => onToggleComplete(task.id)} className="flex-shrink-0">
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${catDot[task.category]}`} />
                      <span className="text-[10px] text-muted-foreground capitalize">{task.category}</span>
                      {task.isMeeting && <Video className="w-3 h-3 text-[hsl(var(--cat-meeting))]" />}
                      <span className="text-[10px] text-muted-foreground">{task.date.slice(5)}</span>
                      {task.kanbanColumn && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded liquid-glass text-muted-foreground capitalize">
                          {task.kanbanColumn.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteEvent(task.id)}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {activeTasks.length === 0 && (
            <p className="text-sm text-muted-foreground/50 text-center py-8">No active tasks</p>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="liquid-glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              Completed
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full liquid-glass text-muted-foreground">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {completedTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`group p-3 rounded-xl border transition-all duration-200 completed-event ${catClass[task.category]}`}
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => onToggleComplete(task.id)} className="flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate line-through">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${catDot[task.category]}`} />
                        <span className="text-[10px] text-muted-foreground capitalize">{task.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteEvent(task.id)}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Convert non-task events */}
      {nonTaskEvents.length > 0 && (
        <div className="liquid-glass p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            Events (convert to task)
          </h3>
          <div className="space-y-2">
            {nonTaskEvents.slice(0, 5).map(ev => (
              <div key={ev.id} className={`p-3 rounded-xl border ${catClass[ev.category]} flex items-center gap-3`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{ev.title}</p>
                  <span className="text-[10px] text-muted-foreground">{ev.date.slice(5)}</span>
                </div>
                <button
                  onClick={() => onConvertToTask(ev.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
