'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid } from 'lucide-react';

export default function KanbanBoard({ initialTasks, onTaskClick }: { initialTasks: any[], onTaskClick: (task: any) => void }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [tasks, setTasks] = useState(initialTasks);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            return api.put(`/tasks/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (user?.role !== 'admin') {
            if (destination.droppableId === 'approved') return;
            const task = tasks.find(t => t._id === draggableId);
            if (task.assignedTo._id !== user?.id) return;
        }

        const updatedTasks = Array.from(tasks);
        const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);
        if (taskIndex !== -1) {
            updatedTasks[taskIndex].status = destination.droppableId;
            setTasks(updatedTasks);
        }

        statusMutation.mutate({ id: draggableId, status: destination.droppableId });
    };

    const renderColumn = (id: string, title: string, color: string) => (
        <div key={id} className="flex flex-col mb-8">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    {title}
                    <span className="opacity-40 font-black">({tasks.filter(t => t.status === id).length})</span>
                </h3>
            </div>

            <Droppable droppableId={id}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 space-y-4 p-4 rounded-[2rem] bg-muted/20 border border-border/50 min-h-[200px] max-h-[400px] overflow-y-auto custom-scrollbar"
                    >
                        {tasks
                            .filter(t => t.status === id)
                            .map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="outline-none"
                                        >
                                            <TaskCard task={task} onClick={() => onTaskClick(task)} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        {provided.placeholder}
                        
                        {tasks.filter(t => t.status === id).length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 opacity-10">
                                <LayoutGrid size={24} />
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
                {/* Column 1: Active Flow */}
                <div className="space-y-10">
                    {renderColumn('pending', 'Pending', 'bg-muted-foreground/30')}
                    {renderColumn('overdue', 'Overdue', 'bg-rose-500')}
                </div>

                {/* Column 2: Progress & Approval */}
                <div className="space-y-10">
                    {renderColumn('in-progress', 'In Progress', 'bg-amber-500')}
                    {renderColumn('approved', 'Approved', 'bg-emerald-500')}
                </div>

                {/* Column 3: Submission */}
                <div className="space-y-10">
                    {renderColumn('submitted', 'Submitted', 'bg-accent')}
                </div>
            </div>
        </DragDropContext>
    );
}
