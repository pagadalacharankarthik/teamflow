'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { Plus, X, Loader2, Link as LinkIcon, FileText, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function TasksPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [submissionData, setSubmissionData] = useState({ link: '', notes: '' });
    const [createError, setCreateError] = useState('');

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks');
            return res.data.data;
        }
    });

    const { data: projects } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await api.get('/projects');
            return res.data.data;
        },
        enabled: user?.role === 'admin'
    });

    const { data: team } = useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const res = await api.get('/auth/users');
            return res.data.data;
        }
    });

    const createTaskMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post('/tasks', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsCreateModalOpen(false);
            setCreateError('');
        },
        onError: (err: any) => {
            setCreateError(err.response?.data?.message || 'Failed to create task');
        }
    });

    const submitMutation = useMutation({
        mutationFn: async (data: any) => {
            const now = new Date();
            const deadline = new Date(selectedTask.deadline);
            const isOverdue = selectedTask.status === 'overdue' || (now > deadline);
            
            let lateTag = '';
            if (isOverdue) {
                const diffTime = Math.abs(now.getTime() - deadline.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                lateTag = `[LATE SUBMISSION - ${now.toLocaleString()} | ${diffDays} Day(s) Overdue]`;
            }

            const finalData = {
                ...data,
                notes: isOverdue ? `${lateTag} ${data.notes}` : data.notes
            };
            return api.put(`/tasks/${selectedTask._id}/submit`, finalData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setSelectedTask(null);
        }
    });

    const approveMutation = useMutation({
        mutationFn: async () => {
            return api.put(`/tasks/${selectedTask._id}/approve`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setSelectedTask(null);
        }
    });

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black tracking-tight mb-2">Workspace Board</h1>
                    <p className="text-muted-foreground font-medium">Manage deliverables and track team progress in real-time.</p>
                </div>
                {user?.role === 'admin' && (
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Create Task
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-accent" size={40} />
                </div>
            ) : (
                <KanbanBoard initialTasks={tasks || []} onTaskClick={setSelectedTask} />
            )}

            {/* Create Task Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-xl p-10 relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black tracking-tight">New Deliverable</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const data = {
                                    title: formData.get('title'),
                                    description: formData.get('description'),
                                    projectId: formData.get('projectId'),
                                    assignedTo: formData.get('assignedTo'),
                                    deadline: formData.get('deadline'),
                                    priority: formData.get('priority'),
                                };
                                createTaskMutation.mutate(data);
                            }} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Task Title</label>
                                    <input name="title" required placeholder="Project Milestone Name" className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-semibold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Context / Description</label>
                                    <textarea name="description" placeholder="Brief explanation of the task expectations..." className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors h-32 font-medium" />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Project</label>
                                        <select name="projectId" required className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold">
                                            <option value="">Select Portfolio</option>
                                            {projects?.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Assignee</label>
                                        <select name="assignedTo" required className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold">
                                            <option value="">Select Member</option>
                                            {team?.map((m: any) => <option key={m._id} value={m._id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Deadline</label>
                                        <input name="deadline" type="date" required className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Priority</label>
                                        <select name="priority" className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold">
                                            <option value="low">Low Priority</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                </div>

                                {createError && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs flex items-center gap-3 font-bold">
                                        <AlertTriangle size={18} />
                                        {createError}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-6 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all">Discard</button>
                                    <button type="submit" disabled={createTaskMutation.isPending} className="flex-1 px-6 py-3 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center">
                                        {createTaskMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : 'Create Task'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Task Details Modal */}
            <AnimatePresence>
                {selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTask(null)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card border border-border rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10">
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-2">
                                        <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">{selectedTask.projectId?.name || 'Unassigned Project'}</span>
                                        <h2 className="text-3xl font-black tracking-tight">{selectedTask.title}</h2>
                                    </div>
                                    <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                        <X size={24} className="text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="md:col-span-2 space-y-8">
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <FileText size={14} />
                                                Requirement
                                            </h4>
                                            <p className="text-foreground/80 font-medium leading-relaxed">{selectedTask.description || 'No specialized description provided.'}</p>
                                        </div>

                                        {selectedTask.status === 'submitted' && (
                                            <div className="bg-accent/5 border border-accent/10 p-6 rounded-3xl relative overflow-hidden">
                                                {selectedTask.submission?.notes?.includes('[LATE SUBMISSION') && (
                                                    <div className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black px-4 py-1.5 uppercase tracking-tighter rounded-bl-xl shadow-lg animate-pulse flex flex-col items-center">
                                                        <span>Late Submission</span>
                                                        <span className="text-[7px] opacity-80">{selectedTask.submission?.notes?.split('|')[1]?.split(']')[0]?.trim()}</span>
                                                    </div>
                                                )}
                                                <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <LinkIcon size={14} />
                                                    Submitted Proof
                                                </h4>
                                                <a href={selectedTask.submission?.link} target="_blank" rel="noreferrer" className="text-accent font-bold underline break-all block mb-3 hover:text-accent/80">{selectedTask.submission?.link}</a>
                                                <p className="text-sm text-muted-foreground italic font-medium">"{selectedTask.submission?.notes}"</p>
                                            </div>
                                        )}

                                        {selectedTask.assignedTo?._id === user?.id && !['approved', 'submitted'].includes(selectedTask.status) && (
                                            <div className="space-y-4 pt-6 border-t border-border">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-sm font-black uppercase tracking-tight">Final Submission</h4>
                                                    {(selectedTask.status === 'overdue' || (new Date(selectedTask.deadline) < new Date())) && (
                                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                                            <AlertTriangle size={12} />
                                                            Late Entry
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Deliverable URL (GitHub, Figma, etc.)"
                                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-semibold"
                                                        value={submissionData.link}
                                                        onChange={(e) => setSubmissionData({...submissionData, link: e.target.value})}
                                                    />
                                                    <textarea 
                                                        placeholder="Add execution notes..."
                                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors h-24 font-medium"
                                                        value={submissionData.notes}
                                                        onChange={(e) => setSubmissionData({...submissionData, notes: e.target.value})}
                                                    />
                                                    <button 
                                                        onClick={() => submitMutation.mutate(submissionData)}
                                                        className={`w-full py-4 rounded-2xl font-black shadow-xl transition-all active:scale-[0.98] ${
                                                            ['overdue'].includes(selectedTask.status) || (new Date(selectedTask.deadline) < new Date())
                                                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20' 
                                                            : 'bg-accent hover:bg-accent/90 text-white shadow-accent/20'
                                                        }`}
                                                    >
                                                        {submitMutation.isPending ? <Loader2 className="animate-spin mx-auto" /> : 
                                                            (['overdue'].includes(selectedTask.status) || (new Date(selectedTask.deadline) < new Date()))
                                                            ? 'Submit Late Deliverable' 
                                                            : 'Complete Deliverable'
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {user?.role === 'admin' && selectedTask.status === 'submitted' && (
                                            <button 
                                                onClick={() => approveMutation.mutate()}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                            >
                                                {approveMutation.isPending ? <Loader2 className="animate-spin" /> : <><CheckCircle size={22} /> Approve Submission</>}
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-6 bg-muted/30 p-6 rounded-[2rem] border border-border">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned To</p>
                                                <div className="flex items-center gap-2 pt-1">
                                                    <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent">{selectedTask.assignedTo?.name.charAt(0)}</div>
                                                    <p className="text-sm font-bold">{selectedTask.assignedTo?.name}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Due Date</p>
                                                <div className="flex items-center gap-2 pt-1 text-foreground/80 font-bold">
                                                    <Calendar size={14} />
                                                    <p className="text-sm">{new Date(selectedTask.deadline).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
