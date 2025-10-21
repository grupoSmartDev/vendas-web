'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { tasksService, type PendingTask, type TasksStats } from '@/services/tasks.service';
import { interactionsService } from '@/services/interactions.service';
import { TaskStats } from './task-stats';
import { TaskFilters } from './task-filters';
import { TaskGroup } from './task-group';
import { InteractionFeedbackDialog } from '../leads/interaction-feedback-dialog';
import type { InteractionType } from '@/types';
import { DashboardLayout } from '../layout';

/**
 * Página principal de Tarefas Pendentes
 */
export function PendingTasksPage() {
    const [tasks, setTasks] = useState<PendingTask[]>([]);
    const [stats, setStats] = useState<TasksStats | null>(null);
    const [interactionTypes, setInteractionTypes] = useState<InteractionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        typeId: 'all',
    });

    // ✅ Estados para o Feedback Dialog
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null);

    // Carrega dados quando filtros mudam
    useEffect(() => {
        loadData();
    }, [filters]);

    // Carrega tipos de interação apenas uma vez
    useEffect(() => {
        loadInteractionTypes();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);

            const apiFilters = {
                ...filters,
                typeId: filters.typeId === 'all' ? '' : filters.typeId,
            };

            const [tasksData, statsData] = await Promise.all([
                tasksService.getPending(apiFilters),
                tasksService.getStats(),
            ]);

            setTasks(tasksData.tasks);
            setStats(statsData);
        } catch (error: any) {
            console.error('Erro ao carregar tarefas:', error);
            toast.error('Erro ao carregar tarefas');
        } finally {
            setIsLoading(false);
        }
    };

    const loadInteractionTypes = async () => {
        try {
            const types = await interactionsService.getTypes();
            setInteractionTypes(types);
        } catch (error) {
            console.error('Erro ao carregar tipos:', error);
        }
    };

    const groupTasksByDate = (tasks: PendingTask[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const groups: Record<string, PendingTask[]> = {
            overdue: [],
            today: [],
            tomorrow: [],
            upcoming: [],
        };

        tasks.forEach(task => {
            const taskDate = new Date(task.scheduledAt);
            taskDate.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (taskDate < today) {
                groups.overdue.push(task);
            } else if (taskDate.getTime() === today.getTime()) {
                groups.today.push(task);
            } else if (taskDate.getTime() === tomorrow.getTime()) {
                groups.tomorrow.push(task);
            } else {
                groups.upcoming.push(task);
            }
        });

        return groups;
    };

    const handleComplete = async (taskId: string) => {
        try {
            await interactionsService.update(taskId, { isCompleted: true });
            toast.success('Tarefa concluída!');
            await loadData();
        } catch (error: any) {
            console.error('Erro ao concluir tarefa:', error);
            toast.error('Erro ao concluir tarefa');
        }
    };

    const handleClearFilters = () => {
        setFilters({
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: '',
            typeId: 'all',
        });
    };

    const handleViewLead = (leadId: string) => {
        console.log('Ver lead:', leadId);
    };

    // ✅ Abre o feedback dialog
    const handleOpenFeedback = (task: PendingTask) => {
        console.log('🎯 handleOpenFeedback chamado!', task.id);
        setSelectedTask(task);
        setFeedbackDialogOpen(true);
    };

    // ✅ Salva feedback e cria próxima atividade
    const handleSaveFeedback = async (feedback: {
        result: string;
        isCompleted: boolean;
        nextActivity?: {
            typeId: string;
            description: string;
            scheduledAt?: string;
        };
    }) => {
        if (!selectedTask) return;

        try {
            // 1. Atualizar a tarefa atual
            await interactionsService.update(selectedTask.id, {
                result: feedback.result,
                isCompleted: true,
                scheduledAt: new Date().toISOString(),
            });

            toast.success('Tarefa concluída com sucesso!');

            // 2. Se tiver próxima atividade, criar
            if (feedback.nextActivity) {
                await interactionsService.create({
                    leadId: selectedTask.leadId,
                    typeId: feedback.nextActivity.typeId,
                    description: feedback.nextActivity.description,
                    scheduledAt: feedback.nextActivity.scheduledAt,
                });

                toast.success('Próxima atividade criada!', {
                    description: 'A nova tarefa foi adicionada',
                });
            }

            // 3. Recarregar lista
            await loadData();
        } catch (error: any) {
            console.error('Erro ao salvar feedback:', error);
            toast.error('Erro ao salvar feedback');
            throw error;
        }
    };

    const grouped = groupTasksByDate(tasks);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Tarefas Pendentes
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Organize e acompanhe suas atividades agendadas
                            </p>
                        </div>
                    </div>

                    {stats && <TaskStats stats={stats} />}

                    <TaskFilters
                        filters={filters}
                        interactionTypes={interactionTypes}
                        onFilterChange={setFilters}
                        onClear={handleClearFilters}
                    />

                    {tasks.length === 0 ? (
                        <Card className="p-12 text-center">
                            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Nenhuma tarefa pendente
                            </h3>
                            <p className="text-gray-500">
                                Você está em dia com suas atividades!
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {grouped.overdue.length > 0 && (
                                <TaskGroup
                                    title="Atrasadas"
                                    count={grouped.overdue.length}
                                    color="red"
                                    tasks={grouped.overdue}
                                    onComplete={handleComplete}
                                    onViewLead={handleViewLead}
                                    onOpenFeedback={handleOpenFeedback}
                                />
                            )}

                            {grouped.today.length > 0 && (
                                <TaskGroup
                                    title="Hoje"
                                    count={grouped.today.length}
                                    color="blue"
                                    tasks={grouped.today}
                                    onComplete={handleComplete}
                                    onViewLead={handleViewLead}
                                    onOpenFeedback={handleOpenFeedback}
                                />
                            )}

                            {grouped.tomorrow.length > 0 && (
                                <TaskGroup
                                    title="Amanhã"
                                    count={grouped.tomorrow.length}
                                    color="yellow"
                                    tasks={grouped.tomorrow}
                                    onComplete={handleComplete}
                                    onViewLead={handleViewLead}
                                    onOpenFeedback={handleOpenFeedback}
                                />
                            )}

                            {grouped.upcoming.length > 0 && (
                                <TaskGroup
                                    title="Próximos dias"
                                    count={grouped.upcoming.length}
                                    color="gray"
                                    tasks={grouped.upcoming}
                                    onComplete={handleComplete}
                                    onViewLead={handleViewLead}
                                    onOpenFeedback={handleOpenFeedback}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Dialog de Feedback */}
                <InteractionFeedbackDialog
                    open={feedbackDialogOpen}
                    onOpenChange={setFeedbackDialogOpen}
                    interaction={selectedTask as any}
                    interactionTypes={interactionTypes}
                    onSave={handleSaveFeedback}
                />
            </div>

        </DashboardLayout>
    );
}