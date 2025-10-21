'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Copy,
    Edit,
    Trash2,
    Eye,
    Loader2,
    Star,
    Lock,
} from 'lucide-react';
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
import { ViewTemplateDialog } from '@/components/templetes/view-templete-dialog';
import { CreateTemplateDialog } from '@/components/templetes/create-templete-dialog';
import { DashboardLayout } from '@/components/layout';

export default function MessageTemplatesPage() {
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [groupedTemplates, setGroupedTemplates] = useState<
        Record<MessageTemplateType, MessageTemplate[]>
    >({} as any);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Dialogs
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

    useEffect(() => {
        loadTemplates();
    }, []);

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

    const handleDuplicate = async (template: MessageTemplate) => {
        try {
            await messageTemplatesService.duplicate(template.id);
            toast.success('Template duplicado com sucesso!');
            loadTemplates();
        } catch (error: any) {
            console.error('Erro ao duplicar:', error);
            toast.error(error.response?.data?.message || 'Erro ao duplicar template');
        }
    };

    const handleDelete = async (template: MessageTemplate) => {
        if (!confirm('Tem certeza que deseja deletar este template?')) {
            return;
        }

        try {
            await messageTemplatesService.delete(template.id);
            toast.success('Template deletado com sucesso!');
            loadTemplates();
        } catch (error: any) {
            console.error('Erro ao deletar:', error);
            toast.error(error.response?.data?.message || 'Erro ao deletar template');
        }
    };

    const handleView = (template: MessageTemplate) => {
        setSelectedTemplate(template);
        setViewDialogOpen(true);
    };

    const handleEdit = (template: MessageTemplate) => {
        setSelectedTemplate(template);
        setCreateDialogOpen(true);
    };

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reagrupa após filtro
    const filteredGrouped = filteredTemplates.reduce((acc, template) => {
        if (!acc[template.type]) {
            acc[template.type] = [];
        }
        acc[template.type].push(template);
        return acc;
    }, {} as Record<MessageTemplateType, MessageTemplate[]>);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Templates de Mensagens</h1>
                        <p className="text-muted-foreground">
                            Crie e gerencie modelos de mensagens para agilizar seu atendimento
                        </p>
                    </div>
                    <Button onClick={() => {
                        setSelectedTemplate(null);
                        setCreateDialogOpen(true);
                    }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Template
                    </Button>
                </div>

                {/* Busca */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total de Templates</CardDescription>
                            <CardTitle className="text-3xl">{templates.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Templates do Sistema</CardDescription>
                            <CardTitle className="text-3xl">
                                {templates.filter((t) => t.isSystem).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Meus Templates</CardDescription>
                            <CardTitle className="text-3xl">
                                {templates.filter((t) => !t.isSystem).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Templates Públicos</CardDescription>
                            <CardTitle className="text-3xl">
                                {templates.filter((t) => t.isPublic).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Templates agrupados por categoria */}
                <div className="space-y-6">
                    {Object.entries(filteredGrouped).map(([type, categoryTemplates]) => (
                        <Card key={type}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">
                                        {MESSAGE_TEMPLATE_ICONS[type as MessageTemplateType]}
                                    </span>
                                    {MESSAGE_TEMPLATE_LABELS[type as MessageTemplateType]}
                                    <Badge variant="secondary" className="ml-2">
                                        {categoryTemplates.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {categoryTemplates.map((template) => (
                                        <Card
                                            key={template.id}
                                            className="hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleView(template)}
                                        >
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base flex items-center gap-2">
                                                            {template.name}
                                                            {template.isSystem && (
                                                                <Lock className="h-3 w-3 text-muted-foreground" />
                                                            )}
                                                        </CardTitle>
                                                        {template.subtype && (
                                                            <Badge variant="outline" className="mt-1 text-xs">
                                                                {template.subtype}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                                    {template.content}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Star className="h-3 w-3" />
                                                        Usado {template.usageCount}x
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDuplicate(template);
                                                            }}
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>

                                                        {!template.isSystem && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEdit(template);
                                                                    }}
                                                                >
                                                                    <Edit className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(template);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Dialogs */}
                <CreateTemplateDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    template={selectedTemplate}
                    onSuccess={() => {
                        loadTemplates();
                        setCreateDialogOpen(false);
                        setSelectedTemplate(null);
                    }}
                />

                <ViewTemplateDialog
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    template={selectedTemplate}
                    onEdit={(template) => {
                        setViewDialogOpen(false);
                        handleEdit(template);
                    }}
                    onDuplicate={(template) => {
                        setViewDialogOpen(false);
                        handleDuplicate(template);
                    }}
                />
            </div>

        </DashboardLayout>
    );
}