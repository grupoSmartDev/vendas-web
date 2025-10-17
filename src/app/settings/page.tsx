'use client';

// src/app/settings/page.tsx
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Settings className="h-8 w-8" />
                        Configurações
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie as configurações do sistema
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Em Desenvolvimento</CardTitle>
                        <CardDescription>
                            Configurações do sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Em breve você poderá configurar notificações, preferências e muito mais! ⚙️
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}