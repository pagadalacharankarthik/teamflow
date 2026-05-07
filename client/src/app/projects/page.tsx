'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Users, Folder, Calendar, Loader2, Search, X, Shield, ChevronRight, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<{name: string, description: string, members: string[]}>({ name: '', description: '', members: [] });

    const { data: team } = useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const res = await api.get('/auth/users');
            return res.data.data;
        }
    });

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await api.get('/projects');
            return res.data.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post('/projects', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsCreateModalOpen(false);
            setFormData({ name: '', description: '', members: [] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.put(`/projects/${selectedProject._id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsEditModalOpen(false);
            setSelectedProject(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setSelectedProject(null);
        }
    });

    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        return projects.filter((p: any) => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    const handleEdit = (project: any) => {
        setSelectedProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            members: project.members?.map((m: any) => m._id) || []
        });
        setIsEditModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black tracking-tight mb-2 text-foreground">Project Portfolio</h1>
                    <p className="text-muted-foreground font-medium">Coordinate and scale your organizational initiatives.</p>
                </div>
                {user?.role === 'admin' && (
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        New Initiative
                    </button>
                )}
            </div>

            <div className="bg-card border border-border rounded-[2rem] shadow-sm p-3 mb-10 flex items-center gap-4 group focus-within:border-accent transition-colors">
                <div className="p-2 bg-muted rounded-xl group-focus-within:bg-accent/10 group-focus-within:text-accent transition-colors">
                    <Search size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search portfolios..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-semibold placeholder:text-muted-foreground/50 text-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects?.map((project: any, i: number) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-xl hover:border-accent/20 transition-all group relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors border border-border group-hover:border-accent/20 text-muted-foreground">
                                    <Folder size={20} />
                                </div>
                                {user?.role === 'admin' && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(project)} className="p-2 hover:bg-accent/10 text-accent rounded-lg transition-colors"><Edit3 size={16} /></button>
                                        <button onClick={() => { if(confirm('Delete project?')) deleteMutation.mutate(project._id) }} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-lg font-black tracking-tight mb-2 text-foreground group-hover:text-accent transition-colors line-clamp-1">{project.name}</h3>
                            <p className="text-muted-foreground text-xs font-medium mb-6 line-clamp-2 leading-relaxed flex-1">{project.description || 'Mission parameters not defined.'}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center -space-x-1.5">
                                    {project.members?.slice(0, 4).map((m: any, idx: number) => (
                                        <div key={idx} className="w-7 h-7 rounded-lg bg-accent/10 border-2 border-card flex items-center justify-center text-[9px] font-black text-accent">
                                            {m.name.charAt(0)}
                                        </div>
                                    ))}
                                    {project.members?.length > 4 && (
                                        <div className="w-7 h-7 rounded-lg bg-muted border-2 border-card flex items-center justify-center text-[9px] font-black text-muted-foreground">
                                            +{project.members.length - 4}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground font-black text-[9px] uppercase tracking-widest">
                                    <Calendar size={10} />
                                    {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(isCreateModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-lg p-8 relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black tracking-tight text-foreground">{isEditModalOpen ? 'Refine Project' : 'Initiate Project'}</h2>
                                <button onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                    <X size={20} className="text-foreground" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Portfolio Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold text-foreground"
                                        placeholder="e.g. Strategic Growth Q3"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Mission Context</label>
                                    <textarea 
                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors h-24 font-medium text-sm text-foreground"
                                        placeholder="Define the scope..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Deploy Team (Select/Deselect)</label>
                                    <div className="max-h-40 overflow-y-auto border border-border rounded-2xl p-2 bg-muted/50 custom-scrollbar">
                                        {team?.map((m: any) => {
                                            const isSelected = formData.members.includes(m._id);
                                            return (
                                                <button 
                                                    key={m._id}
                                                    onClick={() => {
                                                        const newMembers = isSelected 
                                                            ? formData.members.filter(id => id !== m._id)
                                                            : [...formData.members, m._id];
                                                        setFormData({...formData, members: newMembers as any});
                                                    }}
                                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all mb-1 ${isSelected ? 'bg-accent/10 border border-accent/20' : 'hover:bg-muted'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-[10px] font-black">
                                                            {m.name.charAt(0)}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-foreground">{m.name}</p>
                                                            <p className="text-[9px] text-muted-foreground uppercase font-black">{m.role}</p>
                                                        </div>
                                                    </div>
                                                    {isSelected && <CheckCircle size={14} className="text-accent" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 px-6 py-3 border border-border rounded-2xl font-black hover:bg-muted transition-all text-foreground text-sm">Discard</button>
                                    <button 
                                        onClick={() => isEditModalOpen ? updateMutation.mutate(formData) : createMutation.mutate(formData)}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="flex-1 px-6 py-3 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={18} className="animate-spin" /> : isEditModalOpen ? 'Save Changes' : 'Launch Project'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
