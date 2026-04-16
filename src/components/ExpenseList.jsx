import { Trash2, Search, Filter, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function ExpenseList({
  expenses,
  onDeleteExpense,
  filters,
  setFilters,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-zinc-100">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-2xl border border-zinc-100">
            <Filter size={16} className="text-zinc-500" />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-2xl border border-zinc-100">
            <ArrowUpDown size={16} className="text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {expenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200"
            >
              <p className="text-zinc-500 font-medium">No expenses found matching your criteria.</p>
            </motion.div>
          ) : (
            expenses.map((expense) => (
              <motion.div
                key={expense.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    "bg-zinc-100 text-zinc-600 group-hover:bg-black group-hover:text-white"
                  )}>
                    <CategoryIcon category={expense.category} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">
                      {expense.note || expense.category}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-zinc-900">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
