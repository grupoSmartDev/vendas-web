// src/services/vendas.service.ts
import { api } from '@/lib/api';
import type {
    Venda,
    CreateVendaData,
    VendaFilters,
    PaginatedVendas,
    VendaStats,
    MetaProgresso,
    SetMetaData,
} from '@/types/index';

const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '43610517808';

/**
 * Serviço de vendas
 */
export const vendasService = {
    /**
     * Lista todas as vendas com filtros
     */
    async getAll(filters?: VendaFilters): Promise<PaginatedVendas> {
        const { data } = await api.get<PaginatedVendas>(
            `/tenants/${TENANT_KEY}/vendas`,
            { params: filters }
        );
        return data;
    },

    /**
     * Busca uma venda por ID
     */
    async getById(id: string): Promise<Venda> {
        const { data } = await api.get<Venda>(
            `/tenants/${TENANT_KEY}/vendas/${id}`
        );
        return data;
    },

    /**
     * Cria uma nova venda
     */
    async create(vendaData: CreateVendaData): Promise<Venda> {
        const { data } = await api.post<Venda>(
            `/tenants/${TENANT_KEY}/vendas`,
            vendaData
        );
        return data;
    },

    /**
     * Atualiza uma venda
     */
    async update(id: string, vendaData: Partial<CreateVendaData>): Promise<Venda> {
        const { data } = await api.patch<Venda>(
            `/tenants/${TENANT_KEY}/vendas/${id}`,
            vendaData
        );
        return data;
    },

    /**
     * Deleta uma venda
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/tenants/${TENANT_KEY}/vendas/${id}`);
    },

    /**
     * Busca estatísticas de vendas
     */
    async getStats(userId?: string): Promise<VendaStats> {
        const { data } = await api.get<VendaStats>(
            `/tenants/${TENANT_KEY}/vendas/stats`,
            { params: { userId } }
        );
        return data;
    },

    /**
     * Define meta mensal
     */
    async setMeta(metaData: SetMetaData): Promise<void> {
        await api.post(`/tenants/${TENANT_KEY}/vendas/metas`, metaData);
    },

    /**
     * Busca progresso da meta
     */
    async getMetaProgresso(mes?: number, ano?: number, userId?: string): Promise<MetaProgresso> {
        const { data } = await api.get<MetaProgresso>(
            `/tenants/${TENANT_KEY}/vendas/metas/progresso`,
            { params: { mes, ano, userId } }
        );
        return data;
    },
};