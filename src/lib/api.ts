// src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TENANT_KEY = process.env.NEXT_PUBLIC_TENANT_KEY || '12345678900';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-tenant-key': TENANT_KEY,
    },
});

// Interceptor de Request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        console.log('📤 API Request:', {
            url: config.url,
            fullUrl: `${config.baseURL}${config.url}`,
            method: config.method?.toUpperCase(),
            hasToken: !!token,
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!config.headers['x-tenant-key']) {
            config.headers['x-tenant-key'] = TENANT_KEY;
        }

        return config;
    },
    (error) => {
        console.error('❌ Erro no request interceptor:', error);
        return Promise.reject(error);
    }
);

// Interceptor de Response
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
        });
        return response;
    },
    (error) => {
        // ⚠️ LOG COMPLETO DO ERRO
        console.error('❌ API Error COMPLETO:', error);
        console.error('❌ API Error Details:', {
            message: error.message,
            code: error.code,
            config: error.config,
            request: error.request,
            response: error.response,
            stack: error.stack,
        });

        // Se tem response (erro HTTP)
        if (error.response) {
            console.error('❌ HTTP Error:', {
                url: error.config?.url,
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
            });

            if (error.response.status === 401) {
                console.log('❌ 401 - Limpando tokens...');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        // Se não tem response (erro de rede)
        else if (error.request) {
            console.error('❌ Network Error - Requisição foi feita mas sem resposta:', {
                url: error.config?.url,
                message: 'Backend não está respondendo ou CORS bloqueando',
            });
        }
        // Erro antes da requisição
        else {
            console.error('❌ Setup Error:', error.message);
        }

        return Promise.reject(error);
    }
);