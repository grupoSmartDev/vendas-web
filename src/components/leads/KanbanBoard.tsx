// src/components/leads/KanbanBoard.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { LeadKanbanCard } from './LeadKanbanCard';
import { toast } from 'sonner';
import { leadsService } from '@/services/lead.service';
import type { Lead, LeadStatus } from '@/types';
import { Loader2 } from 'lucide-react';

interface KanbanBoardProps {
    leads: Lead[];
    statuses: LeadStatus[];
    onLeadClick: (lead: Lead) => void;
    onLeadsUpdate: () => void;
}

export function KanbanBoard({
    leads,
    statuses,
    onLeadClick,
    onLeadsUpdate,
}: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
    const [isUpdating, setIsUpdating] = useState(false);

    // Atualizar leads locais quando props mudarem
    useEffect(() => {
        setLocalLeads(leads);
    }, [leads]);

    // Configurar sensores para drag
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Agrupar leads por status
    const leadsByStatus = statuses.reduce((acc, status) => {
        acc[status.id] = localLeads.filter(
            (lead) => lead.status.id === status.id
        );
        return acc;
    }, {} as Record<string, Lead[]>);

    // Quando começa a arrastar
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    // Quando termina de arrastar
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Encontrar o lead que foi arrastado
        const activeLead = localLeads.find((lead) => lead.id === activeId);
        if (!activeLead) {
            setActiveId(null);
            return;
        }

        // Verificar se foi solto em uma coluna (status) diferente
        const newStatusId = overId;
        const oldStatusId = activeLead.status.id;

        if (newStatusId !== oldStatusId) {
            // Atualizar localmente primeiro (otimistic update)
            const updatedLeads = localLeads.map((lead) =>
                lead.id === activeId
                    ? {
                        ...lead,
                        status: statuses.find((s) => s.id === newStatusId)!,
                    }
                    : lead
            );
            setLocalLeads(updatedLeads);

            // Atualizar no backend
            setIsUpdating(true);
            try {
                await leadsService.update(activeId, { statusId: newStatusId });
                toast.success('Lead movido com sucesso!');
                onLeadsUpdate();
            } catch (error) {
                console.error('Erro ao atualizar lead:', error);
                toast.error('Erro ao mover lead');
                // Reverter mudança local
                setLocalLeads(leads);
            } finally {
                setIsUpdating(false);
            }
        }

        setActiveId(null);
    };

    // Lead sendo arrastado
    const activeLead = activeId
        ? localLeads.find((lead) => lead.id === activeId)
        : null;

    return (
        <div className="relative">
            {isUpdating && (
                <div className="absolute top-4 right-4 z-50 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Atualizando...</span>
                </div>
            )}

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {statuses.map((status) => (
                        <KanbanColumn
                            key={status.id}
                            status={status}
                            leads={leadsByStatus[status.id] || []}
                            onLeadClick={onLeadClick}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeLead ? (
                        <LeadKanbanCard
                            lead={activeLead}
                            onClick={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}