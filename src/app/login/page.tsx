'use client';

// src/app/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

/**
 * Schema de validação do formulário
 */
const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    /**
     * Faz login
     */
    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            console.log('🔐 Fazendo login...');
            console.log('📧 Email:', data.email);

            const response = await authService.login({
                email: data.email,
                password: data.password,
            });

            console.log('✅ Login OK!');
            console.log('👤 Usuário:', response.user.name);
            console.log('🔑 Token salvo:', !!localStorage.getItem('accessToken'));

            // ⚠️ Setar o usuário no store imediatamente
            setUser(response.user);

            toast.success(`Bem-vindo, ${response.user.name}!`);

            // Pequeno delay para garantir que tudo foi salvo
            setTimeout(() => {
                console.log('🚀 Redirecionando para /leads');
                router.push('/leads');
            }, 100);

        } catch (err: any) {
            console.error('❌ Erro no login:', err.response?.data);
            toast.error(err.response?.data?.message || 'Email ou senha incorretos');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary rounded-full">
                            <Building2 className="w-8 h-8 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">10x Vendas</CardTitle>
                    <CardDescription>
                        Entre na sua conta para continuar
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email')}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">
                            Não tem uma conta?{' '}
                        </span>
                        <a
                            href="/register"
                            className="text-primary hover:underline font-medium"
                        >
                            Cadastre-se
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}