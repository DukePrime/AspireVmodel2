// D:\AspireVmodel2\frontend\src\context\AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const url = '/api/users/login';
      console.log('Tentando login para URL:', api.defaults.baseURL + url);
      const response = await api.post(url, { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Erro na função login do AuthContext:', error);
      throw new Error(error.response?.data?.message || 'Falha na autenticação. Verifique suas credenciais.');
    }
  };

  // --- NOVA FUNÇÃO DE REGISTRO ---
  const register = async (name, email, password) => {
    try {
      const url = '/api/users/register'; // <--- URL CORRETA PARA O BACKEND
      console.log('Tentando registro para URL:', api.defaults.baseURL + url);
      const response = await api.post(url, { name, email, password }); // Envia name, email, password
      const { token: receivedToken, user: receivedUser } = response.data;

      // Após o registro, já logamos o usuário
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Erro na função register do AuthContext:', error);
      throw new Error(error.response?.data?.message || 'Falha no registro.');
    }
  };
  // --- FIM DA NOVA FUNÇÃO DE REGISTRO ---

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const value = {
    token,
    user,
    isAuthenticated,
    login,
    register, // <--- EXPORTE A NOVA FUNÇÃO AQUI!
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);