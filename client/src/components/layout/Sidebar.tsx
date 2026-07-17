'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
    LayoutDashboard, 
    Briefcase, 
    CheckSquare, 
    Users, 
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    BarChart3,
    Bell,
    Circle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    // Close sidebar on mobile when navigating to a new page
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    }, [pathname]);

    const { data: tasks } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks');
            return res.data.data;
        }
    });

    // Filter tasks assigned to current user created in the last 24 hours
    const notifications = tasks?.filter((t: any) => 
        t.assignedTo?._id === user?.id && 
        new Date(t.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ) || [];

    const adminLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: Briefcase },
        { name: 'Task Board', href: '/tasks', icon: CheckSquare },
        { name: 'Team Management', href: '/team', icon: Users },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
    ];

    const memberLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Projects', href: '/projects', icon: Briefcase },
    ];

    const links = user?.role === 'admin' ? adminLinks : memberLinks;

    if (!mounted) return null;

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800"
            >
                {isOpen ? <X size={20} className="text-slate-900 dark:text-white" /> : <Menu size={20} className="text-slate-900 dark:text-white" />}
            </button>

            <AnimatePresence initial={false} mode='wait'>
                {isOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 w-64 flex flex-col z-40 transition-all duration-300"
                    >
                        {/* Logo Section */}
                        <div className="p-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-accent/20">
                                    T
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">TeamFlow</span>
                                    {user?.company && (
                                        <span className="text-[10px] font-black text-accent uppercase tracking-widest mt-1 truncate max-w-[120px] leading-none">
                                            {user.company.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Notification Bell */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors relative"
                                >
                                    <Bell size={20} className="text-slate-500 dark:text-slate-400" />
                                    {notifications.length > 0 && (
                                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-12 left-0 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Notifications</h4>
                                                <span className="text-[10px] font-bold text-accent">{notifications.length} New</span>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                                {notifications.length > 0 ? (
                                                    notifications.map((n: any) => (
                                                        <div key={n._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                                                            <div className="flex gap-3">
                                                                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0">
                                                                    <CheckSquare size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">New Assignment at TeamFlow</p>
                                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                                                        You were assigned to: <span className="text-foreground font-bold">"{n.title}"</span>
                                                                    </p>
                                                                    <p className="text-[9px] text-slate-400 mt-2 font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center space-y-2">
                                                        <Bell size={24} className="mx-auto text-slate-200 dark:text-slate-800" />
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No New Alerts</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                            <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Main Fleet</p>
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                            isActive 
                                                ? 'bg-accent text-white shadow-xl shadow-accent/20' 
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-white' : 'group-hover:text-accent transition-colors'} />
                                        <span className="text-sm font-bold">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer Section */}
                        <div className="p-6 space-y-6 border-t border-slate-100 dark:border-slate-900">
                            {/* Theme Switcher */}
                            <button 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-accent/30 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-accent/10 text-accent'}`}>
                                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                    </div>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                                        {theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}
                                    </span>
                                </div>
                                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-800 rounded-full relative p-1 transition-colors">
                                    <div className={`w-3 h-3 rounded-full bg-accent transition-all duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>

                            {/* User Profile */}
                            <div className="flex items-center gap-4 px-2">
                                <div className="w-12 h-12 rounded-2xl bg-accent/10 border-2 border-accent/10 flex items-center justify-center text-accent font-black text-xl">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate leading-tight">{user?.name}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">{user?.role}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Logout */}
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-500/5 rounded-2xl transition-all font-bold group"
                            >
                                <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                <span className="text-sm">Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
