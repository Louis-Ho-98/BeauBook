import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin, LoginCredentials } from '@/types';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
    admin: Admin | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsLoading(false);
                return;
            }

            const adminData = await authApi.getProfile();
            setAdmin(adminData);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authApi.login(credentials);
            if (response.success && response.admin) {
                setAdmin(response.admin);
                toast.success('Login successful!');
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Invalid credentials');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAdmin(null);
            toast.success('Logged out successfully');
        }
    };

    const value: AuthContextType = {
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;