'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Search, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { messageTemplatesService } from '@/services/message-templates.service';
import type {
    MessageTemplate,
    MessageTemplateType,
} from '@/types/index';
import {
    MESSAGE_TEMPLATE_LABELS,
    MESSAGE_TEMPLATE_ICONS,
} from '@/types/index';
import type { Lead } from '@/types';

interface UseTemplateButtonProps {
    lead?: Lead;
    onUseTemplate?: (content: string) => void;
    size?: 'sm' | 'default' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
}

export function UseTemplateButton({
    lead,
    onUseTemplate,
    size = 'default',
    variant = 'outline',
}: UseTemplateButtonProps) {
    const [open, setOpen] = useState(false);
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [groupedTemplates, setGroupedTemplates] = useState<
        Record<MessageTemplateType, MessageTemplate[]>
    >({} as any);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
    const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
    const [processedContent, setProcessedContent] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        if (open) {
            loadTemplates();
        }
    }, [open]);

    // Auto-preenche variáveis baseado no lead
    useEffect(() => {
        if (selectedTemplate && lead) {
            const autoVariables: Record<string, string> = {};

            selectedTemplate.variables.forEach((variable) => {
                switch (variable) {
                    case 'nome':
                        autoVariables[variable] = lead.name;
                        break;
                    case 'empreendimento':
                        autoVariables[variable] = lead.interesseEmpreendimento?.name || '';
                        break;
                    // Adicione mais casos conforme necessário
                }
            });

            setCustomVariables(autoVariables);
        }
    }, [selectedTemplate, lead]);

    const loadTemplates = async () => {
        try {
            setIsLoading(true);
            const data = await messageTemplatesService.getAll();
            setTemplates(data.templates);
            setGroupedTemplates(data.grouped);
        } catch (error) {
            console.error('Erro ao carregar templates:', error);
            toast.error('Erro ao carregar templates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectTemplate = (template: MessageTemplate) => {
        setSelectedTemplate(template);
        setProcessedContent('');
    };

    const handleApplyVariables = async () => {
        if (!selectedTemplate) return;

        try {
            setIsApplying(true);
            const result = await messageTemplatesService.applyVariables(
                selectedTemplate.id,
                customVariables
            );
            setProcessedContent(result.processed.content);
        } catch (error) {
            console.error('Erro ao aplicar variáveis:', error);
            toast.error('Erro ao processar template');
        } finally {
            setIsApplying(false);
        }
    };

    const handleUseTemplate = () => {
        const contentToUse = processedContent || selectedTemplate?.content || '';

        if (onUseTemplate) {
            onUseTemplate(contentToUse);
        } else {
            navigator.clipboard.writeText(contentToUse);
            toast.success('Template copiado para área de transferência!');
        }

        setOpen(false);
        setSelectedTemplate(null);
        setProcessedContent('');
        setCustomVariables({});
    };

    const filteredTemplates = templates.filter(
        (template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGrouped = filteredTemplates.reduce((acc, template) => {
        if (!acc[template.type]) {
            acc[template.type] = [];
        }
        acc[template.type].push(template);
        return acc;
    }, {} as Record<MessageTemplateType, MessageTemplate[]>);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={size} variant={variant}>
                    <FileText className="h-4 w-4 mr-2" />
                    Usar Template
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Escolher Template de Mensagem</DialogTitle>
                    <DialogDescription>
                        Selecione um template e personalize as variáveis
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                    {/* COLUNA ESQUERDA - Lista de Templates */}
                    <div className="space-y-3 overflow-hidden flex flex-col">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar templates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <ScrollArea className="flex-1">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-4 pr-4">
                                    {Object.entries(filteredGrouped).map(([type, categoryTemplates]) => (
                                        <div key={type}>
                                            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                                <span>{MESSAGE_TEMPLATE_ICONS[type as MessageTemplateType]}</span>
                                                {MESSAGE_TEMPLATE_LABELS[type as MessageTemplateType]}
                                            </h3>
                                            <div className="space-y-2">
                                                {categoryTemplates.map((template) => (
                                                    <div
                                                        key={template.id}
                                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedTemplate?.id === template.id
                                                                ? 'bg-primary/10 border-primary'
                                                                : 'hover:bg-muted/50'
                                                            }`}
                                                        onClick={() => handleSelectTemplate(template)}
                                                    >
                                                        <div className="font-medium text-sm">{template.name}</div>
                                                        {template.subtype && (
                                                            <Badge variant="outline" className="text-xs mt-1">
                                                                {template.subtype}
                                                            </Badge>
                                                        )}
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                            {template.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* COLUNA DIREITA - Preview e Variáveis */}
                    <div className="border-l pl-4 overflow-hidden flex flex-col">
                        {selectedTemplate ? (
                            <div className="space-y-4 overflow-hidden flex flex-col flex-1">
                                <div>
                                    <h3 className="font-semibold">{selectedTemplate.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {MESSAGE_TEMPLATE_LABELS[selectedTemplate.type]}
                                    </p>
                                </div>

                                <Separator />

                                {/* Variáveis */}
                                {selectedTemplate.variables.length > 0 && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">
                                                Preencha as Variáveis
                                            </Label>
                                            <div className="grid gap-3">
                                                {selectedTemplate.variables.map((variable) => (
                                                    <div key={variable} className="space-y-1">
                                                        <Label htmlFor={`var-${variable}`} className="text-xs">
                                                            {`{${variable}}`}
                                                        </Label>
                                                        <Input
                                                            id={`var-${variable}`}
                                                            placeholder={`Digite ${variable}...`}
                                                            value={customVariables[variable] || ''}
                                                            onChange={(e) =>
                                                                setCustomVariables((prev) => ({
                                                                    ...prev,
                                                                    [variable]: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={handleApplyVariables}
                                                disabled={isApplying}
                                                className="w-full"
                                            >
                                                {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Aplicar Variáveis
                                            </Button>
                                        </div>
                                        <Separator />
                                    </>
                                )}

                                {/* Preview */}
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <Label className="text-sm font-semibold mb-2">
                                        {processedContent ? 'Preview Personalizado' : 'Conteúdo Original'}
                                    </Label>
                                    <ScrollArea className="flex-1">
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <p className="whitespace-pre-wrap text-sm">
                                                {processedContent || selectedTemplate.content}
                                            </p>
                                        </div>
                                    </ScrollArea>
                                </div>

                                <div className="flex gap-2 pt-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const content = processedContent || selectedTemplate.content;
                                            navigator.clipboard.writeText(content);
                                            toast.success('Copiado!');
                                        }}
                                        className="flex-1"
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copiar
                                    </Button>
                                    <Button onClick={handleUseTemplate} className="flex-1">
                                        Usar Template
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <div className="text-center">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Selecione um template à esquerda</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}