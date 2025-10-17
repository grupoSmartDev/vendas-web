// src/components/vendas/MetaProgressCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, DollarSign, Award } from 'lucide-react';
import type { MetaProgresso } from '@/types/index';

interface MetaProgressCardProps {
    metaProgresso: MetaProgresso;
}

export function MetaProgressCard({ metaProgresso }: MetaProgressCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getProgressColor = (percentual: number) => {
        if (percentual >= 100) return 'bg-green-500';
        if (percentual >= 75) return 'bg-blue-500';
        if (percentual >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getMesNome = (mes: number) => {
        const meses = [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
        ];
        return meses[mes - 1];
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Meta de {getMesNome(metaProgresso.mes)}/{metaProgresso.ano}
                    {metaProgresso.userName && ` - ${metaProgresso.userName}`}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* PROGRESSO PRINCIPAL */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progresso</span>
                        <span
                            className={`text-2xl font-bold ${metaProgresso.percentualAtingido >= 100
                                ? 'text-green-600'
                                : 'text-blue-600'
                                }`}
                        >
                            {metaProgresso.percentualAtingido.toFixed(1)}%
                        </span>
                    </div>
                    <Progress
                        value={Math.min(metaProgresso.percentualAtingido, 100)}
                        className="h-3"
                    // indicatorClassName={getProgressColor(metaProgresso.percentualAtingido)}
                    />
                </div>

                {/* VALORES */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                            <Target className="h-3 w-3" />
                            Meta
                        </p>
                        <p className="text-lg font-bold text-blue-700">
                            {formatCurrency(metaProgresso.valorMeta)}
                        </p>
                    </div>

                    <div
                        className={`p-4 rounded-lg ${metaProgresso.percentualAtingido >= 100
                            ? 'bg-green-50'
                            : 'bg-orange-50'
                            }`}
                    >
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                            <TrendingUp className="h-3 w-3" />
                            Realizado
                        </p>
                        <p
                            className={`text-lg font-bold ${metaProgresso.percentualAtingido >= 100
                                ? 'text-green-700'
                                : 'text-orange-700'
                                }`}
                        >
                            {formatCurrency(metaProgresso.valorRealizado)}
                        </p>
                    </div>
                </div>

                {/* FALTA PARA META */}
                {metaProgresso.percentualAtingido < 100 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Falta para Meta</p>
                        <p className="text-xl font-bold text-red-700">
                            {formatCurrency(
                                metaProgresso.valorMeta - metaProgresso.valorRealizado
                            )}
                        </p>
                    </div>
                )}

                {/* ESTATÍSTICAS */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Vendas Realizadas
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                            {metaProgresso.vendasRealizadas}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Comissões
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(metaProgresso.comissoesTotais)}
                        </p>
                    </div>
                </div>

                {/* MENSAGEM DE SUCESSO */}
                {metaProgresso.percentualAtingido >= 100 && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                        <p className="text-green-800 font-semibold">
                            🎉 Parabéns! Meta batida! 🎉
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}