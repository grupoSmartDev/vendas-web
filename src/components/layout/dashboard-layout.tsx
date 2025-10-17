'use client';

// src/components/layout/dashboard-layout.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const { user, isLoading, loadUser } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // ⚠️ LOGS DE DEBUG
        console.log('🔍 DashboardLayout useEffect');
        console.log('  isAuthenticated:', authService.isAuthenticated());
        console.log('  user:', user);
        console.log('  isLoading:', isLoading);
        console.log('  token:', localStorage.getItem('accessToken')?.substring(0, 20) + '...');

        // Se não está autenticado, redireciona para login
        if (!authService.isAuthenticated()) {
            console.log('❌ Não autenticado, redirecionando...');
            router.push('/login');
            return;
        }

        // Carrega dados do usuário se ainda não carregou
        if (!user && !isLoading) {
            console.log('📥 Carregando usuário...');
            loadUser().catch((error) => {
                console.error('❌ Erro ao carregar usuário:', error);
            });
        }
    }, [user, isLoading, loadUser, router]);

    // Loading state
    if (isLoading) {
        console.log('⏳ Loading state ativo');
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
            </div>
        );
    }

    // Se não tem usuário após carregar, não renderiza nada
    if (!user) {
        console.log('❌ Sem usuário, não renderizando');
        return null;
    }

    console.log('✅ Renderizando dashboard');

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r">
                <Sidebar />
            </aside>

            {/* Sidebar Mobile (Sheet) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-muted/40">
                    <div className="container mx-auto p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}