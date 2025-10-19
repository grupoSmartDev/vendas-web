// src/types/index.ts

/**
 * Usuário autenticado
 */
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    role: {
        id: string;
        name: string;
        displayName: string;
    };
    tenant: {
        id: string;
        nome: string;
        plan: string;
        cnpjCpf: string; // 🆕 Adicionar este campo
    };
    permissions: Record<string, string[]>;
}

/**
 * Tokens JWT
 */
export interface Tokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

/**
 * Resposta do login/registro
 */
export interface AuthResponse {
    user: User;
    tokens: Tokens;
}

/**
 * Dados de login
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Dados de registro
 */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    cpf?: string;
}

/**
 * Status do Lead
 */
export interface LeadStatus {
    id: string;
    name: string;
    displayName: string;
    color: string;
    orderIndex: number;
    isSystem: boolean;
    isFinal: boolean;
    createdAt: string;
}

/**
 * Fonte do Lead
 */
export interface LeadSource {
    id: string;
    name: string;
    displayName: string;
    icon?: string;
    isSystem: boolean;
    createdAt: string;
}

/**
 * Tag do Lead
 */
export interface LeadTag {
    id: string;
    name: string;
    color: string;
    isSystem: boolean;
    createdAt: string;
}

/**
 * Urgência do Lead
 */
export enum LeadUrgencia {
    IMEDIATO = 'IMEDIATO',
    UM_MES = 'UM_MES',
    TRES_MESES = 'TRES_MESES',
    SEIS_MESES = 'SEIS_MESES',
    SEM_PRESSA = 'SEM_PRESSA',
}

/**
 * Lead
 */
export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    cpf?: string;
    rendaFamiliar?: number;
    profissao?: string;

    statusId: string;
    status: LeadStatus;

    sourceId?: string;
    source?: LeadSource;

    score: number;

    interesseEmpreendimentoId?: string;
    interesseEmpreendimento?: {
        id: string;
        name: string;
    };

    hasFgts?: boolean;
    tempoFgts?: number;
    urgencia?: LeadUrgencia;
    observacoes?: string;

    ultimaInteracao?: string;
    proximaAcao?: string;

    userId?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };

    teamId?: string;
    team?: {
        id: string;
        name: string;
    };

    tags: Array<{
        tag: LeadTag;
    }>;

    createdAt: string;
    updatedAt: string;
}

/**
 * Dados para criar lead
 */
export interface CreateLeadData {
    name: string;
    phone: string;
    email?: string;
    cpf?: string;
    rendaFamiliar?: number;
    profissao?: string;
    statusId?: string;
    sourceId?: string;
    score?: number;
    interesseEmpreendimentoId?: string;
    hasFgts?: boolean;
    tempoFgts?: number;
    urgencia?: LeadUrgencia;
    observacoes?: string;
    proximaAcao?: string;
    userId?: string;
    teamId?: string;
    tagIds?: string[];
}

/**
 * Filtros de leads
 */
