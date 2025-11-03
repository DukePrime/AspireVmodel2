// D:\AspireVmodel2\frontend\src\context\AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Inicializa o token e isAuthenticated lendo do localStorage apenas UMA VEZ
    // Usamos uma função para lazy initialization para evitar que localStorage seja lido em cada re-render
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

    // Usamos useCallback para 'logout' para garantir que sua referência seja estável
    // Isso é importante se 'logout' for uma dependência de outros efeitos ou memorizações
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null); // Limpa o token, o que acionará o useEffect abaixo para limpar o resto
        // Não é necessário chamar setIsAuthenticated(false) ou setUser(null) aqui diretamente,
        // pois o useEffect abaixo irá lidar com isso quando 'token' for null.
    }, []);

    // Efeito para sincronizar o estado global de autenticação quando o 'token' ou 'user' muda
    useEffect(() => {
        // console.log("AuthContext useEffect running. Token:", token, "User:", user ? user.username : "null");

        if (token) {
            // Se há um token, configure o cabeçalho Auth e defina isAuthenticated como true
            api.defaults.headers.common['x-auth-token'] = token;
            if (!isAuthenticated) { // Evita chamadas redundantes de setState que React pode otimizar, mas ajuda na clareza
                setIsAuthenticated(true);
            }

            // Tenta buscar o perfil do usuário se o token existir mas os dados do usuário não estiverem carregados
            if (!user) { // Verifica se 'user' já está carregado para evitar fetchs redundantes
                const fetchUserProfile = async () => {
                    try {
                        const res = await api.get('/api/users/profile'); // Endpoint presumido para buscar perfil do usuário
                        setUser(res.data);
                    } catch (err) {
                        console.error("Failed to fetch user profile:", err);
                        // Se falhar (ex: token expirado/inválido), desloga o usuário
                        handleLogout(); // Usa a função handleLogout para limpar tudo
                    }
                };
                fetchUserProfile();
            }
        } else {
            // Se não há token, limpe o cabeçalho Auth e defina isAuthenticated como false
            delete api.defaults.headers.common['x-auth-token'];
            if (isAuthenticated) { // Evita chamadas redundantes
                setIsAuthenticated(false);
            }
            if (user) { // Evita chamadas redundantes
                setUser(null); // Limpa o usuário
            }
        }
    }, [token, user, isAuthenticated, handleLogout]); // Depende de 'token' (para reagir a mudanças de login/logout)
                                                  // 'user' (para carregar o perfil apenas uma vez)
                                                  // 'isAuthenticated' (para evitar setState redundantes, embora React já otimize)
                                                  // 'handleLogout' (referência estável da função)

    const login = useCallback(async (email, password) => {
        try {
            console.log('Tentando login para URL:', api.defaults.baseURL + '/api/users/login'); // Linha 26
            const res = await api.post('/api/users/login', { email, password });
            const { token: newToken, user: userData } = res.data;

            localStorage.setItem('token', newToken);
            setToken(newToken); // Atualiza o estado do token, o que acionará o useEffect acima
            setUser(userData); // Define os dados do usuário
            // 'isAuthenticated' será definido pelo useEffect

            return { success: true };
        } catch (err) {
            console.error('Erro de login:', err.response?.data?.message || err.message);
            setIsAuthenticated(false); // Garante que seja false em caso de falha de login (provavelmente linha 56)
            return { success: false, message: err.response?.data?.message || 'Login falhou' };
        }
    }, []); // Nenhuma dependência externa que mude entre renders para esta função 'login'

    const register = useCallback(async (username, email, password) => {
        try {
            const res = await api.post('/api/users/register', { username, email, password }); // (Provavelmente linha 46)
            return { success: true, message: res.data.message };
        } catch (err) {
            console.error('Erro de registro:', err.response?.data?.message || err.message);
            return { success: false, message: err.response?.data?.message || 'Registro falhou' };
        }
    }, []); // Nenhuma dependência externa que mude entre renders para esta função 'register'

    // O useMemo otimiza o valor do contexto para evitar re-renderizações desnecessárias
    // Ele só recalcula o valor se user, isAuthenticated, ou as funções (que são useCallback, então estáveis) mudarem.
    const authContextValue = useMemo(() => ({
        user,
        isAuthenticated,
        login,
        register,
        logout: handleLogout, // Exporta handleLogout como 'logout' para o contexto
        token
    }), [user, isAuthenticated, login, register, handleLogout, token]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};