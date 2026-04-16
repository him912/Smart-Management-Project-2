import { useState, useEffect, useMemo } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { LayoutDashboard, ListTodo, Settings, Wallet } from 'lucide-react';
import { cn } from './lib/utils';

const STORAGE_KEY = 'smartspend_expenses';

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
    minAmount: 0,
    maxAmount: Infinity,
    searchQuery: '',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpense) => {
    const expense = {
      ...newExpense,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filtering
    if (filters.category !== 'All') {
      result = result.filter((exp) => exp.category === filters.category);
    }
    if (filters.searchQuery) {
      result = result.filter((exp) => 
        exp.note.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, filters, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-black selection:text-white">
      {/* Sidebar / Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 bg-white/80 backdrop-blur-xl border border-zinc-200 p-2 rounded-full md:rounded-3xl shadow-2xl z-50 flex md:flex-col gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={cn(
            "p-4 rounded-full md:rounded-2xl transition-all duration-300",
            activeTab === 'dashboard' ? "bg-black text-white shadow-lg scale-110" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
          )}
        >
          <LayoutDashboard size={24} />
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={cn(
            "p-4 rounded-full md:rounded-2xl transition-all duration-300",
            activeTab === 'expenses' ? "bg-black text-white shadow-lg scale-110" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
          )}
        >
          <ListTodo size={24} />
        </button>
        <div className="hidden md:block w-8 h-px bg-zinc-200 my-2 mx-auto" />
        <button className="p-4 rounded-full md:rounded-2xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
          <Settings size={24} />
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-32 md:pl-32">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-black p-2 rounded-xl">
                <Wallet className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">SmartSpend</h1>
            </div>
            <p className="text-zinc-500 font-medium">Track, analyze, and master your finances.</p>
          </div>
          <ExpenseForm onAddExpense={addExpense} />
        </header>

        {/* Content */}
        <div className="space-y-12">
          {activeTab === 'dashboard' ? (
            <Dashboard expenses={expenses} />
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Transaction History</h2>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  {filteredAndSortedExpenses.length} Entries
                </span>
              </div>
              <ExpenseList
                expenses={filteredAndSortedExpenses}
                onDeleteExpense={deleteExpense}
                filters={filters}
                setFilters={setFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="max-w-6xl mx-auto px-6 py-12 md:pl-32 border-t border-zinc-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-400 text-sm font-medium">
          <p>© 2024 SmartSpend. Built for financial clarity.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
