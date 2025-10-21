'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Copy,
    Edit,
    Lock,
    Star,
    User,
    Calendar,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import type { MessageTemplate } from '@/types/index';
import {
    MESSAGE_TEMPLATE_LABELS,
    MESSAGE_TEMPLATE_ICONS,
} from '@/types/index';
import { messageTemplatesService } from '@/services/message-templates.service';

interface ViewTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: MessageTemplate | null;
    onEdit: (template: MessageTemplate) => void;
    onDuplicate: (template: MessageTemplate) => void;
}

export function ViewTemplateDialog({
    open,
    onOpenChange,
    template,
    onEdit,
    onDuplicate,
}: ViewTemplateDialogProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});
    const [previewContent, setPreviewContent] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    if (!template) return null;

    const handleApplyPreview = async () => {
        try {
            setIsApplying(true);
            const result = await messageTemplatesService.applyVariables(
                template.id,
                previewVariables
            );
            setPreviewContent(result.processed.content);
            setShowPreview(true);
        } catch (error) {
            console.error('Erro ao aplicar variáveis:', error);
            toast.error('Erro ao gerar preview');
        } finally {
            setIsApplying(false);
        }
    };

    const handleCopyContent = () => {
        const contentToCopy = showPreview ? previewContent : template.content;
        navigator.clipboard.writeText(contentToCopy);
        toast.success('Conteúdo copiado!');
    };

    const formatDate = (date: string) => {
        return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">
                            {MESSAGE_TEMPLATE_ICONS[template.type]}
                        </span>
                        {template.name}
                        {template.isSystem && (
                            <Badge variant="secondary" className="ml-2">
                                <Lock className="h-3 w-3 mr-1" />
                                Sistema
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {MESSAGE_TEMPLATE_LABELS[template.type]}
                        {template.subtype && ` • ${template.subtype}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Info Cards */}
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{template.usageCount}</span>
                            <span className="text-muted-foreground">usos</span>
                        </div>
                        {template.user && (
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4" />
                                <span className="text-muted-foreground">{template.user.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span className="text-muted-foreground">
                                {formatDate(template.createdAt)}
                            </span>
                        </div>
                    </div>

                    {template.isPublic && (
                        <Badge variant="outline" className="w-fit">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Template Público
                        </Badge>
                    )}

                    <Separator />

                    {/* Assunto (se tiver) */}
                    {template.subject && (
                        <>
                            <div>
                                <Label className="text-base font-semibold">Assunto</Label>
                                <p className="mt-2 text-sm">{template.subject}</p>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Variáveis */}
                    {template.variables.length > 0 && (
                        <>
                            <div>
                                <Label className="text-base font-semibold mb-3 block">
                                    Variáveis Disponíveis
                                </Label>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {template.variables.map((variable) => (
                                        <div key={variable} className="space-y-2">
                                            <Label htmlFor={`var-${variable}`} className="text-xs">
                                                {`{${variable}}`}
                                            </Label>
                                            <Input
                                                id={`var-${variable}`}
                                                placeholder={`Digite ${variable}...`}
                                                value={previewVariables[variable] || ''}
                                                onChange={(e) =>
                                                    setPreviewVariables((prev) => ({
                                                        ...prev,
                                                        [variable]: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={handleApplyPreview}
                                    disabled={isApplying}
                                >
                                    {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Gerar Preview
                                </Button>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Conteúdo */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label className="text-base font-semibold">
                                {showPreview ? 'Preview com Variáveis' : 'Conteúdo Original'}
                            </Label>
                            {showPreview && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPreview(false)}
                                >
                                    Ver Original
                                </Button>
                            )}
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <p className="whitespace-pre-wrap text-sm">
                                {showPreview ? previewContent : template.content}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Ações */}
                    <div className="flex justify-between pt-4">
                        <Button
                            variant="outline"
                            onClick={handleCopyContent}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Conteúdo
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onDuplicate(template)}
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                            </Button>

                            {!template.isSystem && (
                                <Button onClick={() => onEdit(template)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}