'use client';

import { AlertCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { TasksStats } from '@/services/tasks.service';

interface TaskStatsProps {
    stats: TasksStats;
}

/**
 * Cards de estatísticas das tarefas
 */
export function TaskStats({ stats }: TaskStatsProps) {
    const statCards = [
        {
            label: 'Atrasadas',
            value: stats.overdue,
            icon: AlertCircle,
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            label: 'Hoje',
            value: stats.today,
            icon: Clock,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            label: 'Próximos 7 dias',
            value: stats.upcoming,
            icon: Calendar,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        },
        {
            label: 'Total Pendente',
            value: stats.pending,
            icon: CheckCircle2,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.label} className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}