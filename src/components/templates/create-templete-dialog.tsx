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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { messageTemplatesService } from '@/services/message-templates.service';
import type {
    MessageTemplate,
    MessageTemplateType,
    CreateMessageTemplateData,
} from '@/types/index';
import {
    MESSAGE_TEMPLATE_LABELS,
    MESSAGE_TEMPLATE_ICONS,
} from '@/types/index';

const templateSchema = z.object({
    type: z.string().min(1, 'Selecione uma categoria'),
    subtype: z.string().optional(),
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    subject: z.string().optional(),
    content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
    isPublic: z.boolean(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface CreateTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template?: MessageTemplate | null;
    onSuccess: () => void;
}

export function CreateTemplateDialog({
    open,
    onOpenChange,
    template,
    onSuccess,
}: CreateTemplateDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [detectedVariables, setDetectedVariables] = useState<string[]>([]);
    const isEditing = !!template;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TemplateFormData>({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            isPublic: false,
        },
    });

    const contentValue = watch('content');

    // Detecta variáveis no conteúdo
    useEffect(() => {
        if (contentValue) {
            const regex = /\{([^}]+)\}/g;
            const variables = new Set<string>();
            let match;

            while ((match = regex.exec(contentValue)) !== null) {
                variables.add(match[1]);
            }

            setDetectedVariables(Array.from(variables));
        } else {
            setDetectedVariables([]);
        }
    }, [contentValue]);

    // Preenche o form se estiver editando
    useEffect(() => {
        if (template && open) {
            setValue('type', template.type);
            setValue('subtype', template.subtype || '');
            setValue('name', template.name);
            setValue('subject', template.subject || '');
            setValue('content', template.content);
            setValue('isPublic', template.isPublic);
        } else if (!template && open) {
            reset({
                type: '',
                subtype: '',
                name: '',
                subject: '',
                content: '',
                isPublic: false,
            });
        }
    }, [template, open, setValue, reset]);

    const onSubmit = async (data: TemplateFormData) => {
        try {
            setIsLoading(true);

            const templateData: CreateMessageTemplateData = {
                type: data.type as MessageTemplateType,
                subtype: data.subtype || undefined,
                name: data.name,
                subject: data.subject || undefined,
                content: data.content,
                variables: detectedVariables,
                isPublic: data.isPublic,
            };

            if (isEditing) {
                await messageTemplatesService.update(template.id, templateData);
                toast.success('Template atualizado com sucesso!');
            } else {
                await messageTemplatesService.create(templateData);
                toast.success('Template criado com sucesso!');
            }

            onSuccess();
            reset();
        } catch (error: any) {
            console.error('Erro ao salvar template:', error);
            const message = error.response?.data?.message || 'Erro ao salvar template';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Template' : 'Novo Template'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize as informações do template'
                            : 'Crie um novo modelo de mensagem para agilizar seu atendimento'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Categoria */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Categoria *</Label>
                        <Select
                            value={watch('type')}
                            onValueChange={(value) => setValue('type', value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(MESSAGE_TEMPLATE_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        <span className="flex items-center gap-2">
                                            <span>{MESSAGE_TEMPLATE_ICONS[key as MessageTemplateType]}</span>
                                            {label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-red-500">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Subcategoria */}
                    <div className="space-y-2">
                        <Label htmlFor="subtype">
                            Subcategoria (opcional)
                            <span className="text-xs text-muted-foreground ml-2">
                                Ex: MCMV, VIP, URGENTE
                            </span>
                        </Label>
                        <Input
                            id="subtype"
                            placeholder="MCMV"
                            {...register('subtype')}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Nome */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Template *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Primeiro Contato - MCMV"
                            {...register('name')}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Assunto (futuro: para emails) */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">
                            Assunto (opcional)
                            <span className="text-xs text-muted-foreground ml-2">
                                Para uso futuro em emails
                            </span>
                        </Label>
                        <Input
                            id="subject"
                            placeholder="Ex: Proposta especial para você!"
                            {...register('subject')}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Conteúdo */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Conteúdo da Mensagem *</Label>
                        <Textarea
                            id="content"
                            rows={10}
                            placeholder={`Olá {nome}! 👋

Sou {corretor} da {imobiliaria}.

Use {variavel} para personalizar a mensagem!`}
                            {...register('content')}
                            disabled={isLoading}
                        />
                        {errors.content && (
                            <p className="text-sm text-red-500">{errors.content.message}</p>
                        )}
                    </div>

                    {/* Variáveis detectadas */}
                    {detectedVariables.length > 0 && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Variáveis Detectadas
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {detectedVariables.map((variable) => (
                                    <Badge key={variable} variant="secondary">
                                        {`{${variable}}`}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Essas variáveis serão substituídas automaticamente ao usar o template
                            </p>
                        </div>
                    )}

                    {/* Público */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="isPublic" className="cursor-pointer">
                                Template Público
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Permitir que outros usuários vejam e usem este template
                            </p>
                        </div>
                        <Switch
                            id="isPublic"
                            checked={watch('isPublic')}
                            onCheckedChange={(checked) => setValue('isPublic', checked)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Ações */}
                    <div className="flex justify-end gap-2 pt-4">
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
                            {isEditing ? 'Atualizar' : 'Criar Template'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}