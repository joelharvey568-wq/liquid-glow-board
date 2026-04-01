import { Calendar, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { CalendarView } from '@/components/CalendarView';
import { KanbanBoard } from '@/components/KanbanBoard';

const Index = () => {
  const store = useAppStore();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora background */}
      <div className="aurora-bg" />

      <div className="relative z-10 flex flex-col h-screen">
        {/* Top nav */}
        <header className="flex items-center justify-between px-6 py-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tight"
          >
            <span className="text-primary">Flow</span>
            <span className="text-muted-foreground font-light">Board</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex glass-panel p-1 gap-1"
          >
            <button
              onClick={() => store.setActiveView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                store.activeView === 'calendar'
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => store.setActiveView('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                store.activeView === 'kanban'
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Tasks
            </button>
          </motion.div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-6 pb-6 overflow-hidden">
          <motion.div
            key={store.activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {store.activeView === 'calendar' ? (
              <CalendarView
                events={store.events}
                onAddEvent={store.addEvent}
                onToggleComplete={store.toggleComplete}
                onConvertToTask={store.convertToTask}
                onDeleteEvent={store.deleteEvent}
              />
            ) : (
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
  );
};

export default Index;
