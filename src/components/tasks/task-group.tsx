'use client';

import { Card } from '@/components/ui/card';
import { TaskCard } from './task-card';
import type { PendingTask } from '@/services/tasks.service';

interface TaskGroupProps {
    title: string;
    count: number;
    color: 'red' | 'blue' | 'yellow' | 'gray';
    tasks: PendingTask[];
    onComplete: (taskId: string) => void;
    onViewLead?: (leadId: string) => void;
    onOpenFeedback?: (task: PendingTask) => void; // ✅ NOVO
}

const colorClasses = {
    red: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-700',
    },
    blue: {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-700',
    },
    yellow: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-700',
    },
    gray: {
        bg: 'bg-gray-50 border-gray-200',
        text: 'text-gray-700',
    },
};

/**
 * Grupo de tarefas (Atrasadas, Hoje, Amanhã, Próximos)
 */
export function TaskGroup({
    title,
    count,
    color,
    tasks,
    onComplete,
    onViewLead,
    onOpenFeedback, // ✅ NOVO
}: TaskGroupProps) {
    const colors = colorClasses[color];

    return (
        <Card className="overflow-hidden">
            {/* Header */}
            <div className={`px-4 py-3 border-b ${colors.bg}`}>
                <h3 className={`font-semibold flex items-center gap-2 ${colors.text}`}>
                    {title}
                    <span className="text-sm font-normal">({count})</span>
                </h3>
            </div>

            {/* Lista de Tarefas */}
            <div className="divide-y">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={onComplete}
                        onViewLead={onViewLead}
                        onOpenFeedback={onOpenFeedback}
                    />
                ))}
            </div>
        </Card>
    );
}