'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, User, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import {
    formatCpfOrCnpj,
    formatPhone,
    isValidCpfOrCnpj,
    isValidEmail,
    getPasswordErrorMessage,
} from '@/lib/validations';

// ========================================
// TIPOS
// ========================================

interface FormData {
    nome: string;
    cnpjCpf: string;
    razaoSocial: string;
    email: string;
    telefone: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
    adminPasswordConfirm: string;
    adminPhone: string;
    adminCpf: string;
}

interface FormErrors {
    nome?: string;
    cnpjCpf?: string;
    email?: string;
    adminName?: string;
    adminEmail?: string;
    adminPassword?: string;
    adminPasswordConfirm?: string;
    adminCpf?: string;
}

interface Credentials {
    tenantKey: string;
    adminEmail: string;
    message: string;
}

// ========================================
// COMPONENTE
// ========================================

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<FormData>({
        nome: '',
        cnpjCpf: '',
        razaoSocial: '',
        email: '',
        telefone: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        adminPasswordConfirm: '',
        adminPhone: '',
        adminCpf: '',
    });

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        // Validações da Imobiliária
        if (formData.nome.length < 3) {
            newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
        }

        const cnpjCpfNumbers = formData.cnpjCpf.replace(/\D/g, '');
        if (!isValidCpfOrCnpj(cnpjCpfNumbers)) {
            newErrors.cnpjCpf = 'CPF ou CNPJ inválido';
        }

        if (!isValidEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        // Validações do Admin
        if (formData.adminName.length < 3) {
            newErrors.adminName = 'Nome deve ter no mínimo 3 caracteres';
        }

        if (!isValidEmail(formData.adminEmail)) {
            newErrors.adminEmail = 'Email inválido';
        }

        const passwordError = getPasswordErrorMessage(formData.adminPassword);
        if (passwordError) {
            newErrors.adminPassword = passwordError;
        }

        if (formData.adminPassword !== formData.adminPasswordConfirm) {
            newErrors.adminPasswordConfirm = 'As senhas não coincidem';
        }

        // Valida CPF do admin se preenchido
        if (formData.adminCpf) {
            const cpfNumbers = formData.adminCpf.replace(/\D/g, '');
            if (cpfNumbers.length > 0 && !isValidCpfOrCnpj(cpfNumbers)) {
                newErrors.adminCpf = 'CPF inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Por favor, corrija os erros no formulário');
            return;
        }

        setIsLoading(true);

        try {
            // Remove máscaras APENAS do CPF/CNPJ
            // Telefones devem ir COM máscara: (11) 99999-9999
            const payload = {
                nome: formData.nome,
                cnpjCpf: formData.cnpjCpf.replace(/\D/g, ''),
                razaoSocial: formData.razaoSocial || undefined,
                email: formData.email,
                telefone: formData.telefone || undefined,  // ✅ COM máscara
                adminName: formData.adminName,
                adminEmail: formData.adminEmail,
                adminPassword: formData.adminPassword,
                adminPhone: formData.adminPhone || undefined,  // ✅ COM máscara
                adminCpf: formData.adminCpf?.replace(/\D/g, '') || undefined,
            };

            console.log('📤 Enviando dados de registro:', payload);

            // Chama service
            const result = await authService.registerTenant(payload);

            console.log('✅ Tenant criado com sucesso!', result);

            setCredentials(result.credentials);
            setSuccess(true);

            toast.success('Conta criada com sucesso!', {
                description: 'Você será redirecionado para o login em alguns segundos...',
            });

            // Redireciona após 5 segundos
            setTimeout(() => {
                window.location.href = '/login';
            }, 5000);

        } catch (error: any) {
            console.error('❌ Erro ao criar conta:', error);

            // Tratamento de erro da API
            if (error?.response?.data?.message) {
                toast.error('Erro ao criar conta', {
                    description: error.response.data.message,
                });
            } else if (error?.message) {
                toast.error('Erro ao criar conta', {
                    description: error.message,
                });
            } else {
                toast.error('Erro inesperado', {
                    description: 'Ocorreu um erro ao criar sua conta. Tente novamente.',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Conta Criada com Sucesso!</CardTitle>
                        <CardDescription>
                            Sua imobiliária foi cadastrada no sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                <div className="space-y-2">
                                    <p className="font-semibold">Suas credenciais de acesso:</p>
                                    <div className="bg-gray-50 p-3 rounded text-sm">
                                        <p><strong>Chave do Tenant:</strong> {credentials?.tenantKey}</p>
                                        <p><strong>Email:</strong> {credentials?.adminEmail}</p>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Você será redirecionado para o login em alguns segundos...
                                    </p>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => window.location.href = '/login'}
                        >
                            Ir para o Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Cadastre sua Imobiliária</CardTitle>
                    <CardDescription>
                        Preencha os dados abaixo para começar seu trial gratuito
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* DADOS DA IMOBILIÁRIA */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                            <Building2 className="h-5 w-5" />
                            <span>Dados da Imobiliária</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome da Imobiliária *</Label>
                                <Input
                                    id="nome"
                                    placeholder="Imobiliária XYZ"
                                    value={formData.nome}
                                    onChange={(e) => handleChange('nome', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.nome && (
                                    <p className="text-sm text-red-600">{errors.nome}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cnpjCpf">CPF/CNPJ *</Label>
                                <Input
                                    id="cnpjCpf"
                                    placeholder="43610517808 ou 12345678000199"
                                    value={formData.cnpjCpf}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        handleChange('cnpjCpf', formatCpfOrCnpj(value));
                                    }}
                                    disabled={isLoading}
                                />
                                {errors.cnpjCpf && (
                                    <p className="text-sm text-red-600">{errors.cnpjCpf}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email da Empresa *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contato@imobiliaria.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    placeholder="(11) 99999-9999"
                                    value={formData.telefone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        handleChange('telefone', formatPhone(value));
                                    }}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="razaoSocial">Razão Social</Label>
                                <Input
                                    id="razaoSocial"
                                    placeholder="Imobiliária XYZ LTDA"
                                    value={formData.razaoSocial}
                                    onChange={(e) => handleChange('razaoSocial', e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* DADOS DO ADMINISTRADOR */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                            <User className="h-5 w-5" />
                            <span>Dados do Administrador</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="adminName">Nome Completo *</Label>
                                <Input
                                    id="adminName"
                                    placeholder="João Silva"
                                    value={formData.adminName}
                                    onChange={(e) => handleChange('adminName', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.adminName && (
                                    <p className="text-sm text-red-600">{errors.adminName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminEmail">Email *</Label>
                                <Input
                                    id="adminEmail"
                                    type="email"
                                    placeholder="joao@imobiliaria.com"
                                    value={formData.adminEmail}
                                    onChange={(e) => handleChange('adminEmail', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.adminEmail && (
                                    <p className="text-sm text-red-600">{errors.adminEmail}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminPassword">Senha *</Label>
                                <Input
                                    id="adminPassword"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.adminPassword}
                                    onChange={(e) => handleChange('adminPassword', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.adminPassword && (
                                    <p className="text-sm text-red-600">{errors.adminPassword}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminPasswordConfirm">Confirmar Senha *</Label>
                                <Input
                                    id="adminPasswordConfirm"
                                    type="password"
                                    placeholder="Digite a senha novamente"
                                    value={formData.adminPasswordConfirm}
                                    onChange={(e) => handleChange('adminPasswordConfirm', e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.adminPasswordConfirm && (
                                    <p className="text-sm text-red-600">{errors.adminPasswordConfirm}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminPhone">Telefone</Label>
                                <Input
                                    id="adminPhone"
                                    placeholder="(11) 99999-9999"
                                    value={formData.adminPhone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        handleChange('adminPhone', formatPhone(value));
                                    }}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminCpf">CPF</Label>
                                <Input
                                    id="adminCpf"
                                    placeholder="43610517808"
                                    value={formData.adminCpf}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                                        handleChange('adminCpf', value);
                                    }}
                                    maxLength={11}
                                    disabled={isLoading}
                                />
                                {errors.adminCpf && (
                                    <p className="text-sm text-red-600">{errors.adminCpf}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Criando sua conta...
                            </>
                        ) : (
                            'Criar Conta Gratuita'
                        )}
                    </Button>

                    <p className="text-sm text-center text-gray-600">
                        Já tem uma conta?{' '}
                        <a href="/login" className="text-blue-600 hover:underline font-semibold">
                            Faça login
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}