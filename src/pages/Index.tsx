import { Calendar, ListChecks, LayoutGrid, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CalendarView } from '@/components/CalendarView';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskListView } from '@/components/TaskListView';

type View = 'calendar' | 'tasks' | 'kanban';

const navItems: { key: View; label: string; icon: typeof Calendar }[] = [
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'tasks', label: 'Task List', icon: ListChecks },
  { key: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
];

const Index = () => {
  const store = useAppStore();
  const [activeView, setActiveView] = useState<View>('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora background */}
      <div className="aurora-bg" />

      <div className="relative z-10 flex h-screen">
        {/* Liquid Glass Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[240px] flex-shrink-0 h-full liquid-sidebar flex flex-col py-6 px-3 z-20"
            >
              {/* Logo */}
              <div className="flex items-center justify-between px-3 mb-8">
                <h1 className="text-lg font-bold tracking-tight">
                  <span className="text-primary">Flow</span>
                  <span className="text-muted-foreground font-light">Board</span>
                </h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key)}
                    className={`liquid-nav-item ${activeView === item.key ? 'active' : ''}`}
                  >
                    <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Bottom branding */}
              <div className="mt-auto pt-6 px-3">
                <div className="liquid-glass rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                    Liquid Glass UI
                  </p>
                  <div className="flex gap-1 mt-2">
                    {['bg-primary', 'bg-secondary', 'bg-accent'].map((c, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full ${c} opacity-60`} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="flex items-center gap-3 px-5 py-3 border-b border-border/30">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="glass-button p-2"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <motion.h2
              key={activeView}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold text-muted-foreground capitalize"
            >
              {navItems.find(n => n.key === activeView)?.label}
            </motion.h2>
          </header>

          {/* Content */}
          <main className="flex-1 p-5 overflow-hidden">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeView === 'calendar' && (
                <CalendarView
                  events={store.events}
                  onAddEvent={store.addEvent}
                  onToggleComplete={store.toggleComplete}
                  onConvertToTask={store.convertToTask}
                  onDeleteEvent={store.deleteEvent}
                />
              )}
              {activeView === 'tasks' && (
                <TaskListView
                  events={store.events}
                  onToggleComplete={store.toggleComplete}
                  onConvertToTask={store.convertToTask}
                  onDeleteEvent={store.deleteEvent}
                />
              )}
              {activeView === 'kanban' && (
                <KanbanBoard
                  events={store.events}
                  onToggleComplete={store.toggleComplete}
                  onMoveToColumn={store.moveToColumn}
                  onDeleteEvent={store.deleteEvent}
                />
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
