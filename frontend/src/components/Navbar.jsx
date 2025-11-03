// D:\AspireVmodel2\frontend\src\components\Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Certifique-se de que o caminho está correto

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  const navStyles = {
    nav: {
      backgroundColor: '#95130A',
      padding: '10px 20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ul: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      gap: '20px',
    },
    li: {
      display: 'inline',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      transition: 'background-color 0.3s ease',
    },
    linkHover: {
      backgroundColor: '#555',
    },
    authSection: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#dc3545', // Cor vermelha para logout
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9em',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#c82333',
    },
    userName: {
      marginRight: '10px',
      fontWeight: 'bold',
    }
  };

  return (
    <nav style={navStyles.nav}>
      <ul style={navStyles.ul}>
        <li style={navStyles.li}><Link to="/" style={navStyles.link}>Home</Link></li>
        {isAuthenticated && ( // Mostra o link de requisitos apenas se estiver autenticado
          <li style={navStyles.li}><Link to="/requirements" style={navStyles.link}>Meus Requisitos</Link></li>
        )}
      </ul>
      <div style={navStyles.authSection}>
        {isAuthenticated ? (
          <>
            {/* <span style={navStyles.userName}>Bem-vindo, {user.name}!</span>  // Você pode adicionar o nome do usuário aqui */}
            <button onClick={handleLogout} style={navStyles.button}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" style={navStyles.link}>Login</Link>
            <Link to="/register" style={navStyles.link}>Registrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;