// src/app/(dashboard)/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    Phone,
    MessageSquare,
    UserPlus,
    Home,
    FileText,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Target,
    Award,
    Activity,
    Zap,
    Mail,
    ArrowRight,
    User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { leadsService } from '@/services/lead.service';
import { vendasService } from '@/services/vendas.service';
import { interactionsService } from '@/services/interactions.service';
import { useAuthStore } from '@/store/auth.store';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DashboardLayout } from '@/components/layout';

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    // Estados
    const [leadsStats, setLeadsStats] = useState<any>(null);
    const [vendasStats, setVendasStats] = useState<any>(null);
    const [recentLeads, setRecentLeads] = useState<any[]>([]);
    const [recentInteractions, setRecentInteractions] = useState<any[]>([]);
    const [metaProgresso, setMetaProgresso] = useState<any>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);

            // Carregar dados em paralelo
            const [leads, vendas, leadsRecentes, interacoes, meta] = await Promise.all([
                leadsService.getStats().catch(() => ({ total: 0, last30Days: 0 })),
                vendasService.getStats().catch(() => ({})),
                leadsService.getAll({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }).catch(() => ({ data: [] })),
                // 🆕 Backend retorna ARRAY direto, não { data: [] }
                interactionsService.getAll({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }).catch(() => []),
                vendasService.getMetaProgresso().catch(() => null),
            ]);

            setLeadsStats(leads);
            setVendasStats(vendas);
            setRecentLeads(leadsRecentes?.data || []);
            // ✅ interacoes JÁ É o array, não precisa .data
            setRecentInteractions(Array.isArray(interacoes) ? interacoes : []);
            setMetaProgresso(meta);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getVariacaoColor = (valor: number) => {
        if (valor > 0) return 'text-green-600';
        if (valor < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getVariacaoIcon = (valor: number) => {
        if (valor > 0) return <TrendingUp className="h-4 w-4" />;
        if (valor < 0) return <TrendingDown className="h-4 w-4" />;
        return null;
    };

    // 🆕 Função para pegar ícone do tipo de interação
    const getInteractionIcon = (typeName: string) => {
        const icons: Record<string, any> = {
            call: Phone,
            ligacao: Phone,
            whatsapp: MessageSquare,
            email: Mail,
            visit: Home,
            visita: Home,
            meeting: Users,
            reuniao: Users,
            follow_up: Clock,
            anotacao: FileText,
        };

        const IconComponent = icons[typeName?.toLowerCase()] || Activity;
        return IconComponent;
    };

    // 🆕 Função para cor do tipo
    const getInteractionColor = (typeName: string) => {
        const colors: Record<string, string> = {
            call: 'bg-blue-100 text-blue-600',
            ligacao: 'bg-blue-100 text-blue-600',
            whatsapp: 'bg-green-100 text-green-600',
            email: 'bg-purple-100 text-purple-600',
            visit: 'bg-orange-100 text-orange-600',
            visita: 'bg-orange-100 text-orange-600',
            meeting: 'bg-pink-100 text-pink-600',
            reuniao: 'bg-pink-100 text-pink-600',
        };

        return colors[typeName?.toLowerCase()] || 'bg-gray-100 text-gray-600';
    };

    // Calcular alertas
    const alertas = [];
    if (recentLeads.length > 0) {
        const leadsSemContato = recentLeads.filter((lead: any) => {
            const ultimaInteracao = lead.ultimaInteracao
                ? new Date(lead.ultimaInteracao)
                : new Date(lead.createdAt);
            const diasSemContato = Math.floor(
                (new Date().getTime() - ultimaInteracao.getTime()) / (1000 * 60 * 60 * 24)
            );
            return diasSemContato >= 3;
        });

        if (leadsSemContato.length > 0) {
            alertas.push({
                tipo: 'warning',
                mensagem: `Você tem ${leadsSemContato.length} leads sem contato há mais de 3 dias`,
            });
        }
    }

    if (metaProgresso && metaProgresso.percentualAtingido >= 100) {
        alertas.push({
            tipo: 'success',
            mensagem: '🎉 Parabéns! Meta do mês batida!',
        });
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Olá, {user?.name || 'Corretor'}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Aqui está o resumo das suas atividades hoje
                    </p>
                </div>

                {/* Cards de Métricas Principais */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Leads Totais */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Leads Totais</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{leadsStats?.total || 0}</div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <span className={getVariacaoColor(12)}>+12%</span>
                                        em relação ao mês passado
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vendas no Mês */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vendas no Mês</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">
                                        {metaProgresso?.vendasRealizadas || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        {metaProgresso && (
                                            <>
                                                <span className="text-green-600">
                                                    {formatCurrency(metaProgresso.valorRealizado)}
                                                </span>
                                                {' '}em vendas
                                            </>
                                        )}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Taxa de Conversão */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">
                                        {leadsStats?.conversionRate?.toFixed(1) || 0}%
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        +0.5% em relação ao mês passado
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Equipe Ativa */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Equipe Ativa</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <Award className="h-4 w-4 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        +2 em relação ao mês passado
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Grid Principal */}
                <div className="grid gap-6 md:grid-cols-7">
                    {/* Coluna Esquerda - Maior */}
                    <div className="space-y-6 md:col-span-4">
                        {/* 🆕 ATIVIDADES RECENTES MELHORADAS */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Atividades Recentes
                                </CardTitle>
                                <CardDescription>Suas últimas interações com leads</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : recentInteractions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Activity className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                                        <p className="text-muted-foreground">Nenhuma atividade recente</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Comece registrando interações com seus leads
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentInteractions.slice(0, 5).map((interaction: any) => {
                                            const IconComponent = getInteractionIcon(interaction.type?.name || 'activity');
                                            const colorClass = getInteractionColor(interaction.type?.name || 'activity');

                                            return (
                                                <div
                                                    key={interaction.id}
                                                    className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-colors cursor-pointer"
                                                    onClick={() => router.push(`/leads`)}
                                                >
                                                    {/* Ícone do Tipo */}
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                                        <IconComponent className="h-5 w-5" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        {/* Título Principal */}
                                                        <div className="flex items-start gap-2 mb-1 flex-wrap">
                                                            <p className="text-sm font-semibold">
                                                                {interaction.type?.displayName || 'Interação'}
                                                            </p>
                                                            {interaction.lead && (
                                                                <span className="text-sm text-muted-foreground">
                                                                    com <span className="font-medium text-foreground">{interaction.lead.name}</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Descrição */}
                                                        {interaction.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                                                                {interaction.description}
                                                            </p>
                                                        )}

                                                        {/* Resultado (se tiver) */}
                                                        {interaction.result && interaction.isCompleted && (
                                                            <div className="flex items-start gap-1 mt-1 bg-green-50 border border-green-200 rounded px-2 py-1">
                                                                <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                                                <p className="text-xs text-green-800 line-clamp-1">
                                                                    {interaction.result}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Footer com meta-info */}
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                                                            {/* Tempo */}
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {formatDistanceToNow(new Date(interaction.createdAt), {
                                                                    locale: ptBR,
                                                                    addSuffix: true,
                                                                })}
                                                            </span>

                                                            {/* Usuário */}
                                                            {interaction.user && (
                                                                <span className="flex items-center gap-1">
                                                                    <User className="h-3 w-3" />
                                                                    {interaction.user.name}
                                                                </span>
                                                            )}

                                                            {/* Status */}
                                                            {interaction.isCompleted ? (
                                                                <Badge variant="outline" className="h-5 text-xs bg-green-50 text-green-700 border-green-200">
                                                                    Concluída
                                                                </Badge>
                                                            ) : interaction.scheduledAt ? (
                                                                <Badge variant="outline" className="h-5 text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                                                    Agendada
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="h-5 text-xs">
                                                                    Pendente
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Botão Ver Todas */}
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-2"
                                            onClick={() => router.push('/leads')}
                                        >
                                            Ver todas as atividades
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Leads Recentes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    Leads Recentes
                                </CardTitle>
                                <CardDescription>Últimos leads cadastrados no sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-3">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <Skeleton key={i} className="h-20 w-full" />
                                        ))}
                                    </div>
                                ) : recentLeads.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Nenhum lead recente
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentLeads.map((lead: any) => (
                                            <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/leads')}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium">{lead.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {lead.phone}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge
                                                                style={{
                                                                    backgroundColor: lead.status?.color,
                                                                    color: 'white',
                                                                }}
                                                                className="text-xs"
                                                            >
                                                                {lead.status?.displayName}
                                                            </Badge>
                                                            {lead.score && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Score: {lead.score}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="ghost">
                                                            <Phone className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost">
                                                            <MessageSquare className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coluna Direita - Menor */}
                    <div className="space-y-6 md:col-span-3">
                        {/* Metas do Mês */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Metas do Mês
                                </CardTitle>
                                <CardDescription>
                                    Seu progresso em{' '}
                                    {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Meta de Vendas */}
                                {metaProgresso && metaProgresso.valorMeta > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Vendas</span>
                                            <span className="text-sm font-bold">
                                                {metaProgresso.vendasRealizadas}/{metaProgresso.valorMeta > 0 ? Math.ceil(metaProgresso.valorMeta / 350000) : 10}
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.min(metaProgresso.percentualAtingido, 100)}
                                            className="h-2"
                                        />
                                    </div>
                                )}

                                {/* Meta de Leads */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Leads</span>
                                        <span className="text-sm font-bold">
                                            {leadsStats?.last30Days || 0}/50
                                        </span>
                                    </div>
                                    <Progress
                                        value={((leadsStats?.last30Days || 0) / 50) * 100}
                                        className="h-2"
                                    />
                                </div>

                                {/* Meta de Ligações */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Ligações</span>
                                        <span className="text-sm font-bold">
                                            {recentInteractions.length}/100
                                        </span>
                                    </div>
                                    <Progress
                                        value={(recentInteractions.length / 100) * 100}
                                        className="h-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Alertas e Insights */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Insights e Alertas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {alertas.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                        <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                        Tudo em dia! Continue assim! 💪
                                    </div>
                                ) : (
                                    alertas.map((alerta, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border ${alerta.tipo === 'warning'
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : alerta.tipo === 'success'
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-blue-50 border-blue-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {alerta.tipo === 'warning' && (
                                                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                                )}
                                                {alerta.tipo === 'success' && (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                                )}
                                                <p className="text-sm flex-1">{alerta.mensagem}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Atalhos Rápidos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Atalhos Rápidos</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => router.push('/leads')}
                                >
                                    <UserPlus className="h-5 w-5" />
                                    <span className="text-xs">Novo Lead</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => router.push('/leads')}
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span className="text-xs">Agendar Visita</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => router.push('/empreendimentos')}
                                >
                                    <Home className="h-5 w-5" />
                                    <span className="text-xs">Empreendimentos</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 flex flex-col gap-2"
                                    onClick={() => router.push('/vendas')}
                                >
                                    <DollarSign className="h-5 w-5" />
                                    <span className="text-xs">Nova Venda</span>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer com Checklist */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base">Sistema Funcionando!</CardTitle>
                            <Badge variant="secondary">v1.0</Badge>
                        </div>
                        <CardDescription>
                            Layout completo com sidebar responsiva implementado
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    Implementado:
                                </p>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Sidebar com menu de navegação</li>
                                    <li>• Header com dropdown de usuário</li>
                                    <li>• Layout responsivo (mobile + desktop)</li>
                                    <li>• Autenticação funcionando</li>
                                    <li>• Integração completa com API</li>
                                    <li>• Kanban de Leads</li>
                                    <li>• Sistema de Vendas com Metas</li>
                                    <li>• Sistema de Atividades com Feedback</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-blue-600" />
                                    Próximos passos:
                                </p>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Dashboard com gráficos reais</li>
                                    <li>• Controle de Atividades Diárias</li>
                                    <li>• Calendário de atividades</li>
                                    <li>• Relatórios avançados</li>
                                    <li>• Gestão de Usuários e Equipes</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}