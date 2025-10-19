'use client';

// src/components/leads/create-lead-dialog.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Lead, LeadStatus, LeadSource, CreateLeadData, Empreendimento } from '@/types';
import { leadsService } from '@/services/lead.service';
import { empreendimentosService } from '@/services/empreendimentos.service'; // 🆕

/**
 * Schema de validação
 */
const leadSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    phone: z.string()
        .min(10, 'Telefone deve ter 10 ou 11 dígitos')
        .max(11, 'Telefone deve ter 10 ou 11 dígitos')
        .regex(/^[0-9]+$/, 'Apenas números'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    cpf: z.string().optional(),
    rendaFamiliar: z.string().optional(),
    profissao: z.string().optional(),
    statusId: z.string().optional(),
    sourceId: z.string().optional(),
    interesseEmpreendimentoId: z.string().optional(), // 🆕
    score: z.string().optional(),
    hasFgts: z.string().optional(),
    tempoFgts: z.string().optional(),
    urgencia: z.string().optional(),
    observacoes: z.string().optional(),
    proximaAcao: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface CreateLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    lead?: Lead | null;
    statuses: LeadStatus[];
    sources: LeadSource[];
}

export function CreateLeadDialog({
    open,
    onOpenChange,
    onSuccess,
    lead,
    statuses,
    sources,
}: CreateLeadDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]); // 🆕
    const [loadingEmpreendimentos, setLoadingEmpreendimentos] = useState(false); // 🆕
    const isEditing = !!lead;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
    });

    // 🆕 Carregar empreendimentos quando abrir o dialog
    useEffect(() => {
        if (open) {
            loadEmpreendimentos();
        }
    }, [open]);

    const loadEmpreendimentos = async () => {
        try {
            setLoadingEmpreendimentos(true);
            const data = await empreendimentosService.getAvailable();
            setEmpreendimentos(data);
            console.log('✅ Empreendimentos carregados:', data.length);
        } catch (error) {
            console.error('❌ Erro ao carregar empreendimentos:', error);
            toast.error('Erro ao carregar empreendimentos');
        } finally {
            setLoadingEmpreendimentos(false);
        }
    };

    /**
     * Preenche o form se estiver editando
     */
    useEffect(() => {
        if (lead && open) {
            setValue('name', lead.name);
            setValue('phone', lead.phone);
            setValue('email', lead.email || '');
            setValue('cpf', lead.cpf || '');
            setValue('rendaFamiliar', lead.rendaFamiliar?.toString() || '');
            setValue('profissao', lead.profissao || '');
            setValue('statusId', lead.statusId);
            setValue('sourceId', lead.sourceId || '');
            setValue('interesseEmpreendimentoId', lead.interesseEmpreendimentoId || ''); // 🆕
            setValue('score', lead.score.toString());
            setValue('hasFgts', lead.hasFgts ? 'true' : 'false');
            setValue('tempoFgts', lead.tempoFgts?.toString() || '');
            setValue('urgencia', lead.urgencia || '');
            setValue('observacoes', lead.observacoes || '');
            setValue('proximaAcao', lead.proximaAcao || '');
        } else if (!lead && open) {
            reset();
        }
    }, [lead, open, setValue, reset]);

    /**
     * Submete o formulário
     */
    const onSubmit = async (data: LeadFormData) => {
        try {
            setIsLoading(true);

            // Prepara os dados
            const leadData: CreateLeadData = {
                name: data.name,
                phone: data.phone,
                email: data.email || undefined,
                cpf: data.cpf || undefined,
                rendaFamiliar: data.rendaFamiliar ? parseFloat(data.rendaFamiliar) : undefined,
                profissao: data.profissao || undefined,
                statusId: data.statusId || undefined,
                sourceId: data.sourceId || undefined,
                interesseEmpreendimentoId: data.interesseEmpreendimentoId || undefined, // 🆕
                score: data.score ? parseInt(data.score) : undefined,
                hasFgts: data.hasFgts === 'true' ? true : data.hasFgts === 'false' ? false : undefined,
                tempoFgts: data.tempoFgts ? parseInt(data.tempoFgts) : undefined,
                urgencia: data.urgencia as any,
                observacoes: data.observacoes || undefined,
                proximaAcao: data.proximaAcao || undefined,
            };

            console.log('📤 Enviando lead:', leadData);

            if (isEditing) {
                await leadsService.update(lead.id, leadData);
                toast.success('Lead atualizado com sucesso!');
            } else {
                await leadsService.create(leadData);
                toast.success('Lead criado com sucesso!');
            }

            onSuccess();
            onOpenChange(false);
            reset();
        } catch (error: any) {
            console.error('Erro ao salvar lead:', error);
            const message = error.response?.data?.message || 'Erro ao salvar lead';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-[1400px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Lead' : 'Novo Lead'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize as informações do lead'
                            : 'Preencha os dados do novo lead'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Dados Básicos */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Dados Básicos</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome *</Label>
                                <Input
                                    id="name"
                                    {...register('name')}
                                    disabled={isLoading}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone *</Label>
                                <Input
                                    id="phone"
                                    placeholder="11999999999"
                                    {...register('phone')}
                                    disabled={isLoading}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    placeholder="00000000000"
                                    {...register('cpf')}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profissao">Profissão</Label>
                                <Input
                                    id="profissao"
                                    {...register('profissao')}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rendaFamiliar">Renda Familiar</Label>
                                <Input
                                    id="rendaFamiliar"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('rendaFamiliar')}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Classificação */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Classificação</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="statusId">Status</Label>
                                <Select
                                    value={watch('statusId')}
                                    onValueChange={(value) => setValue('statusId', value)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id}>
                                                {status.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sourceId">Origem</Label>
                                <Select
                                    value={watch('sourceId')}
                                    onValueChange={(value) => setValue('sourceId', value)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a origem" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sources.map((source) => (
                                            <SelectItem key={source.id} value={source.id}>
                                                {source.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="score">Score (0-100)</Label>
                                <Input
                                    id="score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="50"
                                    {...register('score')}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="urgencia">Urgência</Label>
                                <Select
                                    value={watch('urgencia')}
                                    onValueChange={(value) => setValue('urgencia', value)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IMEDIATO">Imediato</SelectItem>
                                        <SelectItem value="UM_MES">1 Mês</SelectItem>
                                        <SelectItem value="TRES_MESES">3 Meses</SelectItem>
                                        <SelectItem value="SEIS_MESES">6 Meses</SelectItem>
                                        <SelectItem value="SEM_PRESSA">Sem Pressa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* 🆕 NOVA SEÇÃO - Interesse */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Interesse</h3>

                        <div className="space-y-2">
                            <Label htmlFor="interesseEmpreendimentoId">
                                Empreendimento de Interesse
                            </Label>
                            <Select
                                value={watch('interesseEmpreendimentoId') || undefined} // ✅ Undefined ao invés de ""
                                onValueChange={(value) => setValue('interesseEmpreendimentoId', value)}
                                disabled={isLoading || loadingEmpreendimentos}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        loadingEmpreendimentos
                                            ? "Carregando..."
                                            : "Selecione um empreendimento (opcional)"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {empreendimentos.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.name} {emp.cidade && `- ${emp.cidade}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {empreendimentos.length === 0 && !loadingEmpreendimentos && (
                                <p className="text-xs text-muted-foreground">
                                    Nenhum empreendimento cadastrado
                                </p>
                            )}
                            {watch('interesseEmpreendimentoId') && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setValue('interesseEmpreendimentoId', '')}
                                    className="text-xs h-7"
                                >
                                    Limpar seleção
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* FGTS */}
                    <div className="space-y-4">
                        <h3 className="font-medium">FGTS</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="hasFgts">Tem FGTS?</Label>
                                <Select
                                    value={watch('hasFgts')}
                                    onValueChange={(value) => setValue('hasFgts', value)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Sim</SelectItem>
                                        <SelectItem value="false">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {watch('hasFgts') === 'true' && (
                                <div className="space-y-2">
                                    <Label htmlFor="tempoFgts">Tempo FGTS (meses)</Label>
                                    <Input
                                        id="tempoFgts"
                                        type="number"
                                        placeholder="24"
                                        {...register('tempoFgts')}
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observações */}
                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            rows={3}
                            placeholder="Anotações sobre o lead..."
                            {...register('observacoes')}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Follow-up */}
                    <div className="space-y-2">
                        <Label htmlFor="proximaAcao">Próxima Ação</Label>
                        <Input
                            id="proximaAcao"
                            type="datetime-local"
                            {...register('proximaAcao')}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Ações */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Atualizar' : 'Criar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}