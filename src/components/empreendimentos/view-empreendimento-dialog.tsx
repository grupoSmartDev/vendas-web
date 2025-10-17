'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Building2,
    MapPin,
    DollarSign,
    Home,
    Calendar,
    Edit,
    Trash2,
    Users,
    TrendingUp,
    Loader2,
    CheckCircle2,
    Star,
    Phone,
    Mail,
} from 'lucide-react';
import type { Empreendimento } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { empreendimentosService } from '@/services/empreendimentos.service';
import { toast } from 'sonner';

interface ViewEmpreendimentoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    empreendimento: Empreendimento | null;
    onEdit: () => void;
    onDelete: () => void;
}

export function ViewEmpreendimentoDialog({
    open,
    onOpenChange,
    empreendimento,
    onEdit,
    onDelete,
}: ViewEmpreendimentoDialogProps) {
    const [compatibleLeads, setCompatibleLeads] = useState<any>(null);
    const [isLoadingLeads, setIsLoadingLeads] = useState(false);

    useEffect(() => {
        if (open && empreendimento) {
            loadCompatibleLeads();
        }
    }, [open, empreendimento]);

    const loadCompatibleLeads = async () => {
        if (!empreendimento) return;

        setIsLoadingLeads(true);
        try {
            const data = await empreendimentosService.getCompatibleLeads(empreendimento.id);
            setCompatibleLeads(data);
        } catch (error) {
            console.error('Erro ao carregar leads compatíveis:', error);
        } finally {
            setIsLoadingLeads(false);
        }
    };

    if (!empreendimento) return null;

    const formatCurrency = (value?: number) => {
        if (!value) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (date?: string) => {
        if (!date) return '-';
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    const getTipoLabel = (tipo?: string) => {
        const map: Record<string, string> = {
            APARTAMENTO: 'Apartamento',
            CASA: 'Casa',
            CASA_CONDOMINIO: 'Casa em Condomínio',
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
            PRONTO_MORAR: 'Pronto para Morar',
            ENTREGUE: 'Entregue',
            ESGOTADO: 'Esgotado',
            SUSPENSO: 'Suspenso',
        };
        return status ? map[status] || status : '-';
    };

    const getStatusColor = (status?: string) => {
        const map: Record<string, string> = {
            LANCAMENTO: 'bg-blue-500',
            EM_OBRAS: 'bg-yellow-500',
            PRONTO_MORAR: 'bg-green-500',
            ENTREGUE: 'bg-gray-500',
            ESGOTADO: 'bg-red-500',
            SUSPENSO: 'bg-orange-500',
        };
        return status ? map[status] || 'bg-gray-500' : 'bg-gray-500';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[90vw] !w-[1200px] !max-h-[85vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        {empreendimento.name}
                        {empreendimento.destaque && (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Detalhes completos do empreendimento
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="info">Informações</TabsTrigger>
                        <TabsTrigger value="caracteristicas">Características</TabsTrigger>
                        <TabsTrigger value="leads">
                            Leads Compatíveis
                            {compatibleLeads?.totalCompatible > 0 && (
                                <Badge className="ml-2" variant="secondary">
                                    {compatibleLeads.totalCompatible}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* ABA 1: INFORMAÇÕES */}
                    <TabsContent value="info" className="space-y-6 mt-4">
                        {/* Status e Tipo */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Badge
                                className={`${getStatusColor(empreendimento.statusEmpreendimento)} text-white`}
                            >
                                {getStatusLabel(empreendimento.statusEmpreendimento)}
                            </Badge>
                            <Badge variant="outline">{getTipoLabel(empreendimento.tipo)}</Badge>
                            {empreendimento.disponivel ? (
                                <Badge className="bg-green-600">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Disponível
                                </Badge>
                            ) : (
                                <Badge variant="secondary">Indisponível</Badge>
                            )}
                        </div>

                        <Separator />

                        {/* Construtora */}
                        {empreendimento.construtora && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-2">Construtora</h3>
                                    <p className="text-muted-foreground">{empreendimento.construtora}</p>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Localização */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Localização
                            </h3>
                            <div className="space-y-1 text-sm">
                                {empreendimento.endereco && <p>{empreendimento.endereco}</p>}
                                <p>
                                    {empreendimento.bairro && `${empreendimento.bairro}, `}
                                    {empreendimento.cidade && `${empreendimento.cidade} - `}
                                    {empreendimento.estado}
                                </p>
                                {empreendimento.cep && <p>CEP: {empreendimento.cep}</p>}
                            </div>
                        </div>

                        <Separator />

                        {/* Valores */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Valores
                            </h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {empreendimento.valorMin && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Valor Mínimo</p>
                                        <p className="font-medium text-lg">
                                            {formatCurrency(empreendimento.valorMin)}
                                        </p>
                                    </div>
                                )}
                                {empreendimento.valorMax && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Valor Máximo</p>
                                        <p className="font-medium text-lg">
                                            {formatCurrency(empreendimento.valorMax)}
                                        </p>
                                    </div>
                                )}
                                {empreendimento.entradaMin && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Entrada Mínima</p>
                                        <p className="font-medium">
                                            {formatCurrency(empreendimento.entradaMin)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Renda Ideal */}
                        {(empreendimento.rendaIdealMin || empreendimento.rendaIdealMax) && (
                            <>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        Renda Ideal do Cliente
                                    </h3>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {empreendimento.rendaIdealMin && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Renda Mínima</p>
                                                <p className="font-medium text-lg">
                                                    {formatCurrency(empreendimento.rendaIdealMin)}
                                                </p>
                                            </div>
                                        )}
                                        {empreendimento.rendaIdealMax && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Renda Máxima</p>
                                                <p className="font-medium text-lg">
                                                    {formatCurrency(empreendimento.rendaIdealMax)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Descrição */}
                        {empreendimento.descricao && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3">Descrição</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {empreendimento.descricao}
                                    </p>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Diferenciais */}
                        {empreendimento.diferenciais && empreendimento.diferenciais.length > 0 && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3">Diferenciais</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {empreendimento.diferenciais.map((diff, index) => (
                                            <li key={index}>{diff}</li>
                                        ))}
                                    </ul>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Datas */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Datas
                            </h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {empreendimento.dataLancamento && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lançamento</p>
                                        <p className="font-medium">
                                            {formatDate(empreendimento.dataLancamento)}
                                        </p>
                                    </div>
                                )}
                                {empreendimento.previsaoEntrega && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Previsão de Entrega</p>
                                        <p className="font-medium">
                                            {formatDate(empreendimento.previsaoEntrega)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ABA 2: CARACTERÍSTICAS */}
                    <TabsContent value="caracteristicas" className="space-y-6 mt-4">
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Home className="h-5 w-5" />
                                Características
                            </h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                {empreendimento.quartosMin && (
                                    <div className="border rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Quartos</p>
                                        <p className="font-medium text-lg">
                                            {empreendimento.quartosMin}
                                            {empreendimento.quartosMax &&
                                                empreendimento.quartosMax !== empreendimento.quartosMin &&
                                                ` a ${empreendimento.quartosMax}`}
                                        </p>
                                    </div>
                                )}
                                {(empreendimento.vagasMin || empreendimento.vagas) && (
                                    <div className="border rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Vagas</p>
                                        <p className="font-medium text-lg">
                                            {empreendimento.vagasMin || 'Sim'}
                                            {empreendimento.vagasMax &&
                                                empreendimento.vagasMax !== empreendimento.vagasMin &&
                                                ` a ${empreendimento.vagasMax}`}
                                        </p>
                                    </div>
                                )}
                                {empreendimento.metragemMin && (
                                    <div className="border rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Metragem</p>
                                        <p className="font-medium text-lg">
                                            {empreendimento.metragemMin}m²
                                            {empreendimento.metragemMax &&
                                                empreendimento.metragemMax !== empreendimento.metragemMin &&
                                                ` a ${empreendimento.metragemMax}m²`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Disponibilidade</h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                {empreendimento.unidadesTotais && (
                                    <div className="border rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Total de Unidades</p>
                                        <p className="font-medium text-lg">
                                            {empreendimento.unidadesTotais}
                                        </p>
                                    </div>
                                )}
                                <div className="border rounded-lg p-3">
                                    <p className="text-sm text-muted-foreground">Vendidas</p>
                                    <p className="font-medium text-lg">
                                        {empreendimento.unidadesVendidas}
                                    </p>
                                </div>
                                {empreendimento.unidadesDisponiveis !== undefined && (
                                    <div className="border rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground">Disponíveis</p>
                                        <p className="font-medium text-lg text-green-600">
                                            {empreendimento.unidadesDisponiveis}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Links */}
                        {(empreendimento.plantaUrl ||
                            empreendimento.videoUrl ||
                            empreendimento.tourVirtualUrl) && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-3">Links e Mídias</h3>
                                        <div className="space-y-2">
                                            {empreendimento.plantaUrl && (
                                                <a
                                                    href={empreendimento.plantaUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline block"
                                                >
                                                    📄 Ver Planta
                                                </a>
                                            )}
                                            {empreendimento.videoUrl && (
                                                <a
                                                    href={empreendimento.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline block"
                                                >
                                                    🎥 Assistir Vídeo
                                                </a>
                                            )}
                                            {empreendimento.tourVirtualUrl && (
                                                <a
                                                    href={empreendimento.tourVirtualUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline block"
                                                >
                                                    🏠 Tour Virtual 360°
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                    </TabsContent>

                    {/* ABA 3: LEADS COMPATÍVEIS (MATCH INTELIGENTE!) */}
                    <TabsContent value="leads" className="space-y-6 mt-4">
                        {isLoadingLeads ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : compatibleLeads ? (
                            <>
                                {compatibleLeads.message ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>{compatibleLeads.message}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                                Match Inteligente
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Encontramos{' '}
                                                <span className="font-bold text-blue-600">
                                                    {compatibleLeads.totalCompatible} lead
                                                    {compatibleLeads.totalCompatible !== 1 ? 's' : ''}
                                                </span>{' '}
                                                com renda entre{' '}
                                                {formatCurrency(compatibleLeads.rendaRange.min)} e{' '}
                                                {formatCurrency(compatibleLeads.rendaRange.max)}
                                            </p>
                                        </div>

                                        {compatibleLeads.leads.length > 0 ? (
                                            <div className="space-y-3">
                                                {compatibleLeads.leads.map((lead: any) => (
                                                    <div
                                                        key={lead.id}
                                                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-medium">{lead.name}</h4>
                                                                    <Badge
                                                                        style={{
                                                                            backgroundColor: lead.status.color,
                                                                            color: 'white',
                                                                        }}
                                                                    >
                                                                        {lead.status.displayName}
                                                                    </Badge>
                                                                </div>
                                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                                    <div className="flex items-center gap-2">
                                                                        <Phone className="h-3 w-3" />
                                                                        {lead.phone}
                                                                    </div>
                                                                    {lead.rendaFamiliar && (
                                                                        <div className="flex items-center gap-2">
                                                                            <TrendingUp className="h-3 w-3 text-green-600" />
                                                                            Renda:{' '}
                                                                            {formatCurrency(parseFloat(lead.rendaFamiliar))}
                                                                        </div>
                                                                    )}
                                                                    {lead.user && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Users className="h-3 w-3" />
                                                                            Corretor: {lead.user.name}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Button size="sm" variant="outline">
                                                                Ver Lead
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>Nenhum lead compatível encontrado</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        ) : null}
                    </TabsContent>
                </Tabs>

                <Separator />

                {/* Metadados */}
                <div className="text-xs text-muted-foreground">
                    <p>Criado em: {formatDate(empreendimento.createdAt)}</p>
                    <p>Atualizado em: {formatDate(empreendimento.updatedAt)}</p>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (confirm('Tem certeza que deseja deletar este empreendimento?')) {
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
            </DialogContent>
        </Dialog>
    );
}