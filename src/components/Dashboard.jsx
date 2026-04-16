import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis } from 'recharts';
import { CATEGORIES, CATEGORY_COLORS } from '../constants';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, CreditCard, Wallet } from 'lucide-react';

export function Dashboard({ expenses }) {
  const totalSpent = useMemo(() => 
    expenses.reduce((sum, exp) => sum + exp.amount, 0),
  [expenses]);

  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const amount = expenses
        .filter(exp => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { name: cat, value: amount, color: CATEGORY_COLORS[cat] };
    }).filter(data => data.value > 0);
  }, [expenses]);

  const recentDailyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const amount = expenses
        .filter(exp => exp.date === date)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { 
        date: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(date)), 
        amount 
      };
    });
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black text-white p-6 rounded-3xl shadow-xl overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Total Balance</p>
            <h3 className="text-4xl font-bold tracking-tight mb-4">{formatCurrency(totalSpent)}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <TrendingUp size={14} className="text-emerald-400" />
              <span>+12.5% from last month</span>
            </div>
          </div>
          <Wallet className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-zinc-100 rounded-2xl">
              <CreditCard className="text-zinc-600" size={20} />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Expenses</span>
          </div>
          <p className="text-zinc-500 text-sm font-medium mb-1">Total Transactions</p>
          <h3 className="text-2xl font-bold text-zinc-900">{expenses.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Avg. Daily</span>
          </div>
          <p className="text-zinc-500 text-sm font-medium mb-1">Daily Average</p>
          <h3 className="text-2xl font-bold text-zinc-900">
            {formatCurrency(totalSpent / (expenses.length || 1))}
          </h3>
        </div>
      </div>

      {/* Charts */}
      <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <h3 className="text-lg font-bold text-zinc-900 mb-6">Spending Trend (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recentDailyData}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                formatter={(value) => [formatCurrency(value), 'Spent']}
              />
              <Bar 
                dataKey="amount" 
                fill="#000000" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
        <h3 className="text-lg font-bold text-zinc-900 mb-6">Category Distribution</h3>
        <div className="h-[250px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                }}
                formatter={(value) => [formatCurrency(value), 'Total']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {categoryData.map((data) => (
            <div key={data.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                <span className="text-sm font-medium text-zinc-600">{data.name}</span>
              </div>
              <span className="text-sm font-bold text-zinc-900">{formatCurrency(data.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
