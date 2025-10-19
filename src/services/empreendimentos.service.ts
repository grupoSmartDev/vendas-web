// src/services/empreendimentos.service.ts
import { api } from '@/lib/api';
import { authService } from './auth.service'; // 🆕 Importar
import type {
    Empreendimento,
    CreateEmpreendimentoData,
    EmpreendimentoFilters,
    PaginatedEmpreendimentos,
} from '@/types';

/**
 * Serviço de empreendimentos
 */
export const empreendimentosService = {
    /**
     * Lista todos os empreendimentos com filtros
     */
    async getAll(filters?: EmpreendimentoFilters): Promise<PaginatedEmpreendimentos> {
        const tenantKey = authService.getTenantKey(); // 🆕 Pegar dinamicamente

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get<PaginatedEmpreendimentos>(
            `/tenants/${tenantKey}/empreendimentos`,
            { params: filters }
        );
        return data;
    },

    /**
     * 🆕 NOVO - Lista apenas empreendimentos disponíveis (para dropdowns)
     */
    async getAvailable(): Promise<Empreendimento[]> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get<PaginatedEmpreendimentos>(
            `/tenants/${tenantKey}/empreendimentos`,
            {
                params: {
                    disponivel: true,
                    limit: 100,
                    sortBy: 'name',
                    sortOrder: 'asc',
                }
            }
        );

        return data.data; // Retorna só o array de empreendimentos
    },

    /**
     * Busca um empreendimento por ID
     */
    async getById(id: string): Promise<Empreendimento> {
        const tenantKey = authService.getTenantKey(); // 🆕

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get<Empreendimento>(
            `/tenants/${tenantKey}/empreendimentos/${id}`
        );
        return data;
    },

    /**
     * Cria um novo empreendimento
     */
    async create(empreendimentoData: CreateEmpreendimentoData): Promise<Empreendimento> {
        const tenantKey = authService.getTenantKey(); // 🆕

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.post<Empreendimento>(
            `/tenants/${tenantKey}/empreendimentos`,
            empreendimentoData
        );
        return data;
    },

    /**
     * Atualiza um empreendimento
     */
    async update(id: string, empreendimentoData: Partial<CreateEmpreendimentoData>): Promise<Empreendimento> {
        const tenantKey = authService.getTenantKey(); // 🆕

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.patch<Empreendimento>(
            `/tenants/${tenantKey}/empreendimentos/${id}`,
            empreendimentoData
        );
        return data;
    },

    /**
     * Deleta um empreendimento
     */
    async delete(id: string): Promise<void> {
        const tenantKey = authService.getTenantKey(); // 🆕

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        await api.delete(`/tenants/${tenantKey}/empreendimentos/${id}`);
    },

    /**
     * Busca estatísticas
     */
    async getStats(): Promise<any> {
        const tenantKey = authService.getTenantKey(); // 🆕

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get(
            `/tenants/${tenantKey}/empreendimentos/stats`
        );
        return data;
    },

    /**
     * MATCH INTELIGENTE - Busca leads compatíveis
     */
    async getCompatibleLeads(id: string): Promise<any> {
        const tenantKey = authService.getTenantKey(); // 🆕

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get(
            `/tenants/${tenantKey}/empreendimentos/${id}/compatible-leads`
        );
        return data;
    },
};