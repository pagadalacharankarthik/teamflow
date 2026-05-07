'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-accent animate-spin" />
                        <div className="absolute inset-0 w-12 h-12 text-accent/20 animate-ping" />
                    </div>
                    <p className="text-muted-foreground font-bold tracking-widest uppercase text-[10px] animate-pulse">Initializing Workspace</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex transition-colors duration-500">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-6 lg:p-10">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
