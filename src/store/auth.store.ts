// src/store/auth.store.ts
import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    loadUser: () => Promise<void>;
    logout: () => void;
}

/**
 * Store global de autenticação
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false, // ⚠️ MUDAR DE true PARA false
    isAuthenticated: false,

    /**
     * Define o usuário
     */
    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
    }),

    /**
     * Carrega dados do usuário autenticado
     */
    loadUser: async () => {
        console.log('📥 loadUser - Iniciando...');

        try {
            set({ isLoading: true });

            if (!authService.isAuthenticated()) {
                console.log('❌ loadUser - Não autenticado');
                set({ user: null, isAuthenticated: false, isLoading: false });
                return;
            }

            // ⚠️ NOVO: Tentar carregar do localStorage primeiro
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                console.log('✅ loadUser - Usuário encontrado no localStorage');
                const user = JSON.parse(storedUser);
                set({ user, isAuthenticated: true, isLoading: false });

                // Atualizar em background
                authService.getProfile()
                    .then(freshUser => {
                        console.log('✅ loadUser - Usuário atualizado da API');
                        set({ user: freshUser });
                        localStorage.setItem('user', JSON.stringify(freshUser));
                    })
                    .catch(console.error);

                return;
            }

            console.log('📡 loadUser - Buscando da API...');
            const user = await authService.getProfile();
            console.log('✅ loadUser - Sucesso:', user.name);

            // ⚠️ NOVO: Salvar no localStorage
            localStorage.setItem('user', JSON.stringify(user));

            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('❌ loadUser - Erro:', error);
            set({ user: null, isAuthenticated: false, isLoading: false });

            // ⚠️ IMPORTANTE: Só fazer logout se for erro 401

        }
    },

    /**
     * Faz logout
     */
    logout: () => {
        localStorage.removeItem('user'); // ⚠️ ADICIONAR
        authService.logout();
        set({ user: null, isAuthenticated: false });
    },
}));