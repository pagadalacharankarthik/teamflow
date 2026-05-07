'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { Download, TrendingUp, Users, CheckCircle, Clock, Loader2, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks');
            return res.data.data;
        }
    });

    const chartData = [
        { name: 'Tom', tasks: 12, completed: 8 },
        { name: 'Sarah', tasks: 19, completed: 15 },
        { name: 'Mike', tasks: 15, completed: 10 },
        { name: 'Anna', tasks: 22, completed: 20 },
    ];

    const statusDistribution = [
        { name: 'Pending', value: 30, color: '#94a3b8' },
        { name: 'In Progress', value: 45, color: '#f59e0b' },
        { name: 'Submitted', value: 25, color: '#4f46e5' },
        { name: 'Approved', value: 20, color: '#10b981' },
    ];

    const exportToCSV = () => {
        if (!chartData.length) return;
        const headers = ['Team Member', 'Active Tasks', 'Completed Tasks', 'Efficiency %'];
        const rows = chartData.map(data => [data.name, data.tasks, data.completed, `${Math.round((data.completed / data.tasks) * 100)}%`]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `TeamFlow_Analytics_${new Date().toLocaleDateString()}.csv`);
        link.click();
    };

    if (isLoading) return (
        <DashboardLayout>
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={40} /></div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black tracking-tight mb-2">Performance Insights</h1>
                    <p className="text-muted-foreground font-medium">Data-driven analytics for team-wide operational excellence.</p>
                </div>
                <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all active:scale-95"
                >
                    <Download size={20} />
                    Export Full Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Total Tasks', value: tasks?.length || 0, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
                    { label: 'Team Velocity', value: '88%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                    { label: 'Active Members', value: '12', icon: Users, color: 'text-amber-600', bg: 'bg-amber-500/10' },
                    { label: 'Avg Turnaround', value: '2.4d', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-500/10' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm flex flex-col justify-between"
                    >
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-6 border border-current/10`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card p-10 rounded-[3rem] border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                            <TrendingUp className="text-accent" />
                            Workload Distribution
                        </h3>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderRadius: '1.5rem', 
                                        border: 'none', 
                                        color: '#fff',
                                        padding: '1rem'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}
                                />
                                <Bar dataKey="tasks" fill="#4f46e5" radius={[10, 10, 10, 10]} barSize={40} />
                                <Bar dataKey="completed" fill="#10b981" radius={[10, 10, 10, 10]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm">
                    <h3 className="text-xl font-black tracking-tight mb-10 flex items-center gap-3">
                        <CheckCircle className="text-emerald-500" />
                        Status Split
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-6">
                        {statusDistribution.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-sm font-black">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
