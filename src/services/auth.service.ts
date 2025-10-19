// src/services/auth.service.ts
import { api } from '@/lib/api';
import type {
    AuthResponse,
    LoginCredentials,
    RegisterData,
    RegisterTenantData,
    RegisterTenantResponse,
    User
} from '@/types';

export const authService = {
    /**
     * 🆕 LOGIN SIMPLIFICADO - Apenas email e senha
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        console.log('🔐 auth.service - Fazendo login...');
        console.log('📧 Email:', credentials.email);

        try {
            // 🆕 MUDOU: Nova rota sem tenant key
            const { data } = await api.post<AuthResponse>(
                `/auth/login`,  // ✅ Removido /tenants/${TENANT_KEY}
                credentials
            );

            console.log('✅ Resposta do backend recebida!');
            console.log('📦 Data completo:', data);

            if (!data.tokens || !data.tokens.accessToken) {
                console.error('❌ PROBLEMA: Backend não retornou tokens!');
                throw new Error('Tokens não retornados pelo backend');
            }

            console.log('💾 Salvando tokens no localStorage...');

            // Salva tokens
            localStorage.setItem('accessToken', data.tokens.accessToken);
            localStorage.setItem('refreshToken', data.tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // 🆕 NOVO: Salva o tenantKey retornado pelo backend
            if (data.user.tenant.cnpjCpf) {
                localStorage.setItem('tenantKey', data.user.tenant.cnpjCpf);
                console.log('🔑 TenantKey salvo:', data.user.tenant.cnpjCpf);
            }

            console.log('✅ Tudo salvo com sucesso!');

            return data;
        } catch (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }
    },

    /**
     * Registra usuário em tenant existente
     */
    async register(userData: RegisterData): Promise<AuthResponse> {
        const tenantKey = this.getTenantKey(); // ✅ Usar método

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado. Faça login primeiro.');
        }

        const { data } = await api.post<AuthResponse>(
            `/auth/${tenantKey}/register`,
            userData
        );

        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    /**
     * Registra NOVA IMOBILIÁRIA (Tenant) - Rota pública!
     */
    async registerTenant(tenantData: RegisterTenantData): Promise<RegisterTenantResponse> {
        console.log('🏢 auth.service - Registrando nova imobiliária...');
        console.log('📋 Dados:', tenantData);

        try {
            const { data } = await api.post<RegisterTenantResponse>(
                '/tenants/register',
                tenantData
            );

            console.log('✅ Imobiliária criada com sucesso!');
            console.log('🔑 Tenant Key:', data.credentials.tenantKey);

            return data;
        } catch (error) {
            console.error('❌ Erro ao registrar tenant:', error);
            throw error;
        }
    },

    /**
     * Busca dados do usuário autenticado
     */
    async getProfile(): Promise<User> {
        const tenantKey = this.getTenantKey(); // ✅ Usar método

        if (!tenantKey) {
            throw new Error('TenantKey não encontrado. Faça login primeiro.');
        }

        const { data } = await api.get<User>(
            `/tenants/${tenantKey}/auth/me`
        );

        return data;
    },

    /**
     * Faz logout
     */
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tenantKey'); // 🆕 Remove tenantKey
        window.location.href = '/login';
    },

    /**
     * Verifica se usuário está autenticado
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    },

    /**
     * Retorna token do localStorage
     */
    getToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    /**
     * 🆕 NOVO MÉTODO - Retorna tenantKey do localStorage
     */
    getTenantKey(): string | null {
        return localStorage.getItem('tenantKey');
    },

    /**
     * Retorna usuário do localStorage
     */
    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
};