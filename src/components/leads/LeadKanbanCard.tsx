// src/components/leads/LeadKanbanCard.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Phone,
    Mail,
    DollarSign,
    TrendingUp,
    Wallet,
    User,
} from 'lucide-react';
import type { Lead } from '@/types';

interface LeadKanbanCardProps {
    lead: Lead;
    onClick: () => void;
}

export function LeadKanbanCard({ lead, onClick }: LeadKanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Função para obter cor do score
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 60) return 'text-blue-600 bg-blue-50';
        if (score >= 40) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    // Função para obter iniciais
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Formatar valor em reais
    const formatCurrency = (value?: number) => {
        if (!value) return 'Não informado';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-move hover:shadow-md transition-shadow mb-3 bg-white"
            onClick={onClick}
        >
            <CardContent className="p-4">
                {/* Header com Nome e Score */}
                <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-sm line-clamp-1 flex-1">
                        {lead.name}
                    </h4>
                    <Badge
                        className={`ml-2 font-bold ${getScoreColor(lead.score)}`}
                        variant="secondary"
                    >
                        {lead.score}
                    </Badge>
                </div>

                {/* Informações de Contato */}
                <div className="space-y-2 mb-3">
                    <div className="flex items-center text-xs text-gray-600">
                        <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                    </div>
                    {lead.email && (
                        <div className="flex items-center text-xs text-gray-600">
                            <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                        </div>
                    )}
                </div>

                {/* Renda Familiar */}
                {lead.rendaFamiliar && (
                    <div className="flex items-center text-xs mb-2">
                        <Wallet className="h-3 w-3 mr-2 text-green-600" />
                        <span className="font-medium text-green-700">
                            {formatCurrency(lead.rendaFamiliar)}
                        </span>
                    </div>
                )}

                {/* Valor de Interesse */}
                {lead.interesseEmpreendimento && (
                    <div className="mb-3">
                        <div className="flex items-center text-xs text-gray-600">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="truncate">
                                {lead.interesseEmpreendimento.name}
                            </span>
                        </div>
                    </div>
                )}

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {lead.tags.slice(0, 2).map((tagRelation) => (
                            <Badge
                                key={tagRelation.tag.id}
                                variant="outline"
                                className="text-xs px-2 py-0"
                                style={{
                                    borderColor: tagRelation.tag.color,
                                    color: tagRelation.tag.color,
                                }}
                            >
                                {tagRelation.tag.name}
                            </Badge>
                        ))}
                        {lead.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                                +{lead.tags.length - 2}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Footer com Usuário */}
                {lead.user && (
                    <div className="flex items-center pt-2 border-t border-gray-100">
                        <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                {getInitials(lead.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600 truncate">
                            {lead.user.name}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}