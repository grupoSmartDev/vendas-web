// lib/validations.ts

/**
 * Valida CPF usando o algoritmo oficial
 */
export function isValidCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
}

/**
 * Valida CNPJ usando o algoritmo oficial
 */
export function isValidCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');

    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    // Validação do primeiro dígito verificador
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    // Validação do segundo dígito verificador
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
}

/**
 * Valida CPF ou CNPJ automaticamente
 */
export function isValidCpfOrCnpj(value: string): boolean {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 11) {
        return isValidCPF(numbers);
    }

    if (numbers.length === 14) {
        return isValidCNPJ(numbers);
    }

    return false;
}

/**
 * Formata CPF: 123.456.789-10
 */
export function formatCPF(cpf: string): string {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ: 12.345.678/0001-90
 */
export function formatCNPJ(cnpj: string): string {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF ou CNPJ automaticamente
 */
export function formatCpfOrCnpj(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 11) {
        return formatCPF(numbers);
    }

    return formatCNPJ(numbers);
}

/**
 * Formata telefone: (11) 99999-9999 ou (11) 9999-9999
 */
export function formatPhone(phone: string): string {
    const numbers = phone.replace(/\D/g, '');

    if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida senha forte
 * Mínimo 6 caracteres, pelo menos uma maiúscula, uma minúscula e um número
 */
export function isValidPassword(password: string): boolean {
    if (password.length < 6) return false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * Retorna mensagem de erro para senha
 */
export function getPasswordErrorMessage(password: string): string | null {
    if (password.length < 6) {
        return 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!/[A-Z]/.test(password)) {
        return 'Senha deve conter pelo menos uma letra maiúscula';
    }

    if (!/[a-z]/.test(password)) {
        return 'Senha deve conter pelo menos uma letra minúscula';
    }

    if (!/\d/.test(password)) {
        return 'Senha deve conter pelo menos um número';
    }

    return null;
}