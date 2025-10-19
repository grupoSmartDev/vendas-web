// src/components/leads/interaction-feedback-dialog.tsx
'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle2,
    Clock,
    Loader2,
    ArrowRight,
    Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Interaction, InteractionType } from '@/types';

interface InteractionFeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    interaction: Interaction | null;
    interactionTypes: InteractionType[];
    onSave: (feedback: {
        result: string;
        isCompleted: boolean;
        nextActivity?: {
            typeId: string;
            description: string;
            scheduledAt?: string;
        };
    }) => Promise<void>;
}

export function InteractionFeedbackDialog({
    open,
    onOpenChange,
    interaction,
    interactionTypes,
    onSave,
}: InteractionFeedbackDialogProps) {
    const [feedback, setFeedback] = useState('');
    const [createNext, setCreateNext] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Campos da próxima atividade
    const [nextTypeId, setNextTypeId] = useState('');
    const [nextDescription, setNextDescription] = useState('');
    const [nextScheduledAt, setNextScheduledAt] = useState('');

    const resetForm = () => {
        setFeedback('');
        setCreateNext(false);
        setNextTypeId('');
        setNextDescription('');
        setNextScheduledAt('');
    };

    const handleSave = async () => {
        if (!feedback.trim()) {
            alert('Por favor, descreva o resultado da atividade');
            return;
        }

        if (createNext && (!nextTypeId || !nextDescription.trim())) {
            alert('Preencha os dados da próxima atividade');
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                result: feedback,
                isCompleted: true,
                nextActivity: createNext
                    ? {
                        typeId: nextTypeId,
                        description: nextDescription,
                        scheduledAt: nextScheduledAt || undefined,
                    }
                    : undefined,
            });

            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.error('Erro ao salvar feedback:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDateTime = (date: string) => {
        return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    };

    if (!interaction) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Concluir Atividade
                    </DialogTitle>
                    <DialogDescription>
                        Registre o resultado desta atividade e planeje os próximos passos
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Info da Atividade Atual */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-sm">
                                {interaction.type.displayName}
                            </Badge>
                            {interaction.scheduledAt && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Agendado: {formatDateTime(interaction.scheduledAt)}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Descrição original:
                            </p>
                            <p className="text-sm mt-1">{interaction.description || 'Sem descrição'}</p>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Criado em: {formatDateTime(interaction.createdAt)}
                            {interaction.user && ` • Por: ${interaction.user.name}`}
                        </div>
                    </div>

                    <Separator />

                    {/* Feedback / Resultado */}
                    <div className="space-y-2">
                        <Label htmlFor="feedback" className="text-base font-semibold">
                            O que aconteceu? *
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                (Descreva o resultado desta atividade)
                            </span>
                        </Label>
                        <Textarea
                            id="feedback"
                            placeholder="Ex: Mandei a simulação por WhatsApp. Cliente gostou dos valores e demonstrou interesse em conhecer o empreendimento pessoalmente."
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            disabled={isSaving}
                            className="resize-none"
                        />
                    </div>

                    <Separator />

                    {/* Criar Próxima Atividade */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="create-next"
                                checked={createNext}
                                onCheckedChange={(checked) => setCreateNext(checked as boolean)}
                                disabled={isSaving}
                            />
                            <Label
                                htmlFor="create-next"
                                className="text-base font-semibold cursor-pointer flex items-center gap-2"
                            >
                                <ArrowRight className="h-4 w-4" />
                                Criar próxima atividade
                            </Label>
                        </div>

                        {createNext && (
                            <div className="ml-6 space-y-4 p-4 border rounded-lg bg-background">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="next-type">Tipo *</Label>
                                        <Select
                                            value={nextTypeId}
                                            onValueChange={setNextTypeId}
                                            disabled={isSaving}
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
                                        <Label htmlFor="next-scheduled" className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Agendar para
                                        </Label>
                                        <Input
                                            id="next-scheduled"
                                            type="datetime-local"
                                            value={nextScheduledAt}
                                            onChange={(e) => setNextScheduledAt(e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="next-description">Descrição *</Label>
                                    <Textarea
                                        id="next-description"
                                        placeholder="Ex: Agendar visita ao empreendimento no sábado pela manhã"
                                        rows={3}
                                        value={nextDescription}
                                        onChange={(e) => setNextDescription(e.target.value)}
                                        disabled={isSaving}
                                        className="resize-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            resetForm();
                            onOpenChange(false);
                        }}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {createNext ? 'Concluir e Criar Próxima' : 'Concluir Atividade'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}