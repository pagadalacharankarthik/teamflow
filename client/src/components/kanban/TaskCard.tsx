'use client';

import { motion } from 'framer-motion';
import { Calendar, FileCheck, AlertCircle } from 'lucide-react';

interface Task {
    _id: string;
    title: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'overdue';
    deadline: string;
    assignedTo: { name: string };
    submission?: any;
}

export default function TaskCard({ task, onClick }: { task: Task, onClick: () => void }) {
    const priorityStyles = {
        low: 'bg-muted text-muted-foreground border-border',
        medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        high: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };

    const isOverdue = task.status === 'overdue' || (new Date(task.deadline) < new Date() && task.status !== 'approved');

    return (
        <motion.div
            whileHover={{ y: -4, shadow: '0 15px 30px -10px rgb(0 0 0 / 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-5 rounded-[1.5rem] border bg-card border-border shadow-sm cursor-pointer transition-all ${isOverdue ? 'ring-2 ring-rose-500/20 border-rose-500/30' : 'hover:border-accent/30'}`}
        >
            <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
                    {task.priority}
                </span>
                {task.submission && (
                    <div className="bg-accent/10 p-1 rounded-lg">
                        <FileCheck size={14} className="text-accent" />
                    </div>
                )}
            </div>

            <h4 className="text-sm font-bold tracking-tight text-foreground mb-5 line-clamp-2 leading-relaxed">{task.title}</h4>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-[10px] font-black uppercase text-accent border border-accent/20">
                        {task.assignedTo?.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground truncate max-w-[100px]">{task.assignedTo?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                    <Calendar size={12} className={isOverdue ? 'text-rose-500' : ''} />
                    <span className={isOverdue ? 'text-rose-500' : ''}>
                        {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
