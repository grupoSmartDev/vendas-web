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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Building2, MapPin, DollarSign, Home, FileText, Image, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { empreendimentosService } from '@/services/empreendimentos.service';
import type { Empreendimento, TipoImovel, StatusEmpreendimento } from '@/types';

const empreendimentoSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    construtora: z.string().optional(),
    endereco: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional(),
    valorMin: z.string().optional(),
    valorMax: z.string().optional(),
    entradaMin: z.string().optional(),
    rendaIdealMin: z.string().optional(),
    rendaIdealMax: z.string().optional(),
    tipo: z.string().optional(),
    statusEmpreendimento: z.string().optional(),
    quartosMin: z.string().optional(),
    quartosMax: z.string().optional(),
    vagas: z.boolean().optional(),
    vagasMin: z.string().optional(),
    vagasMax: z.string().optional(),
    metragemMin: z.string().optional(),
    metragemMax: z.string().optional(),
    descricao: z.string().optional(),
    diferenciais: z.string().optional(),
    plantaUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    tourVirtualUrl: z.string().optional(),
    disponivel: z.boolean().optional(),
    unidadesTotais: z.string().optional(),
    unidadesDisponiveis: z.string().optional(),
    previsaoEntrega: z.string().optional(),
    dataLancamento: z.string().optional(),
    destaque: z.boolean().optional(),
});

type EmpreendimentoFormData = z.infer<typeof empreendimentoSchema>;

interface CreateEmpreendimentoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    empreendimento?: Empreendimento | null;
}

