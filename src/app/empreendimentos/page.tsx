'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Home,
    TrendingUp,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { EmpreendimentosTable } from '@/components/empreendimentos/empreendimentos-table';
import { CreateEmpreendimentoDialog } from '@/components/empreendimentos/create-empreendimento-dialog';
import { ViewEmpreendimentoDialog } from '@/components/empreendimentos/view-empreendimento-dialog';
import { empreendimentosService } from '@/services/empreendimentos.service';
import type { Empreendimento, TipoImovel, StatusEmpreendimento } from '@/types';
import { DashboardLayout } from '@/components/layout';

export default function EmpreendimentosPage() {
    const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // Estados dos modais
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedEmpreendimento, setSelectedEmpreendimento] = useState<Empreendimento | null>(null);

    // Filtros
    const [search, setSearch] = useState('');
    const [cidade, setCidade] = useState('');
    const [tipo, setTipo] = useState<TipoImovel | ''>('');
    const [statusEmpreendimento, setStatusEmpreendimento] = useState<StatusEmpreendimento | ''>('');
    const [disponivel, setDisponivel] = useState<boolean | undefined>(undefined);

    // Paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadEmpreendimentos();
        loadStats();
    }, [page, search, cidade, tipo, statusEmpreendimento, disponivel]);

    const loadEmpreendimentos = async () => {
        try {
            setIsLoading(true);
            const data = await empreendimentosService.getAll({
                search: search || undefined,
                cidade: cidade || undefined,
                tipo: tipo || undefined,
                statusEmpreendimento: statusEmpreendimento || undefined,
                disponivel: disponivel,
                page,
                limit: 10,
            });

            setEmpreendimentos(data.data);
            setTotalPages(data.meta.totalPages);
            setTotal(data.meta.total);
        } catch (error) {
            console.error('Erro ao carregar empreendimentos:', error);
            toast.error('Erro ao carregar empreendimentos');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            setIsLoadingStats(true);
            const data = await empreendimentosService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const handleCreate = () => {
        setSelectedEmpreendimento(null);
        setCreateDialogOpen(true);
    };

    const handleEdit = (empreendimento: Empreendimento) => {
        setSelectedEmpreendimento(empreendimento);
        setViewDialogOpen(false);
        setCreateDialogOpen(true);
    };

    const handleView = (empreendimento: Empreendimento) => {
        setSelectedEmpreendimento(empreendimento);
        setViewDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await empreendimentosService.delete(id);
            toast.success('Empreendimento deletado com sucesso!');
            loadEmpreendimentos();
            loadStats();
            setViewDialogOpen(false);
        } catch (error) {
            console.error('Erro ao deletar empreendimento:', error);
            toast.error('Erro ao deletar empreendimento');
        }
    };

    const handleSuccess = () => {
        loadEmpreendimentos();
        loadStats();
    };

    const clearFilters = () => {
        setSearch('');
        setCidade('');
        setTipo('');
        setStatusEmpreendimento('');
        setDisponivel(undefined);
        setPage(1);
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Building2 className="h-8 w-8" />
                            Empreendimentos
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gerencie seus empreendimentos e encontre leads compatíveis
                        </p>
                    </div>
                    <Button onClick={handleCreate} size="lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Novo Empreendimento
                    </Button>
                </div>

                {/* Estatísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoadingStats ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                            )}
                            <p className="text-xs text-muted-foreground">empreendimentos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            {isLoadingStats ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <div className="text-2xl font-bold text-green-600">
                                    {stats?.disponiveis || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">para venda</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Esgotados</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            {isLoadingStats ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <div className="text-2xl font-bold text-red-600">
                                    {stats?.esgotados || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">totalmente vendidos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Em Destaque</CardTitle>
                            <TrendingUp className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            {isLoadingStats ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <div className="text-2xl font-bold text-yellow-600">
                                    {empreendimentos.filter((e) => e.destaque).length}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">destaques</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-6">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nome..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(1);
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <Input
                                placeholder="Cidade"
                                value={cidade}
                                onChange={(e) => {
                                    setCidade(e.target.value);
                                    setPage(1);
                                }}
                            />

                            <Select
                                value={tipo}
                                onValueChange={(value) => {
                                    setTipo(value as TipoImovel);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">Todos os tipos</SelectItem>
                                    <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                                    <SelectItem value="CASA">Casa</SelectItem>
                                    <SelectItem value="CASA_CONDOMINIO">Casa Condomínio</SelectItem>
                                    <SelectItem value="SOBRADO">Sobrado</SelectItem>
                                    <SelectItem value="TERRENO">Terreno</SelectItem>
                                    <SelectItem value="COMERCIAL">Comercial</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={statusEmpreendimento}
                                onValueChange={(value) => {
                                    setStatusEmpreendimento(value as StatusEmpreendimento);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=" ">Todos os status</SelectItem>
                                    <SelectItem value="LANCAMENTO">Lançamento</SelectItem>
                                    <SelectItem value="EM_OBRAS">Em Obras</SelectItem>
                                    <SelectItem value="PRONTO_MORAR">Pronto</SelectItem>
                                    <SelectItem value="ENTREGUE">Entregue</SelectItem>
                                    <SelectItem value="ESGOTADO">Esgotado</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" onClick={clearFilters}>
                                Limpar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela */}
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                    <>
                        <EmpreendimentosTable
                            empreendimentos={empreendimentos}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {empreendimentos.length} de {total} empreendimentos
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="text-sm">
                                        Página {page} de {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Modais */}
                <CreateEmpreendimentoDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    onSuccess={handleSuccess}
                    empreendimento={selectedEmpreendimento}
                />

                <ViewEmpreendimentoDialog
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    empreendimento={selectedEmpreendimento}
                    onEdit={() => handleEdit(selectedEmpreendimento!)}
                    onDelete={() => handleDelete(selectedEmpreendimento!.id)}
                />
            </div>

        </DashboardLayout>
    );
}