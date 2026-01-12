import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/auth.service';
import type { AccountResponse } from '../types/api';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AccountResponse['data'] | null;
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<AccountResponse['data'] | null>(null);

    const refreshUser = async () => {
        try {
            const response = await authService.getAccount();
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const login = (token: string) => {
        authService.login(token);
        setIsAuthenticated(true);
        refreshUser();
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    // Verificar autenticación al cargar
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('auth_token');

                if (token) {
                    await refreshUser();
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
