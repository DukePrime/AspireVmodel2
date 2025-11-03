// D:\AspireVmodel2\frontend\src\components\Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- CORREÇÃO AQUI: Importar 'useAuth'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- CORREÇÃO AQUI: Usar o hook 'useAuth' para obter a função 'login'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    const result = await login(email, password); // Chama a função de login do contexto

    if (result.success) {
      navigate('/'); // Redireciona para a página inicial (Home/Dashboard)
    } else {
      setError(result.message || 'Falha no login. Verifique suas credenciais.');
    }
  };

  const formStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      backgroundColor: '#f0f2f5',
    },
    form: {
      backgroundColor: '#e06666',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    heading: {
      marginBottom: '20px',
      color: 'white',
      textAlign: 'center',
    },
    label: {
      marginBottom: '5px',
      fontWeight: 'bold',
      color: 'white',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1em',
      boxSizing: 'border-box',
    },
    button: {
      backgroundColor: '#95130a',
      color: 'white',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1.1em',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    error: {
      color: '#dc3545',
      textAlign: 'center',
      marginTop: '10px',
      fontSize: '0.9em',
    },
    linkContainer: {
      textAlign: 'center',
      marginTop: '15px',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
    },
    linkHover: {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={formStyles.container}>
      <form onSubmit={handleSubmit} style={formStyles.form}>
        <h2 style={formStyles.heading}>Login</h2>
        <div>
          <label htmlFor="email" style={formStyles.label}>E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={formStyles.input}
          />
        </div>
        <div>
          <label htmlFor="password" style={formStyles.label}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={formStyles.input}
          />
        </div>
        {error && <p style={formStyles.error}>{error}</p>}
        <button type="submit" style={formStyles.button}>Entrar</button>
        <div style={formStyles.linkContainer}>
          Não tem uma conta? <Link to="/register" style={formStyles.link}>Registre-se aqui</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;