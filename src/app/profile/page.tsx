'use client';

// src/app/profile/page.tsx
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { UserCircle, Mail, Phone, Building2, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <UserCircle className="h-8 w-8" />
                        Meu Perfil
                    </h1>
                    <p className="text-muted-foreground">
                        Visualize e edite suas informações pessoais
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informações Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                            <CardDescription>
                                Seus dados cadastrados no sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <UserCircle className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Nome</p>
                                    <p className="text-sm text-muted-foreground">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Telefone</p>
                                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Cargo</p>
                                    <Badge variant="secondary">{user.role.displayName}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informações da Empresa */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Empresa</CardTitle>
                            <CardDescription>
                                Informações da sua imobiliária
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Nome</p>
                                    <p className="text-sm text-muted-foreground">{user.tenant.nome}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Plano</p>
                                    <Badge>{user.tenant.plan}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissões */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Permissões</CardTitle>
                            <CardDescription>
                                O que você pode fazer no sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {Object.entries(user.permissions).map(([module, actions]) => (
                                    <div key={module} className="space-y-2">
                                        <p className="text-sm font-medium capitalize">{module}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(actions as string[]).map((action) => (
                                                <Badge key={action} variant="outline" className="text-xs">
                                                    {action}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}