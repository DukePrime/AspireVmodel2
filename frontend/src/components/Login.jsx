// D:\AspireVmodel2\frontend\src\components\Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Certifique-se que o caminho para 'api' está correto!
import { AuthContext } from '../context/AuthContext'; // Se estiver usando AuthContext

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Se estiver usando AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', { email, password });
      setMessage(response.data.message);
      login(response.data.token, response.data.user); // Se estiver usando AuthContext
      navigate('/'); // Redireciona para a home após o login
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro no login.');
      console.error('Erro no login:', error);
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
            autoComplete="email" // Adicionado para atender sugestão do Chrome
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
            autoComplete="current-password" // Adicionado para atender sugestão do Chrome
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;