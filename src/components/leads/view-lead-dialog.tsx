// src/components/leads/view-lead-dialog.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Phone,
    Mail,
    User,
    Building2,
    DollarSign,
    Calendar,
    Clock,
    Edit,
    Trash2,
    Target,
    TrendingUp,
    Plus,
    CheckCircle2,
    MessageSquare,
    Loader2,
    Circle,
    Filter,
} from 'lucide-react';
import type { Lead } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { interactionsService } from '@/services/interactions.service';
import type { Interaction, InteractionType } from '@/types';
import { InteractionFeedbackDialog } from './interaction-feedback-dialog';
import { UseTemplateButton } from '../templates/use-templete-button';


interface ViewLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead | null;
    onEdit: () => void;
    onDelete: () => void;
    onConvertToSale?: () => void;
}

export function ViewLeadDialog({
    open,
    onOpenChange,
    lead,
    onEdit,
    onDelete,
    onConvertToSale
}: ViewLeadDialogProps) {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>([]);
    const [interactionTypes, setInteractionTypes] = useState<InteractionType[]>([]);
    const [isLoadingInteractions, setIsLoadingInteractions] = useState(false);
    const [isSavingInteraction, setIsSavingInteraction] = useState(false);

    const [showActivityForm, setShowActivityForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

    // Estados para o Feedback Dialog
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);

    const [newActivity, setNewActivity] = useState({
        typeId: '',
        description: '',
        scheduledAt: '',
        result: '',
    });

    useEffect(() => {
        if (open && lead) {
            loadInteractions();
            loadInteractionTypes();
        }
    }, [open, lead]);

    useEffect(() => {
        if (filterStatus === 'all') {
            setFilteredInteractions(interactions);
        } else if (filterStatus === 'pending') {
            setFilteredInteractions(interactions.filter(i => !i.isCompleted));
        } else {
            setFilteredInteractions(interactions.filter(i => i.isCompleted));
        }
    }, [interactions, filterStatus]);

    const loadInteractions = async () => {
        if (!lead) return;

        setIsLoadingInteractions(true);
        try {
            const data = await interactionsService.getByLead(lead.id);
            setInteractions(data);
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            toast.error('Erro ao carregar atividades');
        } finally {
            setIsLoadingInteractions(false);
        }
    };

    const loadInteractionTypes = async () => {
        try {
            const data = await interactionsService.getTypes();
            setInteractionTypes(data);
        } catch (error) {
            console.error('Erro ao carregar tipos de interação:', error);
        }
    };

    const handleSaveActivity = async () => {
        if (!lead || !newActivity.typeId || !newActivity.description) {
            toast.error('Preencha tipo e descrição da atividade');
            return;
        }

        setIsSavingInteraction(true);
        try {
            await interactionsService.create({
                leadId: lead.id,
                typeId: newActivity.typeId,
                description: newActivity.description,
                scheduledAt: newActivity.scheduledAt || undefined,
                result: newActivity.result || undefined,
            });

            toast.success('Atividade registrada com sucesso!');

            setNewActivity({ typeId: '', description: '', scheduledAt: '', result: '' });
            setShowActivityForm(false);
            await loadInteractions();
        } catch (error: any) {
            console.error('Erro ao salvar atividade:', error);
            toast.error(error.response?.data?.message || 'Erro ao salvar atividade');
        } finally {
            setIsSavingInteraction(false);
        }
    };

    const handleToggleComplete = async (interaction: Interaction) => {
        try {
            await interactionsService.update(interaction.id, {
                isCompleted: !interaction.isCompleted,
            });

            toast.success(
                interaction.isCompleted
                    ? 'Atividade marcada como pendente'
                    : 'Atividade concluída!'
            );

            await loadInteractions();
        } catch (error: any) {
            console.error('Erro ao atualizar atividade:', error);
            toast.error('Erro ao atualizar atividade');
        }
    };

    const handleOpenFeedback = (interaction: Interaction) => {
        if (interaction.isCompleted) {
            toast.info('Esta atividade já foi concluída');
            return;
        }

        setSelectedInteraction(interaction);
        setFeedbackDialogOpen(true);
    };

    const handleSaveFeedback = async (feedback: {
        result: string;
        isCompleted: boolean;
        nextActivity?: {
            typeId: string;
            description: string;
            scheduledAt?: string;
        };
    }) => {
        if (!selectedInteraction || !lead) return;

        try {
            await interactionsService.update(selectedInteraction.id, {
                result: feedback.result,
                isCompleted: true,
                scheduledAt: new Date().toISOString(),
            });

            toast.success('Atividade concluída com sucesso!');

            if (feedback.nextActivity) {
                await interactionsService.create({
                    leadId: lead.id,
                    typeId: feedback.nextActivity.typeId,
                    description: feedback.nextActivity.description,
                    scheduledAt: feedback.nextActivity.scheduledAt,
                });

                toast.success('Próxima atividade criada!', {
                    description: 'A nova atividade foi adicionada ao histórico',
                });
            }

            await loadInteractions();

        } catch (error: any) {
            console.error('Erro ao salvar feedback:', error);
            toast.error('Erro ao salvar feedback');
            throw error;
        }
    };

    if (!lead) return null;

    const formatPhone = (phone: string) => {
        if (phone.length === 11) {
            return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
        }
        if (phone.length === 10) {
            return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
        }
        return phone;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (date: string) => {
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    const formatDateTime = (date: string) => {
        return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    };

    const getUrgenciaText = (urgencia?: string) => {
        const map: Record<string, string> = {
            IMEDIATO: 'Imediato',
            UM_MES: '1 Mês',
            TRES_MESES: '3 Meses',
            SEIS_MESES: '6 Meses',
            SEM_PRESSA: 'Sem Pressa',
        };
        return urgencia ? map[urgencia] : '-';
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'text-green-600 bg-green-100';
        if (score >= 50) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const pendingCount = interactions.filter(i => !i.isCompleted).length;
    const completedCount = interactions.filter(i => i.isCompleted).length;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="!max-w-[90vw] !w-[1200px] !max-h-[85vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <User className="h-6 w-6" />
                            {lead.name}
                        </DialogTitle>
                        <DialogDescription>
                            Detalhes completos do lead e histórico de atividades
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Status e Score */}
                        <div className="flex items-center gap-4">
                            <Badge
                                style={{ backgroundColor: lead.status.color, color: 'white' }}
                                className="text-base px-4 py-1"
                            >
                                {lead.status.displayName}
                            </Badge>

                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreColor(lead.score)}`}>
                                <TrendingUp className="h-4 w-4" />
                                <span className="font-medium">Score: {lead.score}</span>
                            </div>

                            {lead.source && (
                                <Badge variant="outline" className="text-sm">
                                    {lead.source.displayName}
                                </Badge>
                            )}
                        </div>

                        <Separator />

                        {/* Contato */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Contato
                            </h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatPhone(lead.phone)}</span>
                                </div>
                                {lead.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{lead.email}</span>
                                    </div>
                                )}
                                {lead.cpf && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>CPF: {lead.cpf}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Dados Pessoais */}
                        {(lead.profissao || lead.rendaFamiliar) && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />
                                        Dados Pessoais
                                    </h3>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {lead.profissao && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Profissão</p>
                                                <p className="font-medium">{lead.profissao}</p>
                                            </div>
                                        )}
                                        {lead.rendaFamiliar && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Renda Familiar</p>
                                                <p className="font-medium">{formatCurrency(lead.rendaFamiliar)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* FGTS */}
                        {lead.hasFgts !== undefined && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        FGTS
                                    </h3>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tem FGTS?</p>
                                            <p className="font-medium">{lead.hasFgts ? 'Sim' : 'Não'}</p>
                                        </div>
                                        {lead.hasFgts && lead.tempoFgts && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Tempo FGTS</p>
                                                <p className="font-medium">{lead.tempoFgts} meses</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Interesse */}
                        {lead.interesseEmpreendimento && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Interesse
                                    </h3>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Empreendimento</p>
                                        <p className="font-medium">{lead.interesseEmpreendimento.name}</p>
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* SEÇÃO DE ATIVIDADES */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Atividades & Interações
                                    </h3>
                                    {interactions.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <Badge variant="outline" className="gap-1">
                                                <Circle className="h-2 w-2 fill-yellow-500 text-yellow-500" />
                                                {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
                                            </Badge>
                                            <Badge variant="outline" className="gap-1">
                                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                                {completedCount} concluída{completedCount !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowActivityForm(!showActivityForm)}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Nova Atividade
                                </Button>
                            </div>

                            {/* Formulário de nova atividade */}
                            {showActivityForm && (
                                <div className="bg-muted/50 p-4 rounded-lg space-y-3 mb-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="activity-type">Tipo *</Label>
                                            <Select
                                                value={newActivity.typeId}
                                                onValueChange={(value) =>
                                                    setNewActivity(prev => ({ ...prev, typeId: value }))
                                                }
                                                disabled={isSavingInteraction}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {interactionTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.displayName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="scheduled-at">Próxima Ação</Label>
                                            <Input
                                                id="scheduled-at"
                                                type="datetime-local"
                                                value={newActivity.scheduledAt}
                                                onChange={(e) =>
                                                    setNewActivity(prev => ({ ...prev, scheduledAt: e.target.value }))
                                                }
                                                disabled={isSavingInteraction}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="description">Descrição *</Label>
                                            {/* 👇 BOTÃO DE TEMPLATES AQUI! */}
                                            <UseTemplateButton
                                                lead={lead}
                                                size="sm"
                                                variant="ghost"
                                                onUseTemplate={(content) => {
                                                    setNewActivity(prev => ({
                                                        ...prev,
                                                        description: content
                                                    }));
                                                    toast.success('Template aplicado!');
                                                }}
                                            />
                                        </div>
                                        <Textarea
                                            id="description"
                                            placeholder="Descreva o que aconteceu nesta interação..."
                                            rows={4}
                                            value={newActivity.description}
                                            onChange={(e) =>
                                                setNewActivity(prev => ({ ...prev, description: e.target.value }))
                                            }
                                            disabled={isSavingInteraction}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="result">Resultado</Label>
                                        <Select
                                            value={newActivity.result}
                                            onValueChange={(value) =>
                                                setNewActivity(prev => ({ ...prev, result: value }))
                                            }
                                            disabled={isSavingInteraction}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sucesso">Sucesso</SelectItem>
                                                <SelectItem value="sem_resposta">Sem Resposta</SelectItem>
                                                <SelectItem value="reagendar">Reagendar</SelectItem>
                                                <SelectItem value="nao_interessado">Não Interessado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setShowActivityForm(false);
                                                setNewActivity({ typeId: '', description: '', scheduledAt: '', result: '' });
                                            }}
                                            disabled={isSavingInteraction}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSaveActivity}
                                            disabled={isSavingInteraction}
                                        >
                                            {isSavingInteraction && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Salvar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Filtros */}
                            {interactions.length > 0 && (
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant={filterStatus === 'all' ? 'default' : 'ghost'}
                                            onClick={() => setFilterStatus('all')}
                                            className="h-7 text-xs"
                                        >
                                            Todas
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={filterStatus === 'pending' ? 'default' : 'ghost'}
                                            onClick={() => setFilterStatus('pending')}
                                            className="h-7 text-xs"
                                        >
                                            Pendentes
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={filterStatus === 'completed' ? 'default' : 'ghost'}
                                            onClick={() => setFilterStatus('completed')}
                                            className="h-7 text-xs"
                                        >
                                            Concluídas
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Timeline de atividades */}
                            {isLoadingInteractions ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredInteractions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>
                                        {filterStatus === 'all'
                                            ? 'Nenhuma atividade registrada'
                                            : filterStatus === 'pending'
                                                ? 'Nenhuma atividade pendente'
                                                : 'Nenhuma atividade concluída'}
                                    </p>
                                    <p className="text-sm">
                                        {filterStatus === 'all' && 'Clique em "Nova Atividade" para começar'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredInteractions.map((interaction) => (
                                        <div
                                            key={interaction.id}
                                            className={`border rounded-lg p-4 space-y-2 transition-all ${interaction.isCompleted
                                                ? 'bg-green-50/50 border-green-200'
                                                : 'bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer'
                                                }`}
                                            onClick={() => !interaction.isCompleted && handleOpenFeedback(interaction)}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Checkbox
                                                        checked={interaction.isCompleted}
                                                        onCheckedChange={() => handleToggleComplete(interaction)}
                                                        className="mt-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />

                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Badge variant="outline">
                                                                {interaction.type.displayName}
                                                            </Badge>

                                                            {interaction.isCompleted ? (
                                                                <Badge className="bg-green-600">
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                    Concluída
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary" className="gap-1">
                                                                    <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                                    Pendente - Clique para concluir
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {interaction.description && (
                                                            <p className={`text-sm ${interaction.isCompleted
                                                                ? 'text-muted-foreground'
                                                                : ''
                                                                }`}>
                                                                {interaction.description}
                                                            </p>
                                                        )}

                                                        {interaction.result && (
                                                            <div className="bg-green-100 border border-green-200 rounded p-2 text-sm">
                                                                <p className="font-medium text-green-900">Resultado:</p>
                                                                <p className="text-green-800 whitespace-pre-wrap">{interaction.result}</p>
                                                            </div>
                                                        )}

                                                        {interaction.scheduledAt && !interaction.completedAt && (
                                                            <div className="text-xs text-blue-600 flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                Agendado: {formatDateTime(interaction.scheduledAt)}
                                                            </div>
                                                        )}

                                                        {interaction.completedAt && (
                                                            <div className="text-xs text-green-600 flex items-center gap-1">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Concluída em: {formatDateTime(interaction.completedAt)}
                                                            </div>
                                                        )}

                                                        {interaction.user && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Por: {interaction.user.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {formatDateTime(interaction.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Acompanhamento */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Acompanhamento
                            </h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {lead.urgencia && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Urgência</p>
                                        <p className="font-medium">{getUrgenciaText(lead.urgencia)}</p>
                                    </div>
                                )}
                                {lead.ultimaInteracao && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Última Interação</p>
                                        <p className="font-medium">{formatDate(lead.ultimaInteracao)}</p>
                                    </div>
                                )}
                                {lead.proximaAcao && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Próxima Ação</p>
                                        <p className="font-medium">{formatDate(lead.proximaAcao)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {(lead.user || lead.team) && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Responsável
                                    </h3>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {lead.user && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Corretor</p>
                                                <p className="font-medium">{lead.user.name}</p>
                                            </div>
                                        )}
                                        {lead.team && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Equipe</p>
                                                <p className="font-medium">{lead.team.name}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {lead.observacoes && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-3">Observações</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {lead.observacoes}
                                    </p>
                                </div>
                            </>
                        )}

                        {lead.tags && lead.tags.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {lead.tags.map((item) => (
                                            <Badge
                                                key={item.tag.id}
                                                style={{ backgroundColor: item.tag.color, color: 'white' }}
                                            >
                                                {item.tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator />

                        <div className="text-xs text-muted-foreground">
                            <p>Criado em: {formatDate(lead.createdAt)}</p>
                            <p>Atualizado em: {formatDate(lead.updatedAt)}</p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex justify-between pt-4 border-t">
                            {/* Botão Converter em Venda */}
                            {onConvertToSale && lead.status.name !== 'won' && (
                                <Button
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={onConvertToSale}
                                >
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Converter em Venda
                                </Button>
                            )}

                            {/* Botões Editar e Deletar */}
                            <div className="flex gap-2 ml-auto">
                                <Button variant="outline" onClick={onDelete}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Deletar
                                </Button>
                                <Button onClick={onEdit}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialog de Feedback */}
            <InteractionFeedbackDialog
                open={feedbackDialogOpen}
                onOpenChange={setFeedbackDialogOpen}
                interaction={selectedInteraction}
                interactionTypes={interactionTypes}
                onSave={handleSaveFeedback}
            />
        </>
    );
}