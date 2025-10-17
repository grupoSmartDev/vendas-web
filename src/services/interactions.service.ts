// src/services/interactions.service.ts
import { api } from '@/lib/api';
import type {
    Interaction,
    InteractionType,
    CreateInteractionData,
    UpdateInteractionData  // 👈 ADICIONE ISSO
} from '@/types';

const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '12345678900';

/**
 * Serviço de interações/atividades
 */
export const interactionsService = {
    /**
     * Lista interações de um lead
     */
    async getByLead(leadId: string): Promise<Interaction[]> {
        const { data } = await api.get<Interaction[]>(
            `/tenants/${TENANT_KEY}/interactions`,
            { params: { leadId } }
        );
        return data;
    },

    /**
     * Busca uma interação por ID
     */
    async getById(id: string): Promise<Interaction> {
        const { data } = await api.get<Interaction>(
            `/tenants/${TENANT_KEY}/interactions/${id}`
        );
        return data;
    },

    /**
     * Cria uma nova interação
     */
    async create(interactionData: CreateInteractionData): Promise<Interaction> {
        const { data } = await api.post<Interaction>(
            `/tenants/${TENANT_KEY}/interactions`,
            interactionData
        );
        return data;
    },

    /**
     * Atualiza uma interação
     * 👈 ADICIONE ESSE MÉTODO
     */
    async update(id: string, interactionData: UpdateInteractionData): Promise<Interaction> {
        const { data } = await api.patch<Interaction>(
            `/tenants/${TENANT_KEY}/interactions/${id}`,
            interactionData
        );
        return data;
    },

    /**
     * Deleta uma interação
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/tenants/${TENANT_KEY}/interactions/${id}`);
    },

    /**
     * Marca interação como concluída
     */
    async complete(id: string, result?: string): Promise<Interaction> {
        const { data } = await api.patch<Interaction>(
            `/tenants/${TENANT_KEY}/interactions/${id}/complete`,
            { result }
        );
        return data;
    },

    /**
     * Busca todos os tipos de interação disponíveis
     */
    async getTypes(): Promise<InteractionType[]> {
        const { data } = await api.get<InteractionType[]>(
            `/tenants/${TENANT_KEY}/interactions/config/types`
        );
        return data;
    },
};