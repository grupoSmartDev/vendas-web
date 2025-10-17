// src/components/leads/KanbanColumn.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeadKanbanCard } from './LeadKanbanCard';
import type { Lead, LeadStatus } from '@/types';

interface KanbanColumnProps {
    status: LeadStatus;
    leads: Lead[];
    onLeadClick: (lead: Lead) => void;
}

export function KanbanColumn({ status, leads, onLeadClick }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: status.id,
    });

    // Calcular total da coluna (opcional)
    const totalValue = leads.reduce((sum, lead) => {
        return sum + (lead.rendaFamiliar || 0);
    }, 0);

    return (
        <div className="flex-shrink-0 w-80">
            <Card
                className={`h-full border-2 transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: status.color }}
                            />
                            {status.displayName}
                        </CardTitle>
                        <Badge variant="secondary" className="ml-2">
                            {leads.length}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent
                    ref={setNodeRef}
                    className="min-h-[600px] max-h-[calc(100vh-250px)] overflow-y-auto"
                >
                    <SortableContext
                        items={leads.map((lead) => lead.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {leads.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                Nenhum lead neste status
                            </div>
                        ) : (
                            leads.map((lead) => (
                                <LeadKanbanCard
                                    key={lead.id}
                                    lead={lead}
                                    onClick={() => onLeadClick(lead)}
                                />
                            ))
                        )}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
}