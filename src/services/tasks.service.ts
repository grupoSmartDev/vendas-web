// src/services/tasks.service.ts
import { api } from '@/lib/api';
import { authService } from './auth.service';

export interface PendingTask {
    id: string;
    leadId: string;
    userId: string | null;
    typeId: string;
    description: string | null;
    scheduledAt: string;
    result: string | null;
    createdAt: string;
    isCompleted: boolean;
    lead: {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        status: {
            id: string;
            name: string;
            displayName: string;
            color: string;
        };
    };
    type: {
        id: string;
        name: string;
        displayName: string;
        icon: string | null;
    };
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export interface TasksResponse {
    total: number;
    tasks: PendingTask[];
    grouped: Record<string, PendingTask[]>;
}

export interface TasksStats {
    pending: number;
    overdue: number;
    today: number;
    upcoming: number;
    byType: Array<{
        typeId: string;
        typeName: string;
        count: number;
    }>;
}

export interface TaskFilters {
    startDate?: string;
    endDate?: string;
    typeId?: string;
    userId?: string;
}

/**
 * Serviço de Tarefas Pendentes
 */
export const tasksService = {
    /**
     * Busca tarefas pendentes com filtros
     */
    async getPending(filters?: TaskFilters): Promise<TasksResponse> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get<TasksResponse>(
            `/tenants/${tenantKey}/tasks/pending`,
            { params: filters }
        );

        return data;
    },

    /**
     * Busca estatísticas das tarefas
     */
    async getStats(userId?: string): Promise<TasksStats> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get<TasksStats>(
            `/tenants/${tenantKey}/tasks/stats`,
            { params: { userId } }
        );

        return data;
    },

    /**
     * Marca tarefa como concluída
     */
    async complete(taskId: string): Promise<void> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        await api.patch(
            `/tenants/${tenantKey}/interactions/${taskId}`,
            { isCompleted: true }
        );
    },
};