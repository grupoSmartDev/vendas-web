// src/services/message-templates.service.ts
import { api } from '@/lib/api';
import { authService } from './auth.service';
import type {
    MessageTemplate,
    CreateMessageTemplateData,
    MessageTemplateFilters,
    ApplyTemplateVariables,
    AppliedTemplate,
    MessageTemplateType,
} from '@/types/index';

/**
 * Serviço de Templates de Mensagens
 */
export const messageTemplatesService = {
    /**
     * Lista todos os templates
     */
    async getAll(filters?: MessageTemplateFilters) {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get(`/tenants/${tenantKey}/message-templates`, {
            params: filters,
        });

        return data;
    },

    /**
     * Busca templates por categoria
     */
    async getByType(type: MessageTemplateType): Promise<MessageTemplate[]> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get(
            `/tenants/${tenantKey}/message-templates/type/${type}`
        );

        return data;
    },

    /**
     * Busca templates mais usados
     */
    async getMostUsed(limit: number = 10): Promise<MessageTemplate[]> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get(
            `/tenants/${tenantKey}/message-templates/most-used`,
            { params: { limit } }
        );

        return data;
    },

    /**
     * Busca um template por ID
     */
    async getById(id: string): Promise<MessageTemplate> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.get(
            `/tenants/${tenantKey}/message-templates/${id}`
        );

        return data;
    },

    /**
     * Cria um novo template
     */
    async create(templateData: CreateMessageTemplateData): Promise<MessageTemplate> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.post(
            `/tenants/${tenantKey}/message-templates`,
            templateData
        );

        return data;
    },

    /**
     * Atualiza um template
     */
    async update(
        id: string,
        templateData: Partial<CreateMessageTemplateData>
    ): Promise<MessageTemplate> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.patch(
            `/tenants/${tenantKey}/message-templates/${id}`,
            templateData
        );

        return data;
    },

    /**
     * Deleta um template
     */
    async delete(id: string): Promise<void> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        await api.delete(`/tenants/${tenantKey}/message-templates/${id}`);
    },

    /**
     * Duplica um template
     */
    async duplicate(id: string): Promise<MessageTemplate> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.post(
            `/tenants/${tenantKey}/message-templates/${id}/duplicate`
        );

        return data;
    },

    /**
     * Aplica variáveis em um template
     */
    async applyVariables(
        templateId: string,
        variables: Record<string, string>
    ): Promise<AppliedTemplate> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.post(
            `/tenants/${tenantKey}/message-templates/${templateId}/apply`,
            { variables }
        );

        return data;
    },
};