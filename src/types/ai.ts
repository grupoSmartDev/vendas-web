// src/types/ai.ts

export type TemperaturaLead = 'FRIO' | 'MORNO' | 'QUENTE' | 'MUITO_QUENTE';
export type PrazoAcao = 'HOJE' | 'ESTA_SEMANA' | 'PROXIMO_MES';

export interface ProximoPasso {
    prioridade: number;
    acao: string;
    prazo: PrazoAcao;
}

export interface LeadDiagnosis {
    scoreIA: number; // 0-100
    temperatura: TemperaturaLead;
    analise: string;
    pontosFortes: string[];
    pontosAtencao: string[];
    proximosPassos: ProximoPasso[];
    mensagemSugerida: string;
    probabilidadeConversao: number; // 0-100
    tempoEstimadoConversao: string;
    recomendacaoEmpreendimento?: string;
}

export interface DiagnosisResponse {
    leadId: string;
    leadName: string;
    diagnosis: LeadDiagnosis;
}

// Helper para traduzir temperatura
export const TEMPERATURA_LABELS: Record<TemperaturaLead, string> = {
    FRIO: 'Frio',
    MORNO: 'Morno',
    QUENTE: 'Quente',
    MUITO_QUENTE: 'Muito Quente',
};

// Cores para temperatura
export const TEMPERATURA_COLORS: Record<TemperaturaLead, string> = {
    FRIO: '#3b82f6',      // azul
    MORNO: '#f59e0b',     // amarelo
    QUENTE: '#ef4444',    // vermelho
    MUITO_QUENTE: '#dc2626', // vermelho escuro
};

// Emojis para temperatura
export const TEMPERATURA_EMOJI: Record<TemperaturaLead, string> = {
    FRIO: '❄️',
    MORNO: '🌤️',
    QUENTE: '🔥',
    MUITO_QUENTE: '🔥🔥',
};

// Helper para traduzir prazo
export const PRAZO_LABELS: Record<PrazoAcao, string> = {
    HOJE: 'Hoje',
    ESTA_SEMANA: 'Esta Semana',
    PROXIMO_MES: 'Próximo Mês',
};

// Cores para prazo
export const PRAZO_COLORS: Record<PrazoAcao, string> = {
    HOJE: '#dc2626',        // vermelho - urgente
    ESTA_SEMANA: '#f59e0b', // amarelo - importante
    PROXIMO_MES: '#10b981', // verde - normal
};