// src/app/(dashboard)/leads/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    TrendingUp,
    Clock,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    LayoutList,
    LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { toast } from 'sonner';
import { leadsService } from '@/services/lead.service';
import type { Lead, LeadStatus, LeadSource, LeadStats, LeadFilters } from '@/types';
import { CreateLeadDialog } from '@/components/leads/create-lead-dialog';
import { ViewLeadDialog } from '@/components/leads/view-lead-dialog';
import { KanbanBoard } from '@/components/leads/KanbanBoard';
import { DashboardLayout } from '@/components/layout';
import { CreateVendaDialog } from '@/components/vendas';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [statuses, setStatuses] = useState<LeadStatus[]>([]);
    const [sources, setSources] = useState<LeadSource[]>([]);
    const [stats, setStats] = useState<LeadStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [currentView, setCurrentView] = useState<'list' | 'kanban'>('list');
    const [isCreateVendaOpen, setIsCreateVendaOpen] = useState(false);

    // Filtros
    const [filters, setFilters] = useState<LeadFilters>({
        page: 1,
        limit: 50, // Aumentei para o Kanban carregar mais leads
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);

    // Carregar dados iniciais
    useEffect(() => {
        loadInitialData();
    }, []);

    // Carregar leads quando filtros mudarem
    useEffect(() => {
        loadLeads();
    }, [filters]);

    const loadInitialData = async () => {
        try {
            const [statusesData, sourcesData, statsData] = await Promise.all([
                leadsService.getStatuses(),
                leadsService.getSources(),
                leadsService.getStats(),
            ]);

            setStatuses(statusesData);
            setSources(sourcesData);
            setStats(statsData);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            toast.error('Erro ao carregar dados iniciais');
        }
    };

    const loadLeads = async () => {
        try {
            setIsLoading(true);
            const response = await leadsService.getAll(filters);

            setLeads(response.data);
            setTotalPages(response.meta.totalPages);
            setTotalLeads(response.meta.total);
        } catch (error) {
            console.error('Erro ao carregar leads:', error);
            toast.error('Erro ao carregar leads');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateOpen(false);
        loadLeads();
        loadInitialData(); // Recarregar stats
    };

    const handleViewLead = (lead: Lead) => {
        setSelectedLead(lead);
        setIsViewOpen(true);
    };

    const handleEditLead = (lead: Lead) => {
        setSelectedLead(lead);
        setIsViewOpen(false);
        setIsCreateOpen(true);
    };

    const handleDeleteLead = async (leadId: string) => {
        if (!confirm('Tem certeza que deseja deletar este lead?')) return;

        try {
            await leadsService.delete(leadId);
            toast.success('Lead deletado com sucesso!');
            loadLeads();
            loadInitialData();
        } catch (error) {
            console.error('Erro ao deletar lead:', error);
            toast.error('Erro ao deletar lead');
        }
    };

    const handleSearch = (search: string) => {
        setFilters({ ...filters, search, page: 1 });
    };

    const handleStatusFilter = (statusId: string) => {
        setFilters({
            ...filters,
            statusId: statusId === 'all' ? undefined : statusId,
            page: 1,
        });
    };

    const handleSourceFilter = (sourceId: string) => {
        setFilters({
            ...filters,
            sourceId: sourceId === 'all' ? undefined : sourceId,
            page: 1,
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-blue-100 text-blue-800';
        if (score >= 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                        <p className="text-muted-foreground">
                            Gerencie seus leads e acompanhe o pipeline de vendas
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Novo Lead
                    </Button>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Novos (7 dias)</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.last30Days || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats?.avgScore?.toFixed(1) || 0}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>

                            <div className="text-2xl font-bold">Colocar o total de leads pendentes</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs: Lista vs Kanban */}
                <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as 'list' | 'kanban')}>
                    <div className="flex items-center justify-between mb-4">
                        <TabsList>
                            <TabsTrigger value="list" className="gap-2">
                                <LayoutList className="h-4 w-4" />
                                Lista
                            </TabsTrigger>
                            <TabsTrigger value="kanban" className="gap-2">
                                <LayoutGrid className="h-4 w-4" />
                                Kanban
                            </TabsTrigger>
                        </TabsList>

                        {/* Filtros */}
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nome..."
                                    className="pl-10"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>

                            <Select onValueChange={handleStatusFilter} defaultValue="all">
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos status</SelectItem>
                                    {statuses.map((status) => (
                                        <SelectItem key={status.id} value={status.id}>
                                            {status.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={handleSourceFilter} defaultValue="all">
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Origem" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas origens</SelectItem>
                                    {sources.map((source) => (
                                        <SelectItem key={source.id} value={source.id}>
                                            {source.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* VIEW: LISTA */}
                    <TabsContent value="list" className="space-y-4">
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Contato</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Origem</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Responsável</TableHead>
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
                                                    <Skeleton className="h-6 w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-20" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-6 w-12" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-8 w-8 ml-auto" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : leads.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                Nenhum lead encontrado
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        leads.map((lead) => (
                                            <TableRow
                                                key={lead.id}
                                                className="cursor-pointer hover:bg-gray-50"
                                                onClick={() => handleViewLead(lead)}
                                            >
                                                <TableCell className="font-medium">{lead.name}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>{lead.phone}</div>
                                                        {lead.email && (
                                                            <div className="text-gray-500">{lead.email}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        style={{
                                                            backgroundColor: lead.status.color,
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {lead.status.displayName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {lead.source?.displayName || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getScoreColor(lead.score)}>
                                                        {lead.score}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{lead.user?.name || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewLead(lead);
                                                            }}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Visualizar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditLead(lead);
                                                            }}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteLead(lead.id);
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
                                    Mostrando {leads.length} de {totalLeads} leads
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={filters.page === 1}
                                        onClick={() =>
                                            setFilters({ ...filters, page: filters.page! - 1 })
                                        }
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={filters.page === totalPages}
                                        onClick={() =>
                                            setFilters({ ...filters, page: filters.page! + 1 })
                                        }
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* VIEW: KANBAN */}
                    <TabsContent value="kanban">
                        {isLoading ? (
                            <div className="flex gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex-shrink-0 w-80">
                                        <Skeleton className="h-[600px]" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <KanbanBoard
                                leads={leads}
                                statuses={statuses}
                                onLeadClick={handleViewLead}
                                onLeadsUpdate={loadLeads}
                            />
                        )}
                    </TabsContent>
                </Tabs>

                {/* Dialogs */}
                <CreateLeadDialog
                    open={isCreateOpen}
                    onOpenChange={setIsCreateOpen}
                    onSuccess={handleCreateSuccess}
                    lead={selectedLead}
                    statuses={statuses}
                    sources={sources}
                />

                <ViewLeadDialog
                    open={isViewOpen}
                    onOpenChange={setIsViewOpen}
                    lead={selectedLead}
                    onEdit={() => handleEditLead(selectedLead!)}
                    onDelete={() => {
                        setIsViewOpen(false);
                        if (selectedLead) handleDeleteLead(selectedLead.id);
                    }}
                    onConvertToSale={() => {  // 👈 ADICIONAR ESTE HANDLER
                        setIsViewOpen(false);
                        setIsCreateVendaOpen(true);
                    }}
                />
            </div>
            {selectedLead && (
                <CreateVendaDialog
                    open={isCreateVendaOpen}
                    onOpenChange={setIsCreateVendaOpen}
                    lead={selectedLead}
                    onSuccess={() => {
                        setIsCreateVendaOpen(false);
                        loadLeads(); // Recarregar leads
                        toast.success('Venda registrada! Lead convertido com sucesso! 🎉');
                    }}
                />
            )}
        </DashboardLayout>
    );
}