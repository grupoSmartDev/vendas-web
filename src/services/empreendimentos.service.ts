// src/services/empreendimentos.service.ts
import { api } from '@/lib/api';
import type {
    Empreendimento,
    CreateEmpreendimentoData,
    EmpreendimentoFilters,
    PaginatedEmpreendimentos,
} from '@/types';

const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '12345678900';

/**
 * Serviço de empreendimentos
 */
export const empreendimentosService = {
    /**
     * Lista todos os empreendimentos com filtros
     */
    async getAll(filters?: EmpreendimentoFilters): Promise<PaginatedEmpreendimentos> {
        const { data } = await api.get<PaginatedEmpreendimentos>(
            `/tenants/${TENANT_KEY}/empreendimentos`,
            { params: filters }
        );
        return data;
    },

    /**
     * Busca um empreendimento por ID
     */
    async getById(id: string): Promise<Empreendimento> {
        const { data } = await api.get<Empreendimento>(
            `/tenants/${TENANT_KEY}/empreendimentos/${id}`
        );
        return data;
    },

    /**
     * Cria um novo empreendimento
     */
    async create(empreendimentoData: CreateEmpreendimentoData): Promise<Empreendimento> {
        const { data } = await api.post<Empreendimento>(
            `/tenants/${TENANT_KEY}/empreendimentos`,
            empreendimentoData
        );
        return data;
    },

    /**
     * Atualiza um empreendimento
     */
    async update(id: string, empreendimentoData: Partial<CreateEmpreendimentoData>): Promise<Empreendimento> {
        const { data } = await api.patch<Empreendimento>(
            `/tenants/${TENANT_KEY}/empreendimentos/${id}`,
            empreendimentoData
        );
        return data;
    },

    /**
     * Deleta um empreendimento
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/tenants/${TENANT_KEY}/empreendimentos/${id}`);
    },

    /**
     * Busca estatísticas
     */
    async getStats(): Promise<any> {
        const { data } = await api.get(
            `/tenants/${TENANT_KEY}/empreendimentos/stats`
        );
        return data;
    },

    /**
     * MATCH INTELIGENTE - Busca leads compatíveis
     */
    async getCompatibleLeads(id: string): Promise<any> {
        const { data } = await api.get(
            `/tenants/${TENANT_KEY}/empreendimentos/${id}/compatible-leads`
        );
        return data;
    },
};