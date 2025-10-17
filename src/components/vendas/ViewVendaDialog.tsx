// src/components/vendas/ViewVendaDialog.tsx
'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    DollarSign,
    Calendar,
    User,
    Building2,
    Phone,
    Mail,
    FileText,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Venda, VendaStatus } from '@/types/index';

interface ViewVendaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    venda: Venda | null;
    onEdit: () => void;
    onDelete: () => void;
}

const statusConfig: Record<
    VendaStatus,
    { label: string; color: string; icon: any }
> = {
    PENDENTE: {
        label: 'Pendente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
    },
    APROVADO: {
        label: 'Aprovado',
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircle2,
    },
    CONTRATO_ASSINADO: {
        label: 'Contrato Assinado',
        color: 'bg-purple-100 text-purple-800',
        icon: FileText,
    },
    CONCLUIDO: {
        label: 'Concluído',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle2,
    },
    CANCELADO: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
    },
};

export function ViewVendaDialog({
    open,
    onOpenChange,
    venda,
    onEdit,
    onDelete,
}: ViewVendaDialogProps) {
    if (!venda) return null;

    const formatCurrency = (value?: number) => {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (date?: string) => {
        if (!date) return '-';
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    };

    const StatusIcon = statusConfig[venda.status].icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[90vw] !w-[1200px] !max-h-[85vh] overflow-y-auto p-6">

                <DialogHeader className="flex-shrink-0 border-b pb-2">
                    <DialogTitle className="flex items-center justify-between">
                        <span>Detalhes da Venda</span>
                        <Badge className={statusConfig[venda.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[venda.status].label}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>ID: {venda.id}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* CLIENTE */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Cliente
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Nome</p>
                                <p className="font-medium">{venda.lead?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> Telefone
                                </p>
                                <p className="font-medium">{venda.lead?.phone}</p>
                            </div>
                            {venda.lead?.email && (
                                <div>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <Mail className="h-3 w-3" /> Email
                                    </p>
                                    <p className="font-medium">{venda.lead.email}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* EMPREENDIMENTO */}
                    {venda.empreendimento && (
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Empreendimento
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{venda.empreendimento.name}</p>
                                {venda.empreendimento.cidade && (
                                    <p className="text-sm text-gray-600">
                                        {venda.empreendimento.cidade}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* VALORES */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Valores
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Valor do Imóvel</p>
                                <p className="text-xl font-bold text-blue-700">
                                    {formatCurrency(venda.valorImovel)}
                                </p>
                            </div>

                            {venda.subsidio > 0 && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Subsídio</p>
                                    <p className="text-xl font-bold text-green-700">
                                        {formatCurrency(venda.subsidio)}
                                    </p>
                                </div>
                            )}

                            {venda.entrada > 0 && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Entrada</p>
                                    <p className="text-xl font-bold text-purple-700">
                                        {formatCurrency(venda.entrada)}
                                    </p>
                                </div>
                            )}

                            {venda.valorFinanciado && (
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Valor Financiado</p>
                                    <p className="text-xl font-bold text-orange-700">
                                        {formatCurrency(venda.valorFinanciado)}
                                    </p>
                                </div>
                            )}

                            {venda.parcelaMensal && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Parcela Mensal</p>
                                    <p className="text-xl font-bold">
                                        {formatCurrency(venda.parcelaMensal)}
                                    </p>
                                    {venda.prazoMeses && (
                                        <p className="text-xs text-gray-500">
                                            {venda.prazoMeses} meses
                                        </p>
                                    )}
                                </div>
                            )}

                            {venda.taxaJuros && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Taxa de Juros</p>
                                    <p className="text-xl font-bold">{venda.taxaJuros}% a.a.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COMISSÃO */}
                    {venda.comissaoValor && (
                        <div>
                            <h3 className="font-semibold mb-3">Comissão</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Valor da Comissão</p>
                                    <p className="text-xl font-bold text-yellow-700">
                                        {formatCurrency(venda.comissaoValor)}
                                    </p>
                                    {venda.comissaoPercentual && (
                                        <p className="text-xs text-gray-500">
                                            {venda.comissaoPercentual}% do valor
                                        </p>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Status Pagamento</p>
                                    <Badge
                                        className={
                                            venda.comissaoPaga
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }
                                    >
                                        {venda.comissaoPaga ? 'Pago' : 'Pendente'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* DATAS */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Datas
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Data da Venda</p>
                                <p className="font-medium">{formatDate(venda.dataVenda)}</p>
                            </div>
                            {venda.dataAprovacaoCredito && (
                                <div>
                                    <p className="text-sm text-gray-600">Aprovação Crédito</p>
                                    <p className="font-medium">
                                        {formatDate(venda.dataAprovacaoCredito)}
                                    </p>
                                </div>
                            )}
                            {venda.dataAssinaturaContrato && (
                                <div>
                                    <p className="text-sm text-gray-600">Assinatura Contrato</p>
                                    <p className="font-medium">
                                        {formatDate(venda.dataAssinaturaContrato)}
                                    </p>
                                </div>
                            )}
                            {venda.previsaoEntregaChaves && (
                                <div>
                                    <p className="text-sm text-gray-600">Previsão Entrega</p>
                                    <p className="font-medium">
                                        {formatDate(venda.previsaoEntregaChaves)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OBSERVAÇÕES */}
                    {venda.observacoes && (
                        <div>
                            <h3 className="font-semibold mb-2">Observações</h3>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                                {venda.observacoes}
                            </p>
                        </div>
                    )}

                    {/* RESPONSÁVEL */}
                    {venda.user && (
                        <div>
                            <h3 className="font-semibold mb-2">Responsável</h3>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium">{venda.user.name}</p>
                                <p className="text-sm text-gray-600">{venda.user.email}</p>
                            </div>
                        </div>
                    )}

                    {/* BOTÕES */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                                if (confirm('Tem certeza que deseja deletar esta venda?')) {
                                    onDelete();
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deletar
                        </Button>
                        <Button onClick={onEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}