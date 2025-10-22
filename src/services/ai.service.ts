// src/services/ai.service.ts
import { api } from '@/lib/api';
import { authService } from './auth.service';
import type { DiagnosisResponse } from '@/types/ai';

/**
 * Serviço de IA
 */
export const aiService = {
    /**
     * Diagnostica um lead usando IA
     */
    async diagnosticarLead(leadId: string): Promise<DiagnosisResponse> {
        const tenantKey = authService.getTenantKey();

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado');
        }

        const { data } = await api.post<DiagnosisResponse>(
            `/tenants/${tenantKey}/ai/diagnosticar-lead/${leadId}`
        );

        return data;
    },
};