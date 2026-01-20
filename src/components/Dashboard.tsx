
import React, { useState, useMemo } from 'react';
import { type Task, PRIORITY, type Project, type Priority } from '../types';

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Finalize Q4 Marketing Budget', priority: PRIORITY.HIGH, time: '2023-10-24', category: 'Marketing', completed: false },
    { id: '2', title: 'Weekly Sync with Design Team', priority: PRIORITY.MEDIUM, time: '2023-10-24', category: 'Product', completed: false },
    { id: '3', title: 'Check flight status for London', priority: PRIORITY.LOW, category: 'Personal', completed: true },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 'p1', name: 'Marketing Deck', color: 'bg-blue-500' },
    { id: 'p2', name: 'Product Launch', color: 'bg-emerald-500' },
    { id: 'p3', name: 'Personal CRM', color: 'bg-amber-500' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(PRIORITY.MEDIUM);
  const [newTaskDate, setNewTaskDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyCompleted, setShowOnlyCompleted] = useState<boolean | null>(null);
  const [activeProjectFilter, setActiveProjectFilter] = useState<string | null>(null);

  // New Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('bg-blue-500');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = showOnlyCompleted === null ? true : task.completed === showOnlyCompleted;
      const matchesProject = activeProjectFilter === null ? true : task.category === activeProjectFilter;
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [tasks, searchQuery, showOnlyCompleted, activeProjectFilter]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setIsAdding(true);
    setTimeout(() => {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        priority: newTaskPriority,
        category: activeProjectFilter || 'Inbox',
        time: newTaskDate || undefined,
        completed: false
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDate('');
      setNewTaskPriority(PRIORITY.MEDIUM);
      setIsAdding(false);
    }, 500);
  };

  const createProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: Project = {
      id: `p${Date.now()}`,
      name: newProjectName,
      color: newProjectColor
    };
    setProjects([...projects, newProj]);
    setNewProjectName('');
    setIsProjectModalOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="flex h-screen overflow-hidden font-public bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* New Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-dark border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Project Name</label>
                <input 
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-white/5 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Color Label</label>
                <div className="flex gap-3">
                  {['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'].map(color => (
                    <button 
                      key={color}
                      onClick={() => setNewProjectColor(color)}
                      className={`size-8 rounded-full ${color} transition-transform ${newProjectColor === color ? 'ring-4 ring-white scale-110' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={createProject} disabled={!newProjectName.trim()} className="flex-1 py-3 rounded-xl font-bold bg-primary text-background-dark hover:opacity-90 disabled:opacity-50 transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black/20 flex flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-accent-red size-10 rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined font-bold">layers</span>
            </div>
            <h1 className="text-xl font-black">Taskflow</h1>
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem icon="inbox" label="All Tasks" active={showOnlyCompleted === null && activeProjectFilter === null} onClick={() => { setShowOnlyCompleted(null); setActiveProjectFilter(null); }} />
            <NavItem icon="check_circle" label="Completed" active={showOnlyCompleted === true} onClick={() => setShowOnlyCompleted(true)} />
            <NavItem icon="pending_actions" label="Pending" active={showOnlyCompleted === false} onClick={() => setShowOnlyCompleted(false)} />
            
            <div className="h-px bg-slate-800 my-4"></div>
            <div className="flex items-center justify-between px-4 mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Projects</p>
              <button onClick={() => setIsProjectModalOpen(true)} className="material-symbols-outlined text-xs hover:text-primary transition-colors">add</button>
            </div>
            {projects.map(p => (
              <button 
                key={p.id} 
                onClick={() => setActiveProjectFilter(p.name)} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors ${activeProjectFilter === p.name ? 'bg-white/10 font-bold text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <span className={`size-2 rounded-full ${p.color}`}></span>
                <span className="text-sm">{p.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl group cursor-pointer" onClick={onLogout}>
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{user.name.charAt(0)}</div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-xs font-bold truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate">Logout Account</p>
          </div>
          <span className="material-symbols-outlined text-slate-500 group-hover:text-accent-red">logout</span>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md px-8 py-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">{activeProjectFilter || 'Workspace'}</h2>
            <p className="text-slate-500">{new Date().toDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-white/5 border-none rounded-full text-sm w-64 outline-none" placeholder="Search your tasks..." type="text"/>
            </div>
            <button onClick={() => { setShowOnlyCompleted(null); setActiveProjectFilter(null); setSearchQuery(''); }} className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-slate-400">tune</span>
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto w-full px-8 py-10">
          <div className="mb-10 p-4 bg-white/5 border border-slate-800 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-accent-red">add_circle</span>
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-slate-600 outline-none" 
                placeholder={`Add a task ${activeProjectFilter ? `to ${activeProjectFilter}` : ''}...`}
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex bg-background-dark rounded-lg p-1 border border-slate-700">
                  <button onClick={() => setNewTaskPriority(PRIORITY.LOW)} className={`px-3 py-1 text-[10px] font-bold rounded ${newTaskPriority === PRIORITY.LOW ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>LOW</button>
                  <button onClick={() => setNewTaskPriority(PRIORITY.MEDIUM)} className={`px-3 py-1 text-[10px] font-bold rounded ${newTaskPriority === PRIORITY.MEDIUM ? 'bg-amber-500/20 text-amber-500' : 'text-slate-500'}`}>MED</button>
                  <button onClick={() => setNewTaskPriority(PRIORITY.HIGH)} className={`px-3 py-1 text-[10px] font-bold rounded ${newTaskPriority === PRIORITY.HIGH ? 'bg-red-500/20 text-red-500' : 'text-slate-500'}`}>HIGH</button>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                   <span className="material-symbols-outlined text-sm">calendar_month</span>
                   <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} className="bg-transparent border-none text-xs text-slate-300 p-0 cursor-pointer"/>
                </div>
              </div>
              <button onClick={addTask} disabled={isAdding || !newTaskTitle.trim()} className="bg-accent-red text-white text-xs font-bold px-8 py-2.5 rounded-full hover:shadow-lg disabled:opacity-30">
                {isAdding ? <span className="animate-spin text-xs material-symbols-outlined">progress_activity</span> : 'Create Task'}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={deleteTask} />
            ))}
          </div>
        </div>
      </main>

      <aside className="w-80 flex-shrink-0 border-l border-slate-800 bg-black/10 flex flex-col p-8 overflow-y-auto">
        <div className="flex flex-col gap-8 h-full">
          {/* DAILY FOCUS CARD - Restyled as per screenshot */}
          <div className="bg-[#1c1f23] p-8 rounded-3xl border border-white/5 shadow-sm flex flex-col items-center min-h-[320px]">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-10 w-full text-left">Daily Focus</h3>
            
            <div className="relative size-44 flex items-center justify-center">
              {/* Circular Progress SVG */}
              <svg className="size-full -rotate-90">
                <circle className="text-white/5" cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" strokeWidth="12"></circle>
                <circle 
                  className="text-accent-red transition-all duration-1000 ease-in-out" 
                  cx="88" cy="88" fill="transparent" r="76" 
                  stroke="currentColor" strokeWidth="16"
                  strokeDasharray="477.5" 
                  strokeDashoffset={477.5 - (477.5 * progressPercent / 100)} 
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{progressPercent}%</span>
                <span className="text-xs font-bold text-slate-500 tracking-widest mt-1">SCORE</span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <p className="text-sm text-slate-400 font-medium">
                You have {tasks.filter(t => !t.completed).length} items remaining
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
             {/* NEW PROJECT BUTTON - Styled to match screenshot */}
             <button 
                onClick={() => setIsProjectModalOpen(true)}
                className="w-full py-5 bg-primary text-background-dark font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
              >
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-2xl">folder</span>
                  <div className="w-6 h-0.5 bg-background-dark -mt-1 rounded-full group-hover:w-8 transition-all"></div>
                </div>
                <span className="text-lg">+ New Project</span>
              </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all ${active ? 'bg-accent-red/10 text-accent-red font-bold' : 'text-slate-400 hover:bg-white/5'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const TaskItem: React.FC<{ task: Task; onToggle: () => void; onDelete: (id: string, e: React.MouseEvent) => void }> = ({ task, onToggle, onDelete }) => (
  <div onClick={onToggle} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${task.completed ? 'bg-white/2 opacity-50' : 'bg-white/5 border-slate-800'}`}>
    <div className={`flex items-center justify-center size-6 rounded-full border-2 ${task.completed ? 'bg-slate-800 border-transparent' : 'border-slate-500'}`}>
      {task.completed && <span className="material-symbols-outlined text-sm text-slate-400">check</span>}
    </div>
    <div className="flex-1">
      <span className={`text-base font-semibold block ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</span>
      <div className="flex items-center gap-3 mt-1 text-[10px]">
        <span className={`flex items-center gap-1 font-black uppercase ${task.priority === PRIORITY.HIGH ? 'text-red-500' : 'text-amber-500'}`}>
          <span className="material-symbols-outlined text-xs">flag</span> Priority {task.priority}
        </span>
        {task.time && <span className="text-slate-500 flex items-center gap-1"><span className="material-symbols-outlined text-xs">calendar_today</span> {task.time}</span>}
        <span className="px-2 py-0.5 bg-white/5 rounded-full text-slate-500">{task.category}</span>
      </div>
    </div>
    <button onClick={(e) => onDelete(task.id, e)} className="material-symbols-outlined text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">delete</button>
  </div>
);

export default Dashboard;
