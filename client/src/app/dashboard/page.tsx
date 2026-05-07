'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Send,
    TrendingUp,
    Users,
    Loader2,
    Calendar,
    Target
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const { user } = useAuth();

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks');
            return res.data.data;
        }
    });

    if (isLoading) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Dashboard Data</p>
            </div>
        </DashboardLayout>
    );

    const stats = [
        { label: 'Total Tasks', value: tasks?.length || 0, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
        { label: 'Completed', value: tasks?.filter((t: any) => t.status === 'approved').length || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
        { label: 'Pending', value: tasks?.filter((t: any) => t.status === 'pending').length || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10' },
        { label: 'Overdue', value: tasks?.filter((t: any) => t.status === 'overdue').length || 0, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    ];

    const statusData = [
        { name: 'Pending', value: tasks?.filter((t: any) => t.status === 'pending').length || 0 },
        { name: 'In Progress', value: tasks?.filter((t: any) => t.status === 'in-progress').length || 0 },
        { name: 'Submitted', value: tasks?.filter((t: any) => t.status === 'submitted').length || 0 },
        { name: 'Approved', value: tasks?.filter((t: any) => t.status === 'approved').length || 0 },
    ];

    const COLORS = ['#94a3b8', '#f59e0b', '#4f46e5', '#10b981'];

    return (
        <DashboardLayout>
            <header className="mb-12">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-black tracking-tight text-foreground"
                >
                    Welcome back, <span className="text-accent">{user?.name}</span>!
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground font-medium mt-2"
                >
                    Here's a high-level summary of your operational metrics today.
                </motion.p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border flex items-center gap-6 group hover:border-accent/20 transition-all"
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center border border-current/10 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-foreground">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card p-10 rounded-[3rem] shadow-sm border border-border"
                >
                    <h3 className="text-xl font-black tracking-tight text-foreground mb-10 flex items-center gap-3">
                        <Target className="text-accent" />
                        Status Distribution
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} 
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                    contentStyle={{ 
                                        borderRadius: '1.5rem', 
                                        border: 'none', 
                                        backgroundColor: '#0f172a',
                                        color: '#fff',
                                        padding: '1rem'
                                    }}
                                    itemStyle={{ color: '#fff', fontWeight: 700, fontSize: '12px' }}
                                />
                                <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 10, 10]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Pie Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card p-10 rounded-[3rem] shadow-sm border border-border"
                >
                    <h3 className="text-xl font-black tracking-tight text-foreground mb-10 flex items-center gap-3">
                        <TrendingUp className="text-emerald-500" />
                        Composition
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-8 flex-wrap">
                        {statusData.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