export function CreateEmpreendimentoDialog({
    open,
    onOpenChange,
    onSuccess,
    empreendimento,
}: CreateEmpreendimentoDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!empreendimento;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<EmpreendimentoFormData>({
        resolver: zodResolver(empreendimentoSchema),
    });

    useEffect(() => {
        if (empreendimento && open) {
            setValue('name', empreendimento.name);
            setValue('construtora', empreendimento.construtora || '');
            setValue('endereco', empreendimento.endereco || '');
            setValue('bairro', empreendimento.bairro || '');
            setValue('cidade', empreendimento.cidade || '');
            setValue('estado', empreendimento.estado || '');
            setValue('cep', empreendimento.cep || '');
            setValue('valorMin', empreendimento.valorMin?.toString() || '');
            setValue('valorMax', empreendimento.valorMax?.toString() || '');
            setValue('entradaMin', empreendimento.entradaMin?.toString() || '');
            setValue('rendaIdealMin', empreendimento.rendaIdealMin?.toString() || '');
            setValue('rendaIdealMax', empreendimento.rendaIdealMax?.toString() || '');
            setValue('tipo', empreendimento.tipo || '');
            setValue('statusEmpreendimento', empreendimento.statusEmpreendimento || '');
            setValue('quartosMin', empreendimento.quartosMin?.toString() || '');
            setValue('quartosMax', empreendimento.quartosMax?.toString() || '');
            setValue('vagas', empreendimento.vagas || false);
            setValue('vagasMin', empreendimento.vagasMin?.toString() || '');
            setValue('vagasMax', empreendimento.vagasMax?.toString() || '');
            setValue('metragemMin', empreendimento.metragemMin?.toString() || '');
            setValue('metragemMax', empreendimento.metragemMax?.toString() || '');
            setValue('descricao', empreendimento.descricao || '');
            setValue('diferenciais', empreendimento.diferenciais?.join('\n') || '');
            setValue('plantaUrl', empreendimento.plantaUrl || '');
            setValue('videoUrl', empreendimento.videoUrl || '');
            setValue('tourVirtualUrl', empreendimento.tourVirtualUrl || '');
            setValue('disponivel', empreendimento.disponivel);
            setValue('unidadesTotais', empreendimento.unidadesTotais?.toString() || '');
            setValue('unidadesDisponiveis', empreendimento.unidadesDisponiveis?.toString() || '');
            setValue('previsaoEntrega', empreendimento.previsaoEntrega || '');
            setValue('dataLancamento', empreendimento.dataLancamento || '');
            setValue('destaque', empreendimento.destaque);
        } else if (!empreendimento && open) {
            reset();
        }
    }, [empreendimento, open, setValue, reset]);

    const onSubmit = async (data: EmpreendimentoFormData) => {
        try {
            setIsLoading(true);

            const empreendimentoData: any = {
                name: data.name,
                construtora: data.construtora || undefined,
                endereco: data.endereco || undefined,
                bairro: data.bairro || undefined,
                cidade: data.cidade || undefined,
                estado: data.estado || undefined,
                cep: data.cep || undefined,
                valorMin: data.valorMin ? parseFloat(data.valorMin) : undefined,
                valorMax: data.valorMax ? parseFloat(data.valorMax) : undefined,
                entradaMin: data.entradaMin ? parseFloat(data.entradaMin) : undefined,
                rendaIdealMin: data.rendaIdealMin ? parseFloat(data.rendaIdealMin) : undefined,
                rendaIdealMax: data.rendaIdealMax ? parseFloat(data.rendaIdealMax) : undefined,
                tipo: data.tipo || undefined,
                statusEmpreendimento: data.statusEmpreendimento || undefined,
                quartosMin: data.quartosMin ? parseInt(data.quartosMin) : undefined,
                quartosMax: data.quartosMax ? parseInt(data.quartosMax) : undefined,
                vagas: data.vagas,
                vagasMin: data.vagasMin ? parseInt(data.vagasMin) : undefined,
                vagasMax: data.vagasMax ? parseInt(data.vagasMax) : undefined,
                metragemMin: data.metragemMin ? parseFloat(data.metragemMin) : undefined,
                metragemMax: data.metragemMax ? parseFloat(data.metragemMax) : undefined,
                descricao: data.descricao || undefined,
                diferenciais: data.diferenciais
                    ? data.diferenciais.split('\n').filter(d => d.trim())
                    : undefined,
                plantaUrl: data.plantaUrl || undefined,
                videoUrl: data.videoUrl || undefined,
                tourVirtualUrl: data.tourVirtualUrl || undefined,
                disponivel: data.disponivel !== undefined ? data.disponivel : true,
                unidadesTotais: data.unidadesTotais ? parseInt(data.unidadesTotais) : undefined,
                unidadesDisponiveis: data.unidadesDisponiveis ? parseInt(data.unidadesDisponiveis) : undefined,
                previsaoEntrega: data.previsaoEntrega || undefined,
                dataLancamento: data.dataLancamento || undefined,
                destaque: data.destaque || false,
            };

            if (isEditing) {
                await empreendimentosService.update(empreendimento.id, empreendimentoData);
                toast.success('Empreendimento atualizado com sucesso!');
            } else {
                await empreendimentosService.create(empreendimentoData);
                toast.success('Empreendimento criado com sucesso!');
            }

            onSuccess();
            onOpenChange(false);
            reset();
        } catch (error: any) {
            console.error('Erro ao salvar empreendimento:', error);
            const message = error.response?.data?.message || 'Erro ao salvar empreendimento';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[90vw] !w-[1200px] !max-h-[85vh] overflow-y-auto p-6">

                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {isEditing ? 'Editar Empreendimento' : 'Novo Empreendimento'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize as informações do empreendimento'
                            : 'Preencha os dados do novo empreendimento'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Tabs defaultValue="basico" className="w-full">
                        <TabsList className="grid w-full grid-cols-7">
                            <TabsTrigger value="basico">
                                <Building2 className="h-4 w-4 mr-1" />
                                Básico
                            </TabsTrigger>
                            <TabsTrigger value="localizacao">
                                <MapPin className="h-4 w-4 mr-1" />
                                Local
                            </TabsTrigger>
                            <TabsTrigger value="valores">
                                <DollarSign className="h-4 w-4 mr-1" />
                                Valores
                            </TabsTrigger>
                            <TabsTrigger value="caracteristicas">
                                <Home className="h-4 w-4 mr-1" />
                                Caract.
                            </TabsTrigger>
                            <TabsTrigger value="descricao">
                                <FileText className="h-4 w-4 mr-1" />
                                Descrição
                            </TabsTrigger>
                            <TabsTrigger value="midias">
                                <Image className="h-4 w-4 mr-1" />
                                Mídias
                            </TabsTrigger>
                            <TabsTrigger value="disponibilidade">
                                <Calendar className="h-4 w-4 mr-1" />
                                Dispon.
                            </TabsTrigger>
                        </TabsList>

                        {/* ABA 1: BÁSICO */}
                        <TabsContent value="basico" className="space-y-4 mt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Nome do Empreendimento *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Residencial Vista Verde"
                                        {...register('name')}
                                        disabled={isLoading}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="construtora">Construtora</Label>
                                    <Input
                                        id="construtora"
                                        placeholder="Nome da construtora"
                                        {...register('construtora')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo do Imóvel</Label>
                                    <Select
                                        value={watch('tipo')}
                                        onValueChange={(value) => setValue('tipo', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                                            <SelectItem value="CASA">Casa</SelectItem>
                                            <SelectItem value="CASA_CONDOMINIO">Casa em Condomínio</SelectItem>
                                            <SelectItem value="SOBRADO">Sobrado</SelectItem>
                                            <SelectItem value="TERRENO">Terreno</SelectItem>
                                            <SelectItem value="COMERCIAL">Comercial</SelectItem>
                                            <SelectItem value="RURAL">Rural</SelectItem>
                                            <SelectItem value="KITNET">Kitnet</SelectItem>
                                            <SelectItem value="LOFT">Loft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="statusEmpreendimento">Status</Label>
                                    <Select
                                        value={watch('statusEmpreendimento')}
                                        onValueChange={(value) => setValue('statusEmpreendimento', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LANCAMENTO">Lançamento</SelectItem>
                                            <SelectItem value="EM_OBRAS">Em Obras</SelectItem>
                                            <SelectItem value="PRONTO_MORAR">Pronto para Morar</SelectItem>
                                            <SelectItem value="ENTREGUE">Entregue</SelectItem>
                                            <SelectItem value="ESGOTADO">Esgotado</SelectItem>
                                            <SelectItem value="SUSPENSO">Suspenso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="disponivel"
                                        checked={watch('disponivel')}
                                        onCheckedChange={(checked) => setValue('disponivel', checked as boolean)}
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="disponivel" className="cursor-pointer">
                                        Disponível para venda
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="destaque"
                                        checked={watch('destaque')}
                                        onCheckedChange={(checked) => setValue('destaque', checked as boolean)}
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="destaque" className="cursor-pointer">
                                        Empreendimento em destaque
                                    </Label>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ABA 2: LOCALIZAÇÃO */}
                        <TabsContent value="localizacao" className="space-y-4 mt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="endereco">Endereço</Label>
                                    <Input
                                        id="endereco"
                                        placeholder="Rua, número"
                                        {...register('endereco')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bairro">Bairro</Label>
                                    <Input
                                        id="bairro"
                                        {...register('bairro')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cidade">Cidade</Label>
                                    <Input
                                        id="cidade"
                                        {...register('cidade')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Input
                                        id="estado"
                                        placeholder="SP"
                                        maxLength={2}
                                        {...register('estado')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cep">CEP</Label>
                                    <Input
                                        id="cep"
                                        placeholder="00000-000"
                                        {...register('cep')}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* ABA 3: VALORES */}
                        <TabsContent value="valores" className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-3">Valores do Imóvel</h3>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="valorMin">Valor Mínimo (R$)</Label>
                                            <Input
                                                id="valorMin"
                                                type="number"
                                                step="0.01"
                                                placeholder="250000"
                                                {...register('valorMin')}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="valorMax">Valor Máximo (R$)</Label>
                                            <Input
                                                id="valorMax"
                                                type="number"
                                                step="0.01"
                                                placeholder="350000"
                                                {...register('valorMax')}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="entradaMin">Entrada Mínima (R$)</Label>
                                            <Input
                                                id="entradaMin"
                                                type="number"
                                                step="0.01"
                                                placeholder="25000"
                                                {...register('entradaMin')}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <span className="text-blue-600">💡</span>
                                        Renda Ideal do Cliente (para Match Inteligente)
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="rendaIdealMin">Renda Mínima (R$)</Label>
                                            <Input
                                                id="rendaIdealMin"
                                                type="number"
                                                step="0.01"
                                                placeholder="3500"
                                                {...register('rendaIdealMin')}
                                                disabled={isLoading}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Renda familiar mínima recomendada
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="rendaIdealMax">Renda Máxima (R$)</Label>
                                            <Input
                                                id="rendaIdealMax"
                                                type="number"
                                                step="0.01"
                                                placeholder="8000"
                                                {...register('rendaIdealMax')}
                                                disabled={isLoading}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Renda familiar máxima ideal
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ABA 4: CARACTERÍSTICAS */}
                        <TabsContent value="caracteristicas" className="space-y-4 mt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="quartosMin">Quartos Mínimo</Label>
                                    <Input
                                        id="quartosMin"
                                        type="number"
                                        placeholder="2"
                                        {...register('quartosMin')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quartosMax">Quartos Máximo</Label>
                                    <Input
                                        id="quartosMax"
                                        type="number"
                                        placeholder="3"
                                        {...register('quartosMax')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vagasMin">Vagas Mínimo</Label>
                                    <Input
                                        id="vagasMin"
                                        type="number"
                                        placeholder="1"
                                        {...register('vagasMin')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vagasMax">Vagas Máximo</Label>
                                    <Input
                                        id="vagasMax"
                                        type="number"
                                        placeholder="2"
                                        {...register('vagasMax')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metragemMin">Metragem Mínima (m²)</Label>
                                    <Input
                                        id="metragemMin"
                                        type="number"
                                        step="0.01"
                                        placeholder="45"
                                        {...register('metragemMin')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metragemMax">Metragem Máxima (m²)</Label>
                                    <Input
                                        id="metragemMax"
                                        type="number"
                                        step="0.01"
                                        placeholder="80"
                                        {...register('metragemMax')}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* ABA 5: DESCRIÇÃO */}
                        <TabsContent value="descricao" className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="descricao">Descrição do Empreendimento</Label>
                                    <Textarea
                                        id="descricao"
                                        rows={5}
                                        placeholder="Descreva o empreendimento, área de lazer, localização privilegiada..."
                                        {...register('descricao')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="diferenciais">Diferenciais (um por linha)</Label>
                                    <Textarea
                                        id="diferenciais"
                                        rows={6}
                                        placeholder="Piscina adulto e infantil&#10;Academia completa&#10;Salão de festas&#10;Playground&#10;Portaria 24h&#10;Acabamento de alto padrão"
                                        {...register('diferenciais')}
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Digite cada diferencial em uma linha
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* ABA 6: MÍDIAS */}
                        <TabsContent value="midias" className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="plantaUrl">URL da Planta</Label>
                                    <Input
                                        id="plantaUrl"
                                        type="url"
                                        placeholder="https://..."
                                        {...register('plantaUrl')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="videoUrl">URL do Vídeo</Label>
                                    <Input
                                        id="videoUrl"
                                        type="url"
                                        placeholder="https://youtube.com/..."
                                        {...register('videoUrl')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tourVirtualUrl">URL do Tour Virtual 360°</Label>
                                    <Input
                                        id="tourVirtualUrl"
                                        type="url"
                                        placeholder="https://..."
                                        {...register('tourVirtualUrl')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    💡 Dica: Upload de fotos será implementado em breve. Por enquanto, use URLs.
                                </p>
                            </div>
                        </TabsContent>

                        {/* ABA 7: DISPONIBILIDADE */}
                        <TabsContent value="disponibilidade" className="space-y-4 mt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="unidadesTotais">Total de Unidades</Label>
                                    <Input
                                        id="unidadesTotais"
                                        type="number"
                                        placeholder="120"
                                        {...register('unidadesTotais')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unidadesDisponiveis">Unidades Disponíveis</Label>
                                    <Input
                                        id="unidadesDisponiveis"
                                        type="number"
                                        placeholder="85"
                                        {...register('unidadesDisponiveis')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dataLancamento">Data de Lançamento</Label>
                                    <Input
                                        id="dataLancamento"
                                        type="date"
                                        {...register('dataLancamento')}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="previsaoEntrega">Previsão de Entrega</Label>
                                    <Input
                                        id="previsaoEntrega"
                                        type="date"
                                        {...register('previsaoEntrega')}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Ações */}
                    <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
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
                            {isEditing ? 'Atualizar' : 'Criar Empreendimento'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}