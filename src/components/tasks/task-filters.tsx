'use client';

import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TaskFiltersProps {
    filters: {
        startDate: string;
        endDate: string;
        typeId: string;
    };
    interactionTypes: Array<{
        id: string;
        name: string;
        displayName: string;
    }>;
    onFilterChange: (filters: any) => void;
    onClear: () => void;
}

/**
 * Filtros de tarefas
 */
export function TaskFilters({
    filters,
    interactionTypes,
    onFilterChange,
    onClear,
}: TaskFiltersProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Filtros</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onClear}>
                    Limpar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Data Início</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                startDate: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">Data Fim</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                endDate: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="typeId">Tipo de Atividade</Label>
                    <Select
                        value={filters.typeId || 'all'}
                        onValueChange={(value) =>
                            onFilterChange({
                                ...filters,
                                typeId: value === 'all' ? 'all' : value
                            })
                        }
                    >
                        <SelectTrigger id="typeId">
                            <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {interactionTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                    {type.displayName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    );
}