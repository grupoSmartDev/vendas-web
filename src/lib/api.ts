// src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        const tenantKey = localStorage.getItem('tenantKey');

        console.log('📤 API Request:', {
            url: config.url,
            fullUrl: `${config.baseURL}${config.url}`,
            method: config.method?.toUpperCase(),
            hasToken: !!token,
            hasTenantKey: !!tenantKey,
        });

        // Adiciona token se existir
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 🆕 Adiciona tenantKey no header (opcional, mas útil para logs)
        if (tenantKey && !config.headers['x-tenant-key']) {
            config.headers['x-tenant-key'] = tenantKey;
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
        console.error('❌ API Error COMPLETO:', error);
        console.error('❌ API Error Details:', {
            message: error.message,
            code: error.code,
            response: error.response,
        });

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
                localStorage.removeItem('tenantKey'); // 🆕

                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            console.error('❌ Network Error:', {
                url: error.config?.url,
                message: 'Backend não está respondendo',
            });
        } else {
            console.error('❌ Setup Error:', error.message);
        }

        return Promise.reject(error);
    }
);