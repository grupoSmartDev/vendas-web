'use client';

import {
    Phone,
    MessageSquare,
    Mail,
    Users,
    Clock,
    User,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PendingTask } from '@/services/tasks.service';

interface TaskCardProps {
    task: PendingTask;
    onComplete: (taskId: string) => void;
    onViewLead?: (leadId: string) => void;
    onOpenFeedback?: (task: PendingTask) => void; // ✅ NOVO
}

const iconMap: Record<string, any> = {
    phone: Phone,
    whatsapp: MessageSquare,
    email: Mail,
    visit: Users,
    meeting: Users,
    follow_up: Clock,
    ligacao: Phone,
    reuniao: Users,
    anotacao: Users,
};

/**
 * Card individual de tarefa
 */
export function TaskCard({ task, onComplete, onViewLead, onOpenFeedback }: TaskCardProps) {
    const Icon = iconMap[task.type.name] || Users;

    return (
        <div
            className={`p-4 transition-all ${task.isCompleted
                    ? 'bg-green-50/50 border-green-200'
                    : 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer border-2 border-transparent'
                }`}
            onClick={() => {
                if (!task.isCompleted) {
                    onOpenFeedback?.(task);
                }
            }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    {/* Checkbox - REMOVIDO para não conflitar */}
                    {/* Agora o usuário só clica no card para concluir */}

                    <div className="flex-1 space-y-2">
                        {/* Tipo e Horário */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                                <Icon className="h-3 w-3" />
                                {task.type.displayName}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {format(new Date(task.scheduledAt), 'HH:mm', {
                                    locale: ptBR,
                                })}
                            </span>
                        </div>

                        {/* Descrição */}
                        {task.description && (
                            <p className="text-gray-700">{task.description}</p>
                        )}

                        {/* Resultado (se concluída) */}
                        {task.result && task.isCompleted && (
                            <div className="bg-green-100 border border-green-200 rounded p-2 text-sm">
                                <p className="font-medium text-green-900">Resultado:</p>
                                <p className="text-green-800 whitespace-pre-wrap">{task.result}</p>
                            </div>
                        )}

                        {/* Info do Lead */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{task.lead.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{task.lead.phone}</span>
                            </div>
                            <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: task.lead.status.color + '20',
                                    color: task.lead.status.color,
                                }}
                            >
                                {task.lead.status.displayName}
                            </span>
                        </div>

                        {/* Responsável */}
                        {task.user && (
                            <div className="text-xs text-gray-400">
                                Responsável: {task.user.name}
                            </div>
                        )}

                        {/* Resultado */}
                        {task.result && (
                            <div className="text-xs text-blue-600">
                                Resultado: {task.result}
                            </div>
                        )}
                    </div>
                </div>

                {/* Botão Ver Lead */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => onViewLead?.(task.leadId)}
                >
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Button>
            </div>
        </div>
    );
}