'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Zap, Shield, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push('/dashboard');
            }
        }
    }, [user, loading, router]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                    <span className="text-xl font-bold text-slate-900">TeamFlow Pro</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => router.push('/login')} className="text-slate-600 font-medium hover:text-indigo-600">Sign In</button>
                    <button onClick={() => router.push('/signup')} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Get Started</button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 pt-20 pb-32">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight"
                    >
                        Manage your team with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Precision.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 mt-6"
                    >
                        The all-in-one task management platform built for modern teams. 
                        Track progress, manage projects, and streamline approvals.
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <button onClick={() => router.push('/signup')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
                            Start Free Trial
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                            View Demo
                        </button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, title: "Smart Priorities", desc: "Automated priority calculation based on upcoming deadlines." },
                        { icon: Layout, title: "Kanban Board", desc: "Intuitive drag-and-drop workflow to visualize task progress." },
                        { icon: Shield, title: "Role-based Access", desc: "Secure permissions for admins and team members." }
                    ].map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:text-indigo-600 transition-colors">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
