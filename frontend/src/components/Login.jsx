// D:\AspireVmodel2\frontend\src\components\Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Não precisamos mais importar 'api' diretamente aqui, pois o AuthContext já o utiliza.
import { AuthContext } from '../context/AuthContext'; // Importa AuthContext

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Usado para mensagens de erro/sucesso
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Pega a função de login do contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); // Limpa mensagens anteriores
    try {
      // **CHAMADA CORRETA:** Usa a função 'login' do AuthContext
      // Esta função já faz a chamada à API para '/api/users/login' e lida com o estado.
      await login(email, password);
      setMessage('Login bem-sucedido! Redirecionando...');
      navigate('/dashboard'); // Redireciona para o dashboard após login bem-sucedido
    } catch (error) {
      // O erro já é formatado pelo AuthContext para ser mais amigável
      setMessage(error.message || 'Erro inesperado ao fazer login.');
      console.error('Erro no login do componente Login:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>} {/* Exibe a mensagem de erro/sucesso */}
    </div>
  );
}

export default Login;