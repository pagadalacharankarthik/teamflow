'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Zap, Shield, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const Github = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

const Linkedin = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

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
            <footer className="border-t border-slate-100 bg-slate-50/50 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">T</div>
                        <span className="text-lg font-bold text-slate-900">TeamFlow Pro</span>
                    </div>
                    
                    <p className="text-slate-500 text-sm">© 2026 TeamFlow Pro. All rights reserved.</p>
                    
                    <div className="flex items-center gap-6">
                        <a 
                            href="https://github.com/pagadalacharankarthik" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            <Github size={20} />
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/pagadala-charan-karthik-67a614354/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
