import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Edit2, Check, ChevronDown, Clock, AlertCircle, Flag } from 'lucide-react';
import { Task, SortOption } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [isAdding, setIsAdding] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [removingTask, setRemovingTask] = useState<string | null>(null);
  const [showPriorityMenu, setShowPriorityMenu] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        priority: 'medium',
        completed: false,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        color: getPriorityColor('medium').color
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setIsAdding(false);
    }
  };

  const deleteTask = (id: string) => {
    setRemovingTask(id);
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== id));
      setRemovingTask(null);
    }, 300);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const getPriorityColor = (priority: string): { text: string; color: string; bg: string } => {
    switch (priority) {
      case 'high':
        return { text: 'text-red-400', color: '#ef4444', bg: 'bg-red-500/20' };
      case 'medium':
        return { text: 'text-yellow-400', color: '#eab308', bg: 'bg-yellow-500/20' };
      case 'low':
        return { text: 'text-green-400', color: '#22c55e', bg: 'bg-green-500/20' };
      default:
        return { text: 'text-gray-400', color: '#9ca3af', bg: 'bg-gray-500/20' };
    }
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'priority', label: 'Sort by Priority' },
    { value: 'dueDate', label: 'Sort by Due Date' },
    { value: 'title', label: 'Sort by Title' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'dueDate':
        return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl w-full max-w-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white/90">Tasks</h1>
            <button
              onClick={() => setIsAdding(true)}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="relative mb-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full bg-white/5 text-white/80 rounded-lg px-3 sm:px-4 py-2 outline-none border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-between"
            >
              <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
              <ChevronDown
                size={16}
                className={`transform transition-transform duration-300 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isFilterOpen && (
              <div className="absolute w-full mt-2 bg-black/60 backdrop-blur-lg rounded-lg border border-white/10 shadow-lg overflow-hidden animate-slideDown z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 ${
                      sortBy === option.value
                        ? 'text-white bg-white/10'
                        : 'text-white/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAdding && (
            <div className="mb-6 bg-white/5 p-4 sm:p-6 rounded-xl border border-white/10 shadow-lg animate-slideDown">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task..."
                className="w-full bg-black/40 text-white/90 rounded-lg px-3 sm:px-4 py-2 sm:py-3 mb-4 outline-none border border-white/10 placeholder-white/40"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 sm:px-5 py-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition-all duration-300 border border-white/10 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-3 sm:px-5 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 border border-white/10 text-sm sm:text-base"
                >
                  Add Task
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className={`bg-white/5 rounded-xl p-3 sm:p-5 transition-all duration-300 border border-white/10 hover:bg-white/10 ${
                  removingTask === task.id ? 'animate-fadeOut' : 'animate-slideIn'
                }`}
                style={{
                  borderLeft: `4px solid ${task.color}`,
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={`rounded-full p-2 transition-all duration-300 flex-shrink-0 ${
                        task.completed ? `${getPriorityColor(task.priority).bg} ${getPriorityColor(task.priority).text}` : 'bg-white/5 text-white/40'
                      }`}
                    >
                      <Check 
                        size={16} 
                        className={`transform transition-transform duration-300 hover:scale-110 ${
                          task.completed ? 'animate-checkmark' : ''
                        }`} 
                      />
                    </button>
                    {editingTask === task.id ? (
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTask(task.id, { title: e.target.value })}
                        className="bg-black/40 text-white/90 rounded-lg px-3 py-1 outline-none border border-white/10 min-w-0 flex-1"
                        onBlur={() => setEditingTask(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingTask(null)}
                        autoFocus
                      />
                    ) : (
                      <span className={`text-white/90 ${task.completed ? 'line-through text-white/50' : ''} break-all`}>
                        {task.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 ml-10 sm:ml-0">
                    <div className="relative">
                      <button
                        onClick={() => setShowPriorityMenu(showPriorityMenu === task.id ? null : task.id)}
                        className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg ${getPriorityColor(task.priority).bg} ${getPriorityColor(task.priority).text} transition-all duration-300 hover:opacity-80 text-sm whitespace-nowrap`}
                      >
                        <Flag size={14} />
                        <span className="capitalize hidden sm:inline">{task.priority}</span>
                      </button>
                      
                      {showPriorityMenu === task.id && (
                        <div className="absolute right-0 mt-2 bg-black/60 backdrop-blur-lg rounded-lg border border-white/10 shadow-lg overflow-hidden animate-slideDown z-20 w-40">
                          {priorityOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                updateTask(task.id, { 
                                  priority: option.value,
                                  color: getPriorityColor(option.value).color
                                });
                                setShowPriorityMenu(null);
                              }}
                              className={`w-full px-3 py-2 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-2 ${
                                task.priority === option.value
                                  ? `${getPriorityColor(option.value).text} bg-white/10`
                                  : 'text-white/80'
                              }`}
                            >
                              <Flag size={14} />
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingTask(task.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/40 hover:text-white/90"
                    >
                      <Edit2 size={16} className="transform transition-transform duration-300 hover:scale-110" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/40 hover:text-white/90"
                    >
                      <X size={16} className="transform transition-transform duration-300 hover:scale-110" />
                    </button>
                  </div>
                </div>
                {task.dueDate && (
                  <div className="mt-3 text-sm text-white/40 flex items-center gap-2">
                    <Clock size={14} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;