// src/services/dashboard.service.ts
import { api } from '@/lib/api';

const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '43610517808';

export interface DashboardStats {
    // Métricas principais
    leadsTotal: number;
    leadsNoMes: number;
    vendasNoMes: number;
    visitasAgendadas: number;
    taxaConversao: number;
    equipeAtiva: number;
    tempoMedioResposta: number; // em horas

    // Comparações
    leadsVariacao: number; // % em relação ao mês anterior
    vendasVariacao: number;
    conversaoVariacao: number;

    // Pipeline
    pipeline: {
        novo: number;
        contato: number;
        visita: number;
        proposta: number;
        ganho: number;
        perdido: number;
    };

    // Atividades recentes
    atividadesRecentes: Array<{
        id: string;
        tipo: string;
        descricao: string;
        leadNome: string;
        createdAt: string;
    }>;

    // Leads pendentes (sem contato há 3+ dias)
    leadsPendentes: Array<{
        id: string;
        name: string;
        phone: string;
        diasSemContato: number;
        status: string;
    }>;

    // Alertas
    alertas: Array<{
        tipo: 'warning' | 'info' | 'success';
        mensagem: string;
    }>;

    // Metas do mês
    metas: {
        ligacoes: { atual: number; meta: number };
        leads: { atual: number; meta: number };
        vendas: { atual: number; meta: number };
        visitas: { atual: number; meta: number };
    };
}

export const dashboardService = {
    /**
     * Busca todas as estatísticas do dashboard
     */
    async getStats(): Promise<DashboardStats> {
        const { data } = await api.get<DashboardStats>(
            `/tenants/${TENANT_KEY}/dashboard/stats`
        );
        return data;
    },
};