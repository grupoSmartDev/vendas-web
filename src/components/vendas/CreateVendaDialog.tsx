// src/components/vendas/CreateVendaDialog.tsx
'use client';

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
import { Loader2, DollarSign, Calendar, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { vendasService } from '@/services/vendas.service';
import type { Lead } from '@/types';
import type { CreateVendaData } from '@/types/index';

/**
 * Schema de validação
 */
const vendaSchema = z.object({
    valorImovel: z.string().min(1, 'Valor do imóvel é obrigatório'),
    subsidio: z.string().optional(),
    entrada: z.string().optional(),
    valorFinanciado: z.string().optional(),
    parcelaMensal: z.string().optional(),
    prazoMeses: z.string().optional(),
    taxaJuros: z.string().optional(),
    comissaoPercentual: z.string().optional(),
    comissaoValor: z.string().optional(),
    dataVenda: z.string().min(1, 'Data da venda é obrigatória'),
    dataAprovacaoCredito: z.string().optional(),
    dataAssinaturaContrato: z.string().optional(),
    previsaoEntregaChaves: z.string().optional(),
    observacoes: z.string().optional(),
});

type VendaFormData = z.infer<typeof vendaSchema>;

interface CreateVendaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead;
    onSuccess: () => void;
}

export function CreateVendaDialog({
    open,
    onOpenChange,
    lead,
    onSuccess,
}: CreateVendaDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [comissaoCalculada, setComissaoCalculada] = useState<number>(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<VendaFormData>({
        resolver: zodResolver(vendaSchema),
        defaultValues: {
            dataVenda: new Date().toISOString().split('T')[0],
        },
    });

    // Watch valores para calcular comissão
    const valorImovel = watch('valorImovel');
    const comissaoPercentual = watch('comissaoPercentual');

    // Calcular comissão automaticamente
    useEffect(() => {
        if (valorImovel && comissaoPercentual) {
            const valor = parseFloat(valorImovel) || 0;
            const percentual = parseFloat(comissaoPercentual) || 0;
            const calculada = (valor * percentual) / 100;
            setComissaoCalculada(calculada);
            setValue('comissaoValor', calculada.toFixed(2));
        }
    }, [valorImovel, comissaoPercentual, setValue]);

    const onSubmit = async (formData: VendaFormData) => {
        try {
            setIsLoading(true);

            const vendaData: CreateVendaData = {
                leadId: lead.id,
                empreendimentoId: lead.interesseEmpreendimento?.id,
                valorImovel: parseFloat(formData.valorImovel),
                subsidio: formData.subsidio ? parseFloat(formData.subsidio) : undefined,
                entrada: formData.entrada ? parseFloat(formData.entrada) : undefined,
                valorFinanciado: formData.valorFinanciado
                    ? parseFloat(formData.valorFinanciado)
                    : undefined,
                parcelaMensal: formData.parcelaMensal
                    ? parseFloat(formData.parcelaMensal)
                    : undefined,
                prazoMeses: formData.prazoMeses ? parseInt(formData.prazoMeses) : undefined,
                taxaJuros: formData.taxaJuros ? parseFloat(formData.taxaJuros) : undefined,
                comissaoPercentual: formData.comissaoPercentual
                    ? parseFloat(formData.comissaoPercentual)
                    : undefined,
                comissaoValor: formData.comissaoValor
                    ? parseFloat(formData.comissaoValor)
                    : undefined,
                dataVenda: formData.dataVenda,
                dataAprovacaoCredito: formData.dataAprovacaoCredito || undefined,
                dataAssinaturaContrato: formData.dataAssinaturaContrato || undefined,
                previsaoEntregaChaves: formData.previsaoEntregaChaves || undefined,
                observacoes: formData.observacoes || undefined,
            };

            await vendasService.create(vendaData);
            toast.success('Venda registrada com sucesso! 🎉');
            reset();
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Erro ao criar venda:', error);
            toast.error(error.response?.data?.message || 'Erro ao registrar venda');
        } finally {
            setIsLoading(false);
        }
    };

    // Formatar valor em moeda
    const formatCurrency = (value: string) => {
        const numero = parseFloat(value) || 0;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numero);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar Venda</DialogTitle>
                    <DialogDescription>
                        Cliente: <strong>{lead.name}</strong> | Telefone: <strong>{lead.phone}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* VALORES */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Valores da Venda
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="valorImovel">
                                    Valor do Imóvel <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="valorImovel"
                                    type="number"
                                    step="0.01"
                                    placeholder="350000.00"
                                    {...register('valorImovel')}
                                />
                                {errors.valorImovel && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.valorImovel.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="subsidio">Subsídio</Label>
                                <Input
                                    id="subsidio"
                                    type="number"
                                    step="0.01"
                                    placeholder="50000.00"
                                    {...register('subsidio')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="entrada">Entrada</Label>
                                <Input
                                    id="entrada"
                                    type="number"
                                    step="0.01"
                                    placeholder="70000.00"
                                    {...register('entrada')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="valorFinanciado">Valor Financiado</Label>
                                <Input
                                    id="valorFinanciado"
                                    type="number"
                                    step="0.01"
                                    placeholder="230000.00"
                                    {...register('valorFinanciado')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="parcelaMensal">Parcela Mensal</Label>
                                <Input
                                    id="parcelaMensal"
                                    type="number"
                                    step="0.01"
                                    placeholder="1800.00"
                                    {...register('parcelaMensal')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="prazoMeses">Prazo (meses)</Label>
                                <Input
                                    id="prazoMeses"
                                    type="number"
                                    placeholder="360"
                                    {...register('prazoMeses')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="taxaJuros">Taxa de Juros (%)</Label>
                                <Input
                                    id="taxaJuros"
                                    type="number"
                                    step="0.01"
                                    placeholder="8.5"
                                    {...register('taxaJuros')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* COMISSÃO */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Comissão
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="comissaoPercentual">Percentual (%)</Label>
                                <Input
                                    id="comissaoPercentual"
                                    type="number"
                                    step="0.01"
                                    placeholder="5.0"
                                    {...register('comissaoPercentual')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="comissaoValor">Valor da Comissão</Label>
                                <Input
                                    id="comissaoValor"
                                    type="number"
                                    step="0.01"
                                    placeholder="17500.00"
                                    {...register('comissaoValor')}
                                />
                                {comissaoCalculada > 0 && (
                                    <p className="text-sm text-green-600 mt-1">
                                        Calculado: {formatCurrency(comissaoCalculada.toString())}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DATAS */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Datas
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dataVenda">
                                    Data da Venda <span className="text-red-500">*</span>
                                </Label>
                                <Input id="dataVenda" type="date" {...register('dataVenda')} />
                                {errors.dataVenda && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.dataVenda.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="dataAprovacaoCredito">Aprovação Crédito</Label>
                                <Input
                                    id="dataAprovacaoCredito"
                                    type="date"
                                    {...register('dataAprovacaoCredito')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="dataAssinaturaContrato">Assinatura Contrato</Label>
                                <Input
                                    id="dataAssinaturaContrato"
                                    type="date"
                                    {...register('dataAssinaturaContrato')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="previsaoEntregaChaves">Previsão Entrega</Label>
                                <Input
                                    id="previsaoEntregaChaves"
                                    type="date"
                                    {...register('previsaoEntregaChaves')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* OBSERVAÇÕES */}
                    <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            placeholder="Informações adicionais sobre a venda..."
                            rows={4}
                            {...register('observacoes')}
                        />
                    </div>

                    {/* BOTÕES */}
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
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                'Registrar Venda'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}