export interface LeadFilters {
    statusId?: string;
    sourceId?: string;
    userId?: string;
    teamId?: string;
    urgencia?: LeadUrgencia;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Resposta paginada de leads
 */
export interface PaginatedLeads {
    data: Lead[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Estatísticas de leads
 */
export interface LeadStats {
    total: number;
    byStatus: Array<{
        statusId: string;
        statusName: string;
        count: number;
    }>;
    bySource: Array<{
        sourceId: string;
        sourceName: string;
        count: number;
    }>;
    last30Days: number;
    avgScore: number;
}
// Adicione essas interfaces no seu arquivo de tipos

export interface Interaction {
    id: string;
    leadId: string;
    userId?: string;
    typeId: string;
    type: InteractionType;
    description?: string;
    scheduledAt?: string;
    completedAt?: string;
    isCompleted: boolean;
    result?: string;
    metadata?: any;
    createdAt: string;
    user?: {
        id: string;
        name: string;
    };
}

export interface InteractionType {
    id: string;
    name: string;
    displayName: string;
    icon?: string;
    isSystem: boolean;
}

export interface CreateInteractionData {
    leadId: string;
    typeId: string;
    description?: string;
    scheduledAt?: string;
    isCompleted?: boolean;
    result?: string;
    metadata?: any;
}

export interface UpdateInteractionData {
    description?: string;
    scheduledAt?: string;
    result?: string;
    isCompleted?: boolean;      // 👈 IMPORTANTE
    metadata?: any;
}


// Adicione essas interfaces no seu arquivo de tipos

export enum TipoImovel {
    APARTAMENTO = 'APARTAMENTO',
    CASA = 'CASA',
    CASA_CONDOMINIO = 'CASA_CONDOMINIO',
    SOBRADO = 'SOBRADO',
    TERRENO = 'TERRENO',
    COMERCIAL = 'COMERCIAL',
    RURAL = 'RURAL',
    KITNET = 'KITNET',
    LOFT = 'LOFT',
}

export enum StatusEmpreendimento {
    LANCAMENTO = 'LANCAMENTO',
    EM_OBRAS = 'EM_OBRAS',
    PRONTO_MORAR = 'PRONTO_MORAR',
    ENTREGUE = 'ENTREGUE',
    ESGOTADO = 'ESGOTADO',
    SUSPENSO = 'SUSPENSO',
}

export interface Empreendimento {
    id: string;
    name: string;
    construtora?: string;

    // Endereço
    endereco?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    latitude?: number;
    longitude?: number;

    // Valores
    valorMin?: number;
    valorMax?: number;
    entradaMin?: number;
    rendaIdealMin?: number;
    rendaIdealMax?: number;

    // Tipo e Status
    tipo?: TipoImovel;
    statusEmpreendimento?: StatusEmpreendimento;

    // Características
    quartosMin?: number;
    quartosMax?: number;
    vagas?: boolean;
    vagasMin?: number;
    vagasMax?: number;
    metragemMin?: number;
    metragemMax?: number;

    // Descrição
    descricao?: string;
    diferenciais?: string[];

    // Mídias
    fotosUrl?: string[];
    plantaUrl?: string;
    videoUrl?: string;
    tourVirtualUrl?: string;

    // Disponibilidade
    disponivel: boolean;
    unidadesTotais?: number;
    unidadesVendidas: number;
    unidadesDisponiveis?: number;
    previsaoEntrega?: string;
    dataLancamento?: string;

    // Metadados
    destaque: boolean;
    ordenacao: number;

    createdAt: string;
    updatedAt: string;

    // Relacionamentos (opcional)
    _count?: {
        leadsInteressados: number;
        vendas: number;
    };
}

export interface CreateEmpreendimentoData {
    name: string;
    construtora?: string;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    latitude?: number;
    longitude?: number;
    valorMin?: number;
    valorMax?: number;
    entradaMin?: number;
    rendaIdealMin?: number;
    rendaIdealMax?: number;
    tipo?: TipoImovel;
    statusEmpreendimento?: StatusEmpreendimento;
    quartosMin?: number;
    quartosMax?: number;
    vagas?: boolean;
    vagasMin?: number;
    vagasMax?: number;
    metragemMin?: number;
    metragemMax?: number;
    descricao?: string;
    diferenciais?: string[];
    fotosUrl?: string[];
    plantaUrl?: string;
    videoUrl?: string;
    tourVirtualUrl?: string;
    disponivel?: boolean;
    unidadesTotais?: number;
    unidadesVendidas?: number;
    unidadesDisponiveis?: number;
    previsaoEntrega?: string;
    dataLancamento?: string;
    destaque?: boolean;
    ordenacao?: number;
}

export interface EmpreendimentoFilters {
    search?: string;
    cidade?: string;
    tipo?: TipoImovel;
    statusEmpreendimento?: StatusEmpreendimento;
    disponivel?: boolean;
    destaque?: boolean;
    valorMinimo?: number;
    valorMaximo?: number;
    quartosMin?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedEmpreendimentos {
    data: Empreendimento[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}


// src/types/vendas.ts

export enum VendaStatus {
    PENDENTE = 'PENDENTE',
    APROVADO = 'APROVADO',
    CONTRATO_ASSINADO = 'CONTRATO_ASSINADO',
    CONCLUIDO = 'CONCLUIDO',
    CANCELADO = 'CANCELADO',
}

export interface Venda {
    id: string;
    userId: string;
    leadId: string;
    empreendimentoId?: string;

    // Valores
    valorImovel: number;
    subsidio: number;
    entrada: number;
    valorFinanciado?: number;
    parcelaMensal?: number;
    prazoMeses?: number;
    taxaJuros?: number;

    // Comissão
    comissaoPercentual?: number;
    comissaoValor?: number;
    comissaoPaga: boolean;

    // Datas
    dataVenda: string;
    dataAprovacaoCredito?: string;
    dataAssinaturaContrato?: string;
    previsaoEntregaChaves?: string;

    // Status
    status: VendaStatus;

    // Extras
    observacoes?: string;
    documentosUrl: string[];

    createdAt: string;
    updatedAt: string;

    // Relacionamentos
    user?: {
        id: string;
        name: string;
        email: string;
    };
    lead?: {
        id: string;
        name: string;
        phone: string;
        email?: string;
    };
    empreendimento?: {
        id: string;
        name: string;
        cidade?: string;
    };
    statusHistory?: VendaStatusHistory[];
}

export interface VendaStatusHistory {
    id: string;
    vendaId: string;
    statusAnterior?: VendaStatus;
    statusNovo: VendaStatus;
    changedBy?: string;
    motivo?: string;
    createdAt: string;
}

export interface CreateVendaData {
    leadId: string;
    empreendimentoId?: string;
    valorImovel: number;
    subsidio?: number;
    entrada?: number;
    valorFinanciado?: number;
    parcelaMensal?: number;
    prazoMeses?: number;
    taxaJuros?: number;
    comissaoPercentual?: number;
    comissaoValor?: number;
    dataVenda: string;
    dataAprovacaoCredito?: string;
    dataAssinaturaContrato?: string;
    previsaoEntregaChaves?: string;
    observacoes?: string;
    documentosUrl?: string[];
}

export interface VendaFilters {
    status?: VendaStatus;
    userId?: string;
    leadId?: string;
    empreendimentoId?: string;
    dataVendaInicio?: string;
    dataVendaFim?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedVendas {
    data: Venda[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface VendaStats {
    totalVendas: number;
    valorTotalVendido: number;
    comissaoTotal: number;
    vendasPorStatus: Array<{
        status: VendaStatus;
        quantidade: number;
    }>;
    vendasUltimos30Dias: number;
}

export interface Meta {
    id: string;
    mes: number;
    ano: number;
    valorMeta: number;
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MetaProgresso {
    mes: number;
    ano: number;
    valorMeta: number;
    valorRealizado: number;
    percentualAtingido: number;
    vendasRealizadas: number;
    comissoesTotais: number;
    userId?: string;
    userName?: string;
}

export interface SetMetaData {
    mes: number;
    ano: number;
    valorMeta: number;
    userId?: string;
}


export interface RegisterTenantData {
    // Dados da Imobiliária
    nome: string;
    cnpjCpf: string;
    razaoSocial?: string;
    email: string;
    telefone?: string;

    // Dados do Admin
    adminName: string;
    adminEmail: string;
    adminPassword: string;
    adminPhone?: string;
    adminCpf?: string;
}

export interface RegisterTenantResponse {
    tenant: {
        id: string;
        nome: string;
        cnpjCpf: string;
        email: string;
        status: string;
        plan: string;
        trialEndsAt?: string;
        databaseName: string;
    };
    admin: {
        id: string;
        name: string;
        email: string;
    };
    credentials: {
        tenantKey: string;
        adminEmail: string;
        message: string;
    };
}

export interface LoginData {
    tenantKey: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: {
            id: string;
            name: string;
        };
        tenant: {
            key: string;
            id: string;
        };
        permissions: any;
    };
}

export interface RegisterTenantData {
    // Dados da Imobiliária
    nome: string;
    cnpjCpf: string;
    razaoSocial?: string;
    email: string;
    telefone?: string;

    // Dados do Primeiro Admin
    adminName: string;
    adminEmail: string;
    adminPassword: string;
    adminPhone?: string;
    adminCpf?: string;
}

/**
 * Resposta do registro de tenant
 */
export interface RegisterTenantResponse {
    tenant: {
        id: string;
        nome: string;
        cnpjCpf: string;
        email: string;
        status: string;
        plan: string;
        trialEndsAt?: string;
        databaseName: string;
    };
    admin: {
        id: string;
        name: string;
        email: string;
    };
    credentials: {
        tenantKey: string;      // CPF/CNPJ para usar no login
        adminEmail: string;     // Email do admin
        message: string;
    };
}

// ========================================
// ROLES E PERMISSÕES
// ========================================

export interface Role {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    permissions: Record<string, string[]>;
    isSystem: boolean;
    createdAt: string;
}

export interface Team {
    id: string;
    name: string;
    description?: string;
    leaderId?: string;
    createdAt: string;
}


// ========================================
// API RESPONSES PADRÃO
// ========================================

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}