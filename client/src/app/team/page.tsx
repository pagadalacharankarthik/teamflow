'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, Mail, Shield, Loader2, Search, ExternalLink, MoreVertical, Plus, X, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function TeamPage() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'member', password: '' });
    const [addError, setAddError] = useState('');

    const { data: users, isLoading } = useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const res = await api.get('/auth/users');
            return res.data.data;
        }
    });

    const addMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post('/auth/create', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team'] });
            setIsAddModalOpen(false);
            setNewUser({ name: '', email: '', role: 'member', password: '' });
            setAddError('');
        },
        onError: (err: any) => {
            setAddError(err.response?.data?.message || 'Failed to add member');
        }
    });

    const filteredUsers = users?.filter((user: any) => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black tracking-tight mb-2 text-foreground">Team Directory</h1>
                    <p className="text-muted-foreground font-medium">Manage permissions and view organizational structure.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-card border border-border rounded-2xl shadow-sm px-6 py-2.5 flex items-center gap-4 group focus-within:border-accent transition-all w-full md:w-80">
                        <Search size={18} className="text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search members..." 
                            className="flex-1 bg-transparent border-none outline-none text-sm font-semibold placeholder:text-muted-foreground/50 text-foreground"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {currentUser?.role === 'admin' && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            Add Member
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredUsers?.map((user: any, i: number) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedUser(user)}
                            className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-accent/20 transition-all group relative overflow-hidden cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-2xl group-hover:scale-110 transition-transform">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    user.role === 'admin' 
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                }`}>
                                    {user.role}
                                </div>
                            </div>

                            <div className="space-y-1 mb-8">
                                <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-accent transition-colors">{user.name}</h3>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Mail size={14} className="opacity-50" />
                                    {user.email}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgb(16_185_129/0.5)]" />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available</span>
                                </div>
                                <div className="text-accent text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Profile</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Member Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-lg p-10 relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black tracking-tight text-foreground">Onboard Member</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                    <X size={20} className="text-foreground" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold text-foreground"
                                        placeholder="John Doe"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                                    <input 
                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold text-foreground"
                                        placeholder="john@company.com"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">System Role</label>
                                    <select 
                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold text-foreground"
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    >
                                        <option value="member">Standard Member</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Initial Password</label>
                                    <input 
                                        type="password"
                                        className="w-full px-5 py-3 bg-muted/50 border border-border rounded-2xl outline-none focus:border-accent transition-colors font-bold text-foreground"
                                        placeholder="Leave blank for 'welcome123'"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    />
                                </div>

                                {addError && <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-3 rounded-xl">{addError}</p>}

                                <div className="flex gap-4 pt-6">
                                    <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-6 py-3 border border-border rounded-2xl font-black hover:bg-muted transition-all text-foreground">Cancel</button>
                                    <button 
                                        onClick={() => addMutation.mutate(newUser)}
                                        disabled={addMutation.isPending}
                                        className="flex-1 px-6 py-3 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        {addMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Access'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Profile Detail Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card border border-border rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10">
                            <div className="relative h-40 bg-accent overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
                            </div>
                            
                            <div className="px-10 pb-12 -mt-16 relative">
                                <div className="flex justify-between items-end mb-10">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-card p-2 border-4 border-card shadow-2xl">
                                        <div className="w-full h-full rounded-[2rem] bg-accent flex items-center justify-center text-white font-black text-5xl">
                                            {selectedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mb-4">
                                        <button className="p-3 bg-muted rounded-2xl hover:bg-border transition-colors text-foreground"><Mail size={20} /></button>
                                        <button onClick={() => setSelectedUser(null)} className="p-3 bg-muted rounded-2xl hover:bg-border transition-colors text-foreground"><X size={20} /></button>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-black tracking-tight text-foreground">{selectedUser.name}</h2>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                selectedUser.role === 'admin' 
                                                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                                                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>{selectedUser.role}</span>
                                        </div>
                                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                                            <Mail size={16} /> {selectedUser.email}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2"><Phone size={12} /> Contact</p>
                                            <p className="text-sm font-bold text-foreground">+1 (555) 000-0000</p>
                                        </div>
                                        <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={12} /> Location</p>
                                            <p className="text-sm font-bold text-foreground">Corporate HQ, Remote</p>
                                        </div>
                                        <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2"><Calendar size={12} /> Joined</p>
                                            <p className="text-sm font-bold text-foreground">May 2026</p>
                                        </div>
                                        <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle size={12} /> Status</p>
                                            <p className="text-sm font-bold text-emerald-500">Active Member</p>
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
