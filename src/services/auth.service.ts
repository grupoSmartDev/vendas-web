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

const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '43610517808';

export const authService = {
    /**
     * Faz login no sistema
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        console.log('🔐 auth.service - Fazendo login...');
        console.log('📧 Email:', credentials.email);

        try {
            const { data } = await api.post<AuthResponse>(
                `/tenants/${TENANT_KEY}/auth/login`,
                credentials
            );

            console.log('✅ Resposta do backend recebida!');
            console.log('📦 Data completo:', data);
            console.log('🔑 Tokens?', !!data.tokens);
            console.log('👤 User?', !!data.user);

            if (!data.tokens || !data.tokens.accessToken) {
                console.error('❌ PROBLEMA: Backend não retornou tokens!');
                throw new Error('Tokens não retornados pelo backend');
            }

            console.log('💾 Salvando tokens no localStorage...');
            console.log('  accessToken:', data.tokens.accessToken.substring(0, 30) + '...');

            // Salva tokens no localStorage
            localStorage.setItem('accessToken', data.tokens.accessToken);
            localStorage.setItem('refreshToken', data.tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Verificar se salvou
            console.log('🔍 Verificando se salvou:');
            console.log('  accessToken no localStorage:', !!localStorage.getItem('accessToken'));
            console.log('  refreshToken no localStorage:', !!localStorage.getItem('refreshToken'));
            console.log('  user no localStorage:', !!localStorage.getItem('user'));

            const savedToken = localStorage.getItem('accessToken');
            console.log('  Token salvo:', savedToken?.substring(0, 30) + '...');

            return data;
        } catch (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }
    },

    /**
     * Registra usuário em tenant existente
     * (Usado quando admin adiciona novo corretor)
     */
    async register(userData: RegisterData): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>(
            `/tenants/${TENANT_KEY}/auth/register`,
            userData
        );

        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    /**
     * Registra NOVA IMOBILIÁRIA (Tenant) - Rota pública!
     * Essa rota NÃO usa tenant key, pois está criando um novo tenant
     */
    async registerTenant(tenantData: RegisterTenantData): Promise<RegisterTenantResponse> {
        console.log('🏢 auth.service - Registrando nova imobiliária...');
        console.log('📋 Dados:', tenantData);

        try {
            const { data } = await api.post<RegisterTenantResponse>(
                '/tenants/register',  // ⚠️ SEM tenant key! É rota pública
                tenantData
            );

            console.log('✅ Imobiliária criada com sucesso!');
            console.log('🔑 Tenant Key:', data.credentials.tenantKey);
            console.log('📧 Email Admin:', data.credentials.adminEmail);

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
        const { data } = await api.get<User>(
            `/tenants/${TENANT_KEY}/auth/me`
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