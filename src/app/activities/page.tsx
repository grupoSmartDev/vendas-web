// src/app/activities/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Plus, Trash2, TrendingUp, Target, Phone, MessageSquare, Users, Calendar } from 'lucide-react';
import { activitiesService, type DailyActivity, type MonthlyTotals, type CreateLeadFromActivityData } from '@/services/activities.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ActivitiesPage() {
    const [currentTab, setCurrentTab] = useState('diario');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Estados para dados da API
    const [atividadeDia, setAtividadeDia] = useState<DailyActivity | null>(null);
    const [totaisMes, setTotaisMes] = useState<MonthlyTotals | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Dialog de criar lead
    const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
    const [leadChannel, setLeadChannel] = useState<CreateLeadFromActivityData['sourceChannel'] | null>(null);
    const [leadForm, setLeadForm] = useState({
        name: '',
        phone: '',
        email: '',
        observacoes: '',
    });

    // Carregar dados ao montar e quando mudar a data
    useEffect(() => {
        loadData();
    }, [selectedDate]);

    // Carregar dados da API
    const loadData = async () => {
        try {
            setIsLoading(true);

            // Busca atividade do dia
            const activity = await activitiesService.getByDate(selectedDate);
            setAtividadeDia(activity);

            // Busca totais do mês
            const month = selectedDate.substring(0, 7); // YYYY-MM
            const monthly = await activitiesService.getMonthlyTotals(month);
            setTotaisMes(monthly);

        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            toast.error('Erro ao carregar atividades');
        } finally {
            setIsLoading(false);
        }
    };

    // Atualizar campo da atividade
    const atualizarAtividade = async (campo: keyof DailyActivity, valor: number) => {
        if (!atividadeDia) return;

        try {
            const updated = await activitiesService.update({
                date: selectedDate,
                [campo]: valor,
            });

            setAtividadeDia(updated);

            // Recarrega totais do mês
            const month = selectedDate.substring(0, 7);
            const monthly = await activitiesService.getMonthlyTotals(month);
            setTotaisMes(monthly);

        } catch (error) {
            console.error('Erro ao atualizar:', error);
            toast.error('Erro ao atualizar atividade');
        }
    };

    // Abrir dialog de criar lead
    const openLeadDialog = (channel: CreateLeadFromActivityData['sourceChannel']) => {
        setLeadChannel(channel);
        setLeadForm({ name: '', phone: '', email: '', observacoes: '' });
        setIsCreateLeadOpen(true);
    };

    // Criar lead direto da atividade
    const handleCreateLead = async () => {
        if (!leadChannel || !leadForm.name || !leadForm.phone) {
            toast.error('Preencha nome e telefone');
            return;
        }

        try {
            await activitiesService.createLead({
                ...leadForm,
                sourceChannel: leadChannel,
            });

            toast.success('Lead criado com sucesso!');
            setIsCreateLeadOpen(false);

            // Recarrega dados
            loadData();

        } catch (error) {
            console.error('Erro ao criar lead:', error);
            toast.error('Erro ao criar lead');
        }
    };

    // Componente de input com meta
    const InputField = ({
        label,
        icon: Icon,
        campo,
        meta,
        cor = "blue",
        channel
    }: {
        label: string;
        icon: any;
        campo: keyof DailyActivity;
        meta: number;
        cor?: string;
        channel?: CreateLeadFromActivityData['sourceChannel'];
    }) => {
        const valor = atividadeDia?.[campo] as number || 0;
        const progresso = meta > 0 ? Math.min((valor / meta) * 100, 100) : 0;

        // Leads criados nesse canal hoje
        const leadsDoCanal = atividadeDia?.leads?.filter(l => l.sourceChannel === channel) || [];

        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 text-${cor}-600`} />
                        <label className="text-sm font-medium text-gray-700">{label}</label>
                    </div>

                    {channel && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openLeadDialog(channel)}
                            className="h-7 text-xs"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            Lead
                        </Button>
                    )}
                </div>

                <input
                    type="number"
                    value={valor}
                    onChange={(e) => atualizarAtividade(campo, parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md text-lg font-semibold"
                    min="0"
                />

                {meta > 0 && (
                    <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Meta: {meta}</span>
                            <span className={valor >= meta ? "text-green-600 font-bold" : ""}>{valor}/{meta}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${valor >= meta ? 'bg-green-500' : `bg-${cor}-500`}`}
                                style={{ width: `${progresso}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Mostrar leads criados nesse canal */}
                {leadsDoCanal.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">{leadsDoCanal.length} lead(s) hoje:</p>
                        <div className="space-y-1">
                            {leadsDoCanal.slice(0, 3).map(lead => (
                                <div key={lead.id} className="text-xs text-gray-600 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {lead.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </DashboardLayout>
        );
    }

    // CONTINUAÇÃO da página activities/page.tsx
    // Cole isso DENTRO do return, substituindo o "return null"

    return (
        <DashboardLayout>
            <div className="min-h-screen p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <Target className="w-8 h-8 text-indigo-600" />
                                    Gestão de Vendas - Regra 10X
                                </h1>
                                <p className="text-gray-600 mt-1">Meta: 10 vendas/mês | 300 leads/mês</p>
                            </div>
                            <div className="text-right">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg text-lg font-semibold"
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-gray-200">
                            <button
                                onClick={() => setCurrentTab('diario')}
                                className={`px-6 py-3 font-semibold transition-all ${currentTab === 'diario'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                📅 Controle Diário
                            </button>
                            <button
                                onClick={() => setCurrentTab('dashboard')}
                                className={`px-6 py-3 font-semibold transition-all ${currentTab === 'dashboard'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                📊 Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    {currentTab === 'diario' && atividadeDia && (
                        <div className="space-y-6">
                            {/* Seção 1: Prospecção Ativa */}
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Phone className="w-6 h-6 text-red-600" />
                                    1. PROSPECÇÃO ATIVA - Meta: 4-5 leads/dia
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InputField label="Ligações Frias" icon={Phone} campo="ligacoes" meta={30} cor="red" channel="ligacao" />
                                    <InputField label="Mensagens WhatsApp" icon={MessageSquare} campo="mensagensWhatsapp" meta={20} cor="green" channel="whatsapp" />
                                    <InputField label="Abordagens em Grupos" icon={Users} campo="gruposFacebook" meta={10} cor="blue" channel="facebook" />
                                    <InputField label="Visitas Construtoras" icon={Calendar} campo="visitasConstrutora" meta={1} cor="purple" channel="construtora" />
                                </div>
                            </div>

                            {/* Seção 2: Marketing Digital */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                    2. MARKETING DIGITAL - Meta: 3-4 leads/dia
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InputField label="Posts Publicados" icon={TrendingUp} campo="posts" meta={1} cor="blue" channel="post" />
                                    <InputField label="Stories Postados" icon={TrendingUp} campo="stories" meta={4} cor="cyan" channel="story" />
                                    <InputField label="Investimento Ads (R$)" icon={TrendingUp} campo="investimentoAds" meta={15} cor="indigo" />
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <div className="text-sm font-medium text-gray-700 mb-2">💡 Lives Semanais</div>
                                        <div className="text-xs text-gray-600">Agende 1 live/semana sobre MCMV</div>
                                    </div>
                                </div>
                            </div>

                            {/* Seção 3: Indicações */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-green-600" />
                                    3. INDICAÇÕES - Meta: 2-3 leads/dia
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Indicações Pedidas" icon={Users} campo="indicacoesPedidas" meta={5} cor="green" />
                                    <InputField label="Indicações Recebidas" icon={Users} campo="indicacoesRecebidas" meta={2} cor="emerald" channel="indicacao" />
                                </div>
                            </div>

                            {/* Seção 4: Presença Física */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                    4. PRESENÇA FÍSICA - Meta: 1-2 leads/dia
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Horas em Plantão/Stand" icon={Calendar} campo="horasPlantao" meta={2} cor="purple" channel="stand" />
                                    <InputField label="Eventos/Networking" icon={Users} campo="eventosNetworking" meta={1} cor="pink" channel="networking" />
                                </div>
                            </div>

                            {/* Funil de Conversão */}
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-yellow-600" />
                                    FUNIL DE CONVERSÃO DO DIA
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    <InputField label="Leads Gerados" icon={Users} campo="leadsGerados" meta={11} cor="blue" />
                                    <InputField label="Atendimentos" icon={MessageSquare} campo="atendimentos" meta={11} cor="cyan" />
                                    <InputField label="Visitas Agendadas" icon={Calendar} campo="visitasAgendadas" meta={3} cor="indigo" />
                                    <InputField label="Visitas Realizadas" icon={Calendar} campo="visitasRealizadas" meta={2} cor="purple" />
                                    <InputField label="Propostas Enviadas" icon={TrendingUp} campo="propostasEnviadas" meta={1} cor="orange" />
                                    <InputField label="🎉 VENDAS!" icon={Target} campo="vendasFechadas" meta={0.5} cor="green" />
                                </div>

                                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-yellow-400">
                                    <div className="text-sm font-semibold text-gray-700 mb-2">Taxa de Conversão do Dia:</div>
                                    <div className="text-3xl font-bold text-yellow-600">
                                        {atividadeDia.leadsGerados > 0
                                            ? ((atividadeDia.vendasFechadas / atividadeDia.leadsGerados) * 100).toFixed(1)
                                            : 0}%
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">Meta: 3% (1 venda a cada 33 leads)</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dashboard Tab */}
                    {currentTab === 'dashboard' && totaisMes && (
                        <div className="space-y-6">
                            {/* Cards de Resumo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className=" p-6 rounded-xl shadow-lg">
                                    <div className="text-sm opacity-90 mb-1">Leads do Mês</div>
                                    <div className="text-4xl font-bold">{totaisMes.totals.leadsGerados}</div>
                                    <div className="text-sm opacity-90 mt-2">Meta: 300 ({Math.round((totaisMes.totals.leadsGerados / 300) * 100)}%)</div>
                                    <div className="w-full bg-blue-400 rounded-full h-2 mt-2">
                                        <div className="bg-white h-2 rounded-full" style={{ width: `${Math.min((totaisMes.totals.leadsGerados / 300) * 100, 100)}%` }} />
                                    </div>
                                </div>

                                <div className=" p-6 rounded-xl shadow-lg">
                                    <div className="text-sm opacity-90 mb-1">Vendas do Mês</div>
                                    <div className="text-4xl font-bold">{totaisMes.totals.vendasFechadas}</div>
                                    <div className="text-sm opacity-90 mt-2">Meta: 10 ({Math.round((totaisMes.totals.vendasFechadas / 10) * 100)}%)</div>
                                    <div className="w-full bg-green-400 rounded-full h-2 mt-2">
                                        <div className="bg-white h-2 rounded-full" style={{ width: `${Math.min((totaisMes.totals.vendasFechadas / 10) * 100, 100)}%` }} />
                                    </div>
                                </div>

                                <div className=" p-6 rounded-xl shadow-lg">
                                    <div className="text-sm opacity-90 mb-1">Taxa de Conversão</div>
                                    <div className="text-4xl font-bold">{totaisMes.taxaConversao.toFixed(1)}%</div>
                                    <div className="text-sm opacity-90 mt-2">Meta: 3%</div>
                                </div>

                                <div className=" p-6 rounded-xl shadow-lg">
                                    <div className="text-sm opacity-90 mb-1">Ligações do Mês</div>
                                    <div className="text-4xl font-bold">{totaisMes.totals.ligacoes}</div>
                                    <div className="text-sm opacity-90 mt-2">Meta: 600 ({Math.round((totaisMes.totals.ligacoes / 600) * 100)}%)</div>
                                    <div className="w-full bg-orange-400 rounded-full h-2 mt-2">
                                        <div className="bg-white h-2 rounded-full" style={{ width: `${Math.min((totaisMes.totals.ligacoes / 600) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Dica Motivacional */}
                            <div className=" p-6 rounded-xl shadow-lg">
                                <h3 className="text-2xl font-bold mb-3">🔥 LEMBRE-SE DA REGRA 10X!</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
                                        <div className="font-bold mb-1">PENSE 10X</div>
                                        <div>Meta não é 5 vendas, é 10!</div>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
                                        <div className="font-bold mb-1">FAÇA 10X</div>
                                        <div>10x mais ligações, 10x mais ação!</div>
                                    </div>
                                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
                                        <div className="font-bold mb-1">SEJA 10X</div>
                                        <div>Destaque-se da concorrência!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dialog de Criar Lead */}
                <Dialog open={isCreateLeadOpen} onOpenChange={setIsCreateLeadOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Lead - {leadChannel && leadChannel.toUpperCase()}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Nome *</Label>
                                <Input
                                    value={leadForm.name}
                                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                    placeholder="Nome completo"
                                />
                            </div>

                            <div>
                                <Label>Telefone *</Label>
                                <Input
                                    value={leadForm.phone}
                                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                                    placeholder="(11) 99999-9999"
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={leadForm.email}
                                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                    placeholder="email@exemplo.com"
                                />
                            </div>

                            <div>
                                <Label>Observações</Label>
                                <Input
                                    value={leadForm.observacoes}
                                    onChange={(e) => setLeadForm({ ...leadForm, observacoes: e.target.value })}
                                    placeholder="Observações sobre o lead..."
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateLeadOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateLead}>
                                Criar Lead
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}