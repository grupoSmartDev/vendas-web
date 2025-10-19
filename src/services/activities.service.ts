// src/services/activities.service.ts
import { api } from '@/lib/api';

const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '43610517808';

export interface DailyActivity {
    id: string;
    userId: string;
    date: string;

    // Prospecção
    ligacoes: number;
    mensagensWhatsapp: number;
    gruposFacebook: number;
    visitasConstrutora: number;

    // Marketing
    posts: number;
    stories: number;
    investimentoAds: number;

    // Indicações
    indicacoesPedidas: number;
    indicacoesRecebidas: number;

    // Presença
    horasPlantao: number;
    eventosNetworking: number;

    // Funil
    leadsGerados: number;
    atendimentos: number;
    visitasAgendadas: number;
    visitasRealizadas: number;
    propostasEnviadas: number;
    vendasFechadas: number;

    // Observações
    observacoes?: string;

    // Relacionamentos
    leads?: LeadFromActivity[];
}

export interface LeadFromActivity {
    id: string;
    name: string;
    phone: string;
    sourceChannel: string;
    createdAt: string;
}

export interface MonthlyTotals {
    totals: DailyActivity;
    taxaConversao: number;
    diasComAtividade: number;
}

export interface ActivityStats {
    today: DailyActivity;
    monthly: MonthlyTotals;
    leadsByChannel: Array<{
        sourceChannel: string;
        _count: { id: number };
    }>;
}

export interface CreateLeadFromActivityData {
    name: string;
    phone: string;
    email?: string;
    sourceChannel: 'ligacao' | 'whatsapp' | 'facebook' | 'construtora' | 'post' | 'story' | 'ads' | 'indicacao' | 'networking' | 'stand' | 'site';
    observacoes?: string;
    statusId?: string;
    sourceId?: string;
}

/**
 * Serviço de atividades diárias
 */
export const activitiesService = {
    /**
     * Busca atividade de hoje
     */
    async getToday(): Promise<DailyActivity> {
        const { data } = await api.get<DailyActivity>(
            `/tenants/${TENANT_KEY}/activities/today`
        );
        return data;
    },

    /**
     * Busca atividade de uma data específica
     */
    async getByDate(date: string): Promise<DailyActivity> {
        const { data } = await api.get<DailyActivity>(
            `/tenants/${TENANT_KEY}/activities/${date}`
        );
        return data;
    },

    /**
     * Atualiza atividade
     */
    async update(activity: Partial<DailyActivity>): Promise<DailyActivity> {
        const { data } = await api.post<DailyActivity>(
            `/tenants/${TENANT_KEY}/activities`,
            activity
        );
        return data;
    },

    /**
     * Busca totais do mês
     */
    async getMonthlyTotals(month: string): Promise<MonthlyTotals> {
        const { data } = await api.get<MonthlyTotals>(
            `/tenants/${TENANT_KEY}/activities/month/${month}`
        );
        return data;
    },

    /**
     * Busca estatísticas
     */
    async getStats(): Promise<ActivityStats> {
        const { data } = await api.get<ActivityStats>(
            `/tenants/${TENANT_KEY}/activities/stats`
        );
        return data;
    },

    /**
     * Cria lead direto da atividade
     * Isso vai:
     * 1. Criar o lead
     * 2. Incrementar automaticamente o contador da atividade
     * 3. Vincular o lead à atividade do dia
     */
    async createLead(leadData: CreateLeadFromActivityData): Promise<any> {
        const { data } = await api.post(
            `/tenants/${TENANT_KEY}/activities/create-lead`,
            leadData
        );
        return data;
    },
};