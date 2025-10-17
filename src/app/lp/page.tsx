'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, BarChart3, Calendar, MessageSquare, DollarSign, TrendingUp, Bell, Smartphone, Shield } from 'lucide-react';

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index: any) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const stats = [
        { icon: '🚀', number: '5x', label: 'Mais Vendas por Mês' },
        { icon: '⚡', number: '85%', label: 'Redução de Tempo Perdido' },
        { icon: '📈', number: '40%', label: 'Taxa de Conversão Lead→Visita' },
        { icon: '💰', number: 'R$300k', label: 'Comissões Anuais Médias' }
    ];

    const features = [
        {
            icon: <BarChart3 className="w-12 h-12" />,
            title: 'Gestão Completa de Leads',
            description: 'Centralize todos os seus contatos em um único lugar. Nunca mais perca um lead importante com nossa gestão inteligente que organiza, prioriza e alerta você no momento certo.'
        },
        {
            icon: <TrendingUp className="w-12 h-12" />,
            title: 'Funil de Vendas Visual',
            description: 'Acompanhe cada lead desde o primeiro contato até o fechamento. Arraste e solte entre as etapas e visualize sua pipeline completa em tempo real com taxas de conversão automáticas.'
        },
        {
            icon: <Calendar className="w-12 h-12" />,
            title: 'Calendário & Agendamentos',
            description: 'Agende visitas, follow-ups e reuniões com lembretes automáticos. Sincronize com seu Google Calendar e nunca esqueça um compromisso importante novamente.'
        },
        {
            icon: <MessageSquare className="w-12 h-12" />,
            title: 'Biblioteca de Scripts',
            description: 'Acesso a mensagens prontas e testadas para WhatsApp, email e telefone. Responda mais rápido, mantenha consistência na comunicação e converta mais leads em clientes.'
        },
        {
            icon: <DollarSign className="w-12 h-12" />,
            title: 'Calculadora de Financiamento',
            description: 'Simule financiamentos MCMV na hora com o cliente. Mostre parcelas, entrada, subsídios e total financiado antes mesmo dele ir ao banco, aumentando suas chances de fechamento.'
        },
        {
            icon: <BarChart3 className="w-12 h-12" />,
            title: 'Relatórios e Analytics',
            description: 'Dashboards completos com KPIs essenciais: taxa de conversão, tempo médio de fechamento, origem dos melhores leads e performance individual. Decisões baseadas em dados reais.'
        },
        {
            icon: <Bell className="w-12 h-12" />,
            title: 'Automação de Follow-ups',
            description: 'Configure alertas automáticos para retornar contato com leads em momentos estratégicos. O sistema te avisa quando é hora de reativar aquele cliente que esfriou.'
        },
        {
            icon: <Smartphone className="w-12 h-12" />,
            title: 'Mobile First',
            description: 'Acesse de qualquer lugar pelo celular ou tablet. Registre visitas, atualize status dos leads e consulte informações mesmo estando no trânsito entre reuniões.'
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: 'Segurança Total',
            description: 'Seus dados e dos seus clientes protegidos com criptografia de ponta. Backup automático e conformidade com LGPD garantem tranquilidade total para seu negócio.'
        }
    ];

    const pricing = [
        {
            name: 'Básico',
            price: 'R$ 97',
            period: '/mês',
            description: 'Perfeito para corretores iniciantes que querem organização',
            features: [
                'Até 100 leads ativos',
                'Funil de vendas visual',
                'Calendário de agendamentos',
                'Scripts básicos prontos',
                'Calculadora MCMV',
                'Relatórios mensais',
                'Suporte por email',
                '1 usuário'
            ],
            cta: 'Começar Teste Grátis',
            popular: false
        },
        {
            name: 'Profissional',
            price: 'R$ 197',
            period: '/mês',
            description: 'Para corretores sérios que querem vender 5x mais',
            features: [
                'Leads ilimitados',
                'Funil de vendas avançado',
                'Automação de follow-ups',
                'Biblioteca completa de scripts',
                'Calculadora MCMV + simulações',
                'Relatórios em tempo real',
                'Integrações com portais',
                'WhatsApp integrado',
                'Suporte prioritário (chat)',
                'Até 3 usuários'
            ],
            cta: 'Começar Teste Grátis',
            popular: true
        },
        {
            name: 'Premium',
            price: 'R$ 397',
            period: '/mês',
            description: 'Para equipes e imobiliárias que dominam o mercado',
            features: [
                'Tudo do Profissional +',
                'Multi-tenant (imobiliárias)',
                'Dashboard gerencial',
                'Gestão de equipes',
                'Distribuição automática de leads',
                'API para integrações customizadas',
                'Relatórios personalizados',
                'White label disponível',
                'Suporte VIP (WhatsApp + Phone)',
                'Usuários ilimitados',
                'Treinamento exclusivo'
            ],
            cta: 'Falar com Especialista',
            popular: false
        }
    ];

    const testimonials = [
        {
            text: 'Antes eu fazia 1 venda por mês. Depois do sistema, fiz 5 vendas em um único mês. Não consigo mais trabalhar sem ele. É ter um assistente pessoal 24/7.',
            author: 'Mariana Silva',
            role: 'Corretora Autônoma'
        },
        {
            text: 'Minha taxa de conversão era 12%. Com o sistema, subiu para 38%. Os relatórios me mostraram exatamente onde eu estava perdendo oportunidades.',
            author: 'Roberto Mendes',
            role: 'Diretor Comercial'
        },
        {
            text: 'A calculadora MCMV é sensacional. Os clientes ficam impressionados quando simulo tudo na hora. Isso me diferencia dos concorrentes e fecha mais negócios.',
            author: 'Ana Beatriz Santos',
            role: 'Corretora Especialista MCMV'
        }
    ];

    const faqs = [
        {
            question: 'Preciso de conhecimento técnico para usar?',
            answer: 'Não! O sistema foi desenvolvido para ser extremamente intuitivo. Se você usa WhatsApp e Instagram, consegue usar nosso sistema. Além disso, oferecemos vídeos tutoriais e suporte via chat.'
        },
        {
            question: 'Funciona no celular?',
            answer: 'Sim! O sistema é 100% responsivo e funciona perfeitamente em celulares e tablets. Você pode gerenciar seus leads de qualquer lugar, a qualquer momento.'
        },
        {
            question: 'Meus dados ficam seguros?',
            answer: 'Absolutamente. Utilizamos criptografia de nível bancário e todos os dados são armazenados em servidores seguros com backup automático diário. Somos 100% compatíveis com a LGPD.'
        },
        {
            question: 'Posso integrar com outros sistemas?',
            answer: 'Sim! Temos integração nativa com os principais portais imobiliários (VivaReal, ZapImóveis, OLX), Facebook, Instagram e Google Calendar. Novas integrações são adicionadas regularmente.'
        },
        {
            question: 'E se eu precisar de ajuda?',
            answer: 'Oferecemos suporte via chat de segunda a sexta das 9h às 18h, além de uma base de conhecimento completa com tutoriais em vídeo e artigos detalhados.'
        }
    ];

    const processes = [
        {
            number: '1',
            title: 'Capture Leads Automaticamente',
            description: 'Integre com portais imobiliários, Facebook, Instagram e seu site. Todos os leads chegam automaticamente no sistema, organizados e prontos para atendimento.'
        },
        {
            number: '2',
            title: 'Qualifique e Priorize',
            description: 'O sistema classifica automaticamente os leads por temperatura (quente, morno, frio) e você foca nos mais promissores primeiro, aumentando sua taxa de conversão.'
        },
        {
            number: '3',
            title: 'Acompanhe Todo o Processo',
            description: 'Movimente os leads pelo funil, agende visitas, envie propostas e mantenha todo o histórico de interações registrado. Transparência total para você e sua equipe.'
        },
        {
            number: '4',
            title: 'Feche Mais Negócios',
            description: 'Com organização, follow-ups automáticos e dados na mão, você fecha em média 5x mais negócios por mês. Seus números falam por você.'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <Badge variant="outline" className="mb-6 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                            ✨ Usado por +500 corretores no Brasil
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                            Transforme Leads em Vendas com Gestão Profissional
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            O sistema completo para corretores que querem dominar o mercado imobiliário. Gerencie leads, automatize follow-ups e multiplique suas conversões por 5x.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6">
                                Começar Gratuitamente <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6">
                                Ver Como Funciona
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="py-16 bg-white border-b-2 border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 text-sm uppercase tracking-widest mb-8">
                        Confiado por imobiliárias líderes de mercado
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
                        <span className="text-black font-bold text-lg">PREMIER IMÓVEIS</span>
                        <span className="text-black font-bold text-lg">ELITE REAL ESTATE</span>
                        <span className="text-black font-bold text-lg">VENDA+ CORRETORA</span>
                        <span className="text-black font-bold text-lg">TOP NEGÓCIOS</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-white text-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <p className="text-gray-600 text-sm uppercase tracking-widest mb-4">Resultados Comprovados</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Números que Falam por Si</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Veja o impacto real que nosso sistema tem na produtividade e faturamento dos corretores
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {stats.map((stat, index) => (
                            <Card key={index} className="text-center border-2 hover:border-black hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                                <CardContent className="pt-12 pb-12">
                                    <div className="text-5xl mb-4">{stat.icon}</div>
                                    <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 text-lg">{stat.label}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Screenshot Section */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-16">
                        <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">Plataforma Completa</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Dashboard Intuitivo e Poderoso</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Visualize todas as suas oportunidades, métricas e ações em uma única tela
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
                            alt="Dashboard"
                            className="w-full"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white text-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <p className="text-gray-600 text-sm uppercase tracking-widest mb-4">Funcionalidades</p>
                        <h2 className="text-4xl md:text-5xl font-bold">Tudo que Você Precisa para Vender Mais</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-2 hover:border-black hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                                <CardHeader>
                                    <div className="mb-4 text-black">{feature.icon}</div>
                                    <CardTitle className="text-2xl mb-3">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">Como Funciona</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Da Captação ao Fechamento em 4 Passos</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Um processo simples e eficiente que transforma leads em vendas
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {processes.map((process, index) => (
                            <div key={index} className="flex gap-6 relative">
                                {index < processes.length - 1 && (
                                    <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-white/20 to-transparent" />
                                )}
                                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold z-10">
                                    {process.number}
                                </div>
                                <div className="flex-1 pt-3">
                                    <h3 className="text-2xl font-bold mb-3">{process.title}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">{process.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white text-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <p className="text-gray-600 text-sm uppercase tracking-widest mb-4">Depoimentos</p>
                        <h2 className="text-4xl md:text-5xl font-bold">O Que Dizem Nossos Usuários</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-2 hover:border-black hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                                <CardContent className="pt-8">
                                    <p className="text-lg italic text-gray-700 mb-6 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-gray-600" />
                                        <div>
                                            <h4 className="font-bold">{testimonial.author}</h4>
                                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-white text-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <p className="text-gray-600 text-sm uppercase tracking-widest mb-4">Planos e Preços</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Escolha o Plano Ideal para Você</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Todos os planos incluem 14 dias de teste grátis. Cancele quando quiser, sem burocracia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                        {pricing.map((plan, index) => (
                            <Card
                                key={index}
                                className={`relative border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${plan.popular
                                    ? 'bg-black text-white border-black scale-105'
                                    : 'bg-white border-gray-200 hover:border-black'
                                    }`}
                            >
                                {plan.popular && (
                                    <Badge className="absolute -top-3 right-6 bg-white text-black">
                                        🔥 Mais Popular
                                    </Badge>
                                )}

                                <CardHeader>
                                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                                    <CardDescription className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="mb-8">
                                        <span className="text-5xl font-bold">{plan.price}</span>
                                        <span className={`text-xl ml-2 ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {plan.period}
                                        </span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${plan.popular ? 'bg-white text-black' : 'bg-black text-white'
                                                    }`}>
                                                    <Check className="w-4 h-4" />
                                                </div>
                                                <span className="text-base leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className={`w-full py-6 text-lg ${plan.popular
                                            ? 'bg-white text-black hover:bg-gray-100'
                                            : 'bg-black text-white hover:bg-gray-900'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-50" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <Badge variant="outline" className="mb-6 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                        🎉 Oferta de Lançamento
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Comece Grátis Hoje Mesmo</h2>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Teste todas as funcionalidades premium por 14 dias, sem cartão de crédito. Se não gostar, sem compromisso. Mas temos certeza que você vai amar.
                    </p>

                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-10 py-6">
                        Criar Minha Conta Grátis <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">Dúvidas Frequentes</p>
                        <h2 className="text-4xl md:text-5xl font-bold">Perguntas e Respostas</h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border-2 border-gray-800 rounded-xl overflow-hidden hover:border-white transition-colors"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-8 py-6 flex justify-between items-center text-left font-semibold text-lg hover:bg-white/5 transition-colors"
                                >
                                    {faq.question}
                                    <span className={`text-2xl transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                                        +
                                    </span>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96 pb-6' : 'max-h-0'
                                        }`}
                                >
                                    <p className="px-8 text-gray-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-white text-black border-t-2 border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">Sistema de Gestão</h3>
                            <p className="text-gray-600 leading-relaxed">
                                A plataforma completa para corretores de imóveis que querem multiplicar suas vendas com tecnologia e inteligência.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Produto</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Funcionalidades</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Preços</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Integrações</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Atualizações</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Suporte</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Central de Ajuda</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Tutoriais</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Status</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">API</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-8 text-center text-gray-600">
                        <p>&copy; 2025 Sistema de Gestão de Vendas. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}