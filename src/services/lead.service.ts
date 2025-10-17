// src/services/leads.service.ts
import { api } from '@/lib/api';
import type {
    Lead,
    CreateLeadData,
    LeadFilters,
    PaginatedLeads,
    LeadStats,
    LeadStatus,
    LeadSource,
    LeadTag,
} from '@/types';

const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '12345678900';

/**
 * Serviço de leads
 */
export const leadsService = {
    /**
     * Lista todos os leads com filtros
     */
    async getAll(filters?: LeadFilters): Promise<PaginatedLeads> {
        const { data } = await api.get<PaginatedLeads>(
            `/tenants/${TENANT_KEY}/leads`,
            { params: filters }
        );
        return data;
    },

    /**
     * Busca um lead por ID
     */
    async getById(id: string): Promise<Lead> {
        const { data } = await api.get<Lead>(
            `/tenants/${TENANT_KEY}/leads/${id}`
        );
        return data;
    },

    /**
     * Cria um novo lead
     */
    async create(leadData: CreateLeadData): Promise<Lead> {
        const { data } = await api.post<Lead>(
            `/tenants/${TENANT_KEY}/leads`,
            leadData
        );
        return data;
    },

    /**
     * Atualiza um lead
     */
    async update(id: string, leadData: Partial<CreateLeadData>): Promise<Lead> {
        const { data } = await api.patch<Lead>(
            `/tenants/${TENANT_KEY}/leads/${id}`,
            leadData
        );
        return data;
    },

    /**
     * Deleta um lead
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/tenants/${TENANT_KEY}/leads/${id}`);
    },

    /**
     * Busca estatísticas
     */
    async getStats(userId?: string): Promise<LeadStats> {
        const { data } = await api.get<LeadStats>(
            `/tenants/${TENANT_KEY}/leads/stats`,
            { params: { userId } }
        );
        return data;
    },

    /**
     * Busca todos os status disponíveis
     */
    async getStatuses(): Promise<LeadStatus[]> {
        try {
            console.log('📥 getStatuses - Iniciando...');
            console.log('  URL:', `/tenants/${TENANT_KEY}/leads/config/statuses`);
            console.log('  Base URL:', process.env.NEXT_PUBLIC_API_URL);
            console.log('  Full URL:', `${process.env.NEXT_PUBLIC_API_URL}/tenants/${TENANT_KEY}/leads/config/statuses`);

            const { data } = await api.get<LeadStatus[]>(
                `/tenants/${TENANT_KEY}/leads/config/statuses`
            );

            console.log('✅ getStatuses - Sucesso:', data);
            return data;
        } catch (error) {
            console.error('❌ getStatuses - Erro:', error);
            throw error;
        }
    },

    /**
     * Busca todas as fontes disponíveis
     */
    async getSources(): Promise<LeadSource[]> {
        const { data } = await api.get<LeadSource[]>(
            `/tenants/${TENANT_KEY}/leads/config/sources`
        );
        return data;
    },

    /**
     * Busca todas as tags disponíveis
     */
    async getTags(): Promise<LeadTag[]> {
        const { data } = await api.get<LeadTag[]>(
            `/tenants/${TENANT_KEY}/leads/config/tags`
        );
        return data;
    },
};