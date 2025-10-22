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
import { Progress } from '@/components/ui/progress';
import {
    Brain,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Copy,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { aiService } from '@/services/ai.service';
import type { LeadDiagnosis } from '@/types/ai';
import {
    TEMPERATURA_LABELS,
    TEMPERATURA_COLORS,
    TEMPERATURA_EMOJI,
    PRAZO_LABELS,
    PRAZO_COLORS,
} from '@/types/ai';

interface DiagnosisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    leadId: string;
    leadName: string;
}

export function DiagnosisDialog({
    open,
    onOpenChange,
    leadId,
    leadName,
}: DiagnosisDialogProps) {
    const [diagnosis, setDiagnosis] = useState<LeadDiagnosis | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDiagnosticar = async () => {
        try {
            setIsLoading(true);
            const result = await aiService.diagnosticarLead(leadId);
            setDiagnosis(result.diagnosis);
            toast.success('Diagnóstico concluído!');
        } catch (error: any) {
            console.error('Erro ao diagnosticar:', error);
            toast.error(error.response?.data?.message || 'Erro ao diagnosticar lead');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyMessage = () => {
        if (diagnosis?.mensagemSugerida) {
            navigator.clipboard.writeText(diagnosis.mensagemSugerida);
            toast.success('Mensagem copiada!');
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reseta após fechar
        setTimeout(() => setDiagnosis(null), 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Brain className="h-6 w-6 text-purple-600" />
                        Diagnóstico Inteligente
                    </DialogTitle>
                    <DialogDescription>
                        Análise completa do lead {leadName} usando IA
                    </DialogDescription>
                </DialogHeader>

                {!diagnosis ? (
                    /* TELA INICIAL */
                    <div className="py-12 text-center space-y-6">
                        <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkles className="h-12 w-12 text-purple-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                                Pronto para analisar este lead?
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                A IA vai analisar todos os dados do lead, histórico de interações
                                e fornecer insights acionáveis para você converter mais rápido.
                            </p>
                        </div>
                        <Button
                            size="lg"
                            onClick={handleDiagnosticar}
                            disabled={isLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {isLoading ? 'Analisando...' : 'Iniciar Diagnóstico'}
                        </Button>
                    </div>
                ) : (
                    /* TELA DE RESULTADOS */
                    <div className="space-y-6">
                        {/* Header com Scores */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Temperatura */}
                            <div className="border rounded-lg p-4 text-center">
                                <div className="text-4xl mb-2">
                                    {TEMPERATURA_EMOJI[diagnosis.temperatura]}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Temperatura
                                </p>
                                <Badge
                                    style={{
                                        backgroundColor: TEMPERATURA_COLORS[diagnosis.temperatura],
                                        color: 'white',
                                    }}
                                >
                                    {TEMPERATURA_LABELS[diagnosis.temperatura]}
                                </Badge>
                            </div>

                            {/* Score IA */}
                            <div className="border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">Score IA</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold">
                                        {diagnosis.scoreIA}
                                    </span>
                                    <span className="text-muted-foreground mb-1">/100</span>
                                </div>
                                <Progress value={diagnosis.scoreIA} className="mt-2" />
                            </div>

                            {/* Probabilidade */}
                            <div className="border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Prob. Conversão
                                </p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold">
                                        {diagnosis.probabilidadeConversao}%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    em {diagnosis.tempoEstimadoConversao}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Análise */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Análise da Situação
                            </h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {diagnosis.analise}
                            </p>
                        </div>

                        <Separator />

                        {/* Pontos Fortes */}
                        {diagnosis.pontosFortes.length > 0 && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Pontos Fortes
                                    </h3>
                                    <ul className="space-y-2">
                                        {diagnosis.pontosFortes.map((ponto, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>{ponto}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Pontos de Atenção */}
                        {diagnosis.pontosAtencao.length > 0 && (
                            <>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-600">
                                        <AlertCircle className="h-5 w-5" />
                                        Pontos de Atenção
                                    </h3>
                                    <ul className="space-y-2">
                                        {diagnosis.pontosAtencao.map((ponto, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                <span>{ponto}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Próximos Passos */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Próximos Passos Recomendados
                            </h3>
                            <div className="space-y-3">
                                {diagnosis.proximosPassos.map((passo, idx) => (
                                    <div
                                        key={idx}
                                        className="border rounded-lg p-3 flex items-start gap-3"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                                            {passo.prioridade}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{passo.acao}</p>
                                            <Badge
                                                variant="outline"
                                                className="mt-2"
                                                style={{
                                                    borderColor: PRAZO_COLORS[passo.prazo],
                                                    color: PRAZO_COLORS[passo.prazo],
                                                }}
                                            >
                                                {PRAZO_LABELS[passo.prazo]}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Mensagem Sugerida */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Copy className="h-5 w-5" />
                                Mensagem Sugerida
                            </h3>
                            <div className="bg-muted/50 rounded-lg p-4 relative">
                                <p className="text-sm whitespace-pre-wrap mb-3">
                                    {diagnosis.mensagemSugerida}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCopyMessage}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copiar Mensagem
                                </Button>
                            </div>
                        </div>

                        {/* Recomendação de Empreendimento */}
                        {diagnosis.recomendacaoEmpreendimento && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-3">
                                        Recomendação de Empreendimento
                                    </h3>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-900">
                                            {diagnosis.recomendacaoEmpreendimento}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Botão de Ação */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={handleClose}>
                                Fechar
                            </Button>
                            <Button onClick={() => handleDiagnosticar()}>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Novo Diagnóstico
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}