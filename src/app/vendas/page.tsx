// src/app/(dashboard)/vendas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    Award,
    Calendar,
    MoreVertical,
    Eye,
    Trash2,
    Filter,
    Target,
    RefreshCw,
    History,
    CalendarCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { vendasService } from '@/services/vendas.service';
import { ViewVendaDialog } from '@/components/vendas/ViewVendaDialog';
import { MetaProgressCard } from '@/components/vendas/MetaProgressCard';
import type { Venda, VendaStatus, VendaStats, VendaFilters, MetaProgresso } from '@/types/index';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DashboardLayout } from '@/components/layout';

const statusConfig: Record<VendaStatus, { label: string; color: string }> = {
    PENDENTE: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    APROVADO: { label: 'Aprovado', color: 'bg-blue-100 text-blue-800' },
    CONTRATO_ASSINADO: { label: 'Contrato Assinado', color: 'bg-purple-100 text-purple-800' },
    CONCLUIDO: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
    CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

const meses = [
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' },
];

export default function VendasPage() {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [stats, setStats] = useState<VendaStats | null>(null);
    const [metaProgresso, setMetaProgresso] = useState<MetaProgresso | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
    const [isMetaDialogOpen, setIsMetaDialogOpen] = useState(false);
    const [metaValor, setMetaValor] = useState('');

    // Filtros de Período
    const hoje = new Date();
    const [metaMes, setMetaMes] = useState<number>(hoje.getMonth() + 1);
    const [metaAno, setMetaAno] = useState<number>(hoje.getFullYear());
    const [mostrarHistoricoCompleto, setMostrarHistoricoCompleto] = useState(false);

    // Dialog de Meta
    const [metaDialogMes, setMetaDialogMes] = useState<number>(hoje.getMonth() + 1);
    const [metaDialogAno, setMetaDialogAno] = useState<number>(hoje.getFullYear());

    // Filtros de Vendas
    const [filters, setFilters] = useState<VendaFilters>({
        page: 1,
        limit: 50,
        sortBy: 'dataVenda',
        sortOrder: 'desc',
    });

    const [totalPages, setTotalPages] = useState(1);
    const [totalVendas, setTotalVendas] = useState(0);

    // Anos disponíveis (últimos 3 anos + próximos 2)
    const anosDisponiveis = Array.from(
        { length: 5 },
        (_, i) => hoje.getFullYear() - 2 + i
    );

    // Aplicar filtro de período nas vendas automaticamente
    useEffect(() => {
        if (!mostrarHistoricoCompleto) {
            // Calcular início e fim do mês selecionado
            const inicioMes = new Date(metaAno, metaMes - 1, 1);
            const fimMes = new Date(metaAno, metaMes, 0, 23, 59, 59);

            setFilters(prev => ({
                ...prev,
                dataVendaInicio: inicioMes.toISOString().split('T')[0],
                dataVendaFim: fimMes.toISOString().split('T')[0],
                page: 1,
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                dataVendaInicio: undefined,
                dataVendaFim: undefined,
                page: 1,
            }));
        }
    }, [metaMes, metaAno, mostrarHistoricoCompleto]);

    // Carregar dados
    useEffect(() => {
        loadVendas();
    }, [filters]);

    useEffect(() => {
        loadStats();
        loadMetaProgresso();
    }, [metaMes, metaAno, mostrarHistoricoCompleto]);

    const loadVendas = async () => {
        try {
            setIsLoading(true);
            const response = await vendasService.getAll(filters);
            setVendas(response.data);
            setTotalPages(response.totalPages);
            setTotalVendas(response.total);
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
            toast.error('Erro ao carregar vendas');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await vendasService.getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const loadMetaProgresso = async () => {
        try {
            const progresso = await vendasService.getMetaProgresso(metaMes, metaAno);
            setMetaProgresso(progresso);
        } catch (error) {
            console.error('Erro ao carregar meta:', error);
            setMetaProgresso(null);
        }
    };

    const handleViewVenda = (venda: Venda) => {
        setSelectedVenda(venda);
        setIsViewOpen(true);
    };

    const handleDeleteVenda = async (vendaId: string) => {
        if (!confirm('Tem certeza que deseja deletar esta venda?')) return;

        try {
            await vendasService.delete(vendaId);
            toast.success('Venda deletada com sucesso!');
            loadVendas();
            loadStats();
            loadMetaProgresso();
        } catch (error) {
            console.error('Erro ao deletar venda:', error);
            toast.error('Erro ao deletar venda');
        }
    };

    const handleOpenMetaDialog = () => {
        setMetaDialogMes(metaMes);
        setMetaDialogAno(metaAno);

        if (metaProgresso && metaProgresso.valorMeta > 0) {
            setMetaValor(metaProgresso.valorMeta.toString());
        } else {
            setMetaValor('');
        }

        setIsMetaDialogOpen(true);
    };

    const handleDefinirMeta = async () => {
        if (!metaValor) {
            toast.error('Informe o valor da meta');
            return;
        }

        try {
            await vendasService.setMeta({
                mes: metaDialogMes,
                ano: metaDialogAno,
                valorMeta: parseFloat(metaValor),
            });

            const mesNome = meses.find(m => m.valor === metaDialogMes)?.nome;
            toast.success(`Meta de ${mesNome}/${metaDialogAno} definida com sucesso!`);

            setIsMetaDialogOpen(false);
            setMetaValor('');

            if (metaDialogMes === metaMes && metaDialogAno === metaAno) {
                loadMetaProgresso();
            }
        } catch (error) {
            console.error('Erro ao definir meta:', error);
            toast.error('Erro ao definir meta');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (date: string) => {
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    };

    // Calcular stats do período (baseado nas vendas carregadas)
    const statsPeriodo = {
        totalVendas: vendas.length,
        valorTotal: vendas.reduce((sum, v) => sum + Number(v.valorImovel || 0), 0),
        comissaoTotal: vendas.reduce((sum, v) => sum + Number(v.comissaoValor || 0), 0),
    };


    const mesNomeSelecionado = meses.find(m => m.valor === metaMes)?.nome;

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
                        <p className="text-muted-foreground">
                            Gerencie suas vendas, comissões e metas
                        </p>
                    </div>
                    <Button onClick={handleOpenMetaDialog}>
                        <Target className="h-4 w-4 mr-2" />
                        Definir Meta
                    </Button>
                </div>

                {/* FILTROS DE PERÍODO E TOGGLE */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4" />
                                Período de Análise
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="historico-toggle" className="text-sm">
                                    {mostrarHistoricoCompleto ? (
                                        <>
                                            <History className="h-4 w-4 inline mr-1" />
                                            Histórico Completo
                                        </>
                                    ) : (
                                        <>
                                            <CalendarCheck className="h-4 w-4 inline mr-1" />
                                            Período Específico
                                        </>
                                    )}
                                </Label>
                                <Switch
                                    id="historico-toggle"
                                    checked={mostrarHistoricoCompleto}
                                    onCheckedChange={setMostrarHistoricoCompleto}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!mostrarHistoricoCompleto && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label>Mês:</Label>
                                    <Select
                                        value={metaMes.toString()}
                                        onValueChange={(value) => setMetaMes(parseInt(value))}
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {meses.map((mes) => (
                                                <SelectItem key={mes.valor} value={mes.valor.toString()}>
                                                    {mes.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label>Ano:</Label>
                                    <Select
                                        value={metaAno.toString()}
                                        onValueChange={(value) => setMetaAno(parseInt(value))}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {anosDisponiveis.map((ano) => (
                                                <SelectItem key={ano} value={ano.toString()}>
                                                    {ano}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        loadVendas();
                                        loadStats();
                                        loadMetaProgresso();
                                    }}
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Atualizar
                                </Button>
                            </div>
                        )}
                        {mostrarHistoricoCompleto && (
                            <p className="text-sm text-muted-foreground">
                                Mostrando dados de todas as vendas registradas
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* META DO PERÍODO */}
                {!mostrarHistoricoCompleto && metaProgresso && metaProgresso.valorMeta > 0 ? (
                    <MetaProgressCard metaProgresso={metaProgresso} />
                ) : !mostrarHistoricoCompleto ? (
                    <Card className="border-dashed">
                        <CardContent className="pt-6 pb-6 text-center">
                            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 mb-4">
                                Nenhuma meta definida para{' '}
                                <strong>
                                    {mesNomeSelecionado}/{metaAno}
                                </strong>
                            </p>
                            <Button onClick={handleOpenMetaDialog}>
                                <Target className="h-4 w-4 mr-2" />
                                Definir Meta para este Período
                            </Button>
                        </CardContent>
                    </Card>
                ) : null}

                {/* Cards de Estatísticas - SINCRONIZADOS */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {mostrarHistoricoCompleto ? 'Total de Vendas' : 'Vendas do Período'}
                            </CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {mostrarHistoricoCompleto
                                    ? stats?.totalVendas || 0
                                    : statsPeriodo.totalVendas}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {mostrarHistoricoCompleto
                                    ? 'Todas as vendas'
                                    : `${mesNomeSelecionado}/${metaAno}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {mostrarHistoricoCompleto ? 'Valor Total' : 'Valor do Período'}
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {mostrarHistoricoCompleto
                                    ? formatCurrency(stats?.valorTotalVendido || 0)
                                    : formatCurrency(statsPeriodo.valorTotal)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {mostrarHistoricoCompleto
                                    ? 'Histórico completo'
                                    : `${mesNomeSelecionado}/${metaAno}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {mostrarHistoricoCompleto ? 'Comissão Total' : 'Comissão do Período'}
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {mostrarHistoricoCompleto
                                    ? formatCurrency(stats?.comissaoTotal || 0)
                                    : formatCurrency(statsPeriodo.comissaoTotal)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {mostrarHistoricoCompleto
                                    ? 'Histórico completo'
                                    : `${mesNomeSelecionado}/${metaAno}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Últimos 30 dias</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats?.vendasUltimos30Dias || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Vendas recentes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros Adicionais de Vendas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filtros Adicionais
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        status: value === 'all' ? undefined : (value as VendaStatus),
                                        page: 1,
                                    })
                                }
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos status</SelectItem>
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            {config.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                onClick={() =>
                                    setFilters({
                                        ...filters,
                                        status: undefined,
                                        page: 1,
                                    })
                                }
                            >
                                Limpar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Lista de Vendas
                            {!mostrarHistoricoCompleto && (
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    - {mesNomeSelecionado}/{metaAno}
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Empreendimento</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Comissão</TableHead>
                                <TableHead>Data Venda</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-32" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-16" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8 ml-auto" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : vendas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Nenhuma venda encontrada
                                        {!mostrarHistoricoCompleto && (
                                            <span className="block text-sm text-muted-foreground mt-1">
                                                para {mesNomeSelecionado}/{metaAno}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                vendas.map((venda) => (
                                    <TableRow
                                        key={venda.id}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleViewVenda(venda)}
                                    >
                                        <TableCell className="font-medium">
                                            {venda.lead?.name}
                                        </TableCell>
                                        <TableCell>
                                            {venda.empreendimento?.name || '-'}
                                        </TableCell>
                                        <TableCell className="font-semibold text-blue-600">
                                            {formatCurrency(venda.valorImovel)}
                                        </TableCell>
                                        <TableCell className="font-semibold text-green-600">
                                            {venda.comissaoValor
                                                ? formatCurrency(venda.comissaoValor)
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{formatDate(venda.dataVenda)}</TableCell>
                                        <TableCell>
                                            <Badge className={statusConfig[venda.status].color}>
                                                {statusConfig[venda.status].label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewVenda(venda);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Visualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteVenda(venda.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Deletar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Mostrando {vendas.length} de {totalVendas} vendas
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page === 1}
                                onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={filters.page === totalPages}
                                onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                )}

                {/* Dialogs */}
                <ViewVendaDialog
                    open={isViewOpen}
                    onOpenChange={setIsViewOpen}
                    venda={selectedVenda}
                    onEdit={() => {
                        toast.info('Função de edição em desenvolvimento');
                    }}
                    onDelete={() => {
                        setIsViewOpen(false);
                        if (selectedVenda) handleDeleteVenda(selectedVenda.id);
                    }}
                />

                {/* Dialog Definir Meta */}
                <Dialog open={isMetaDialogOpen} onOpenChange={setIsMetaDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {metaProgresso && metaProgresso.valorMeta > 0
                                    ? 'Editar Meta'
                                    : 'Definir Nova Meta'}
                            </DialogTitle>
                            <DialogDescription>
                                {metaProgresso && metaProgresso.valorMeta > 0
                                    ? 'Atualize o valor da meta existente'
                                    : 'Defina uma meta de vendas para o período'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="dialogMes">Mês</Label>
                                    <Select
                                        value={metaDialogMes.toString()}
                                        onValueChange={(value) => setMetaDialogMes(parseInt(value))}
                                    >
                                        <SelectTrigger id="dialogMes">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {meses.map((mes) => (
                                                <SelectItem key={mes.valor} value={mes.valor.toString()}>
                                                    {mes.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="dialogAno">Ano</Label>
                                    <Select
                                        value={metaDialogAno.toString()}
                                        onValueChange={(value) => setMetaDialogAno(parseInt(value))}
                                    >
                                        <SelectTrigger id="dialogAno">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {anosDisponiveis.map((ano) => (
                                                <SelectItem key={ano} value={ano.toString()}>
                                                    {ano}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="metaValor">Valor da Meta (R$)</Label>
                                <Input
                                    id="metaValor"
                                    type="number"
                                    step="0.01"
                                    placeholder="1000000.00"
                                    value={metaValor}
                                    onChange={(e) => setMetaValor(e.target.value)}
                                />
                                {metaProgresso && metaProgresso.valorMeta > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Meta atual: {formatCurrency(metaProgresso.valorMeta)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsMetaDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleDefinirMeta}>
                                {metaProgresso && metaProgresso.valorMeta > 0
                                    ? 'Atualizar Meta'
                                    : 'Definir Meta'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

        </DashboardLayout>
    );
}