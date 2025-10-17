'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    MapPin,
    Home,
    TrendingUp,
    Users,
    Star,
} from 'lucide-react';
import type { Empreendimento } from '@/types';

interface EmpreendimentosTableProps {
    empreendimentos: Empreendimento[];
    onView: (empreendimento: Empreendimento) => void;
    onEdit: (empreendimento: Empreendimento) => void;
    onDelete: (id: string) => void;
}

export function EmpreendimentosTable({
    empreendimentos,
    onView,
    onEdit,
    onDelete,
}: EmpreendimentosTableProps) {
    const formatCurrency = (value?: number) => {
        if (!value) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getTipoLabel = (tipo?: string) => {
        const map: Record<string, string> = {
            APARTAMENTO: 'Apartamento',
            CASA: 'Casa',
            CASA_CONDOMINIO: 'Casa Cond.',
            SOBRADO: 'Sobrado',
            TERRENO: 'Terreno',
            COMERCIAL: 'Comercial',
            RURAL: 'Rural',
            KITNET: 'Kitnet',
            LOFT: 'Loft',
        };
        return tipo ? map[tipo] || tipo : '-';
    };

    const getStatusLabel = (status?: string) => {
        const map: Record<string, string> = {
            LANCAMENTO: 'Lançamento',
            EM_OBRAS: 'Em Obras',
            PRONTO_MORAR: 'Pronto',
            ENTREGUE: 'Entregue',
            ESGOTADO: 'Esgotado',
            SUSPENSO: 'Suspenso',
        };
        return status ? map[status] || status : '-';
    };

    const getStatusColor = (status?: string) => {
        const map: Record<string, string> = {
            LANCAMENTO: 'bg-blue-100 text-blue-800',
            EM_OBRAS: 'bg-yellow-100 text-yellow-800',
            PRONTO_MORAR: 'bg-green-100 text-green-800',
            ENTREGUE: 'bg-gray-100 text-gray-800',
            ESGOTADO: 'bg-red-100 text-red-800',
            SUSPENSO: 'bg-orange-100 text-orange-800',
        };
        return status ? map[status] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
    };

    if (empreendimentos.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">Nenhum empreendimento encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Crie seu primeiro empreendimento para começar
                </p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Empreendimento</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valores</TableHead>
                        <TableHead>Renda Ideal</TableHead>
                        <TableHead className="text-center">Unidades</TableHead>
                        <TableHead className="text-center">Leads</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {empreendimentos.map((emp) => (
                        <TableRow key={emp.id}>
                            <TableCell>
                                <div className="flex items-start gap-2">
                                    {emp.destaque && (
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <div className="font-medium">{emp.name}</div>
                                        {emp.construtora && (
                                            <div className="text-sm text-muted-foreground">
                                                {emp.construtora}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    {emp.cidade || '-'}
                                    {emp.bairro && (
                                        <span className="text-muted-foreground">
                                            , {emp.bairro}
                                        </span>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge variant="outline">
                                    {getTipoLabel(emp.tipo)}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <Badge className={getStatusColor(emp.statusEmpreendimento)}>
                                    {getStatusLabel(emp.statusEmpreendimento)}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="text-sm">
                                    {emp.valorMin && emp.valorMax ? (
                                        <>
                                            <div className="font-medium">
                                                {formatCurrency(emp.valorMin)}
                                            </div>
                                            <div className="text-muted-foreground">
                                                até {formatCurrency(emp.valorMax)}
                                            </div>
                                        </>
                                    ) : emp.valorMin ? (
                                        <div className="font-medium">
                                            A partir de {formatCurrency(emp.valorMin)}
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                {emp.rendaIdealMin || emp.rendaIdealMax ? (
                                    <div className="text-sm flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-blue-600" />
                                        <div>
                                            {emp.rendaIdealMin && formatCurrency(emp.rendaIdealMin)}
                                            {emp.rendaIdealMin && emp.rendaIdealMax && ' - '}
                                            {emp.rendaIdealMax && formatCurrency(emp.rendaIdealMax)}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Não definida</span>
                                )}
                            </TableCell>

                            <TableCell className="text-center">
                                {emp.unidadesTotais ? (
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {emp.unidadesDisponiveis || 0}/{emp.unidadesTotais}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            disponíveis
                                        </div>
                                    </div>
                                ) : (
                                    '-'
                                )}
                            </TableCell>

                            <TableCell className="text-center">
                                {emp._count?.leadsInteressados ? (
                                    <div className="flex items-center justify-center gap-1">
                                        <Users className="h-3 w-3 text-muted-foreground" />
                                        <span className="font-medium">
                                            {emp._count.leadsInteressados}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">0</span>
                                )}
                            </TableCell>

                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onView(emp)}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Ver Detalhes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(emp)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                if (confirm('Tem certeza que deseja deletar este empreendimento?')) {
                                                    onDelete(emp.id);
                                                }
                                            }}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Deletar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}