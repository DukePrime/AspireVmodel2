import React from 'react';
import AuthForm from '../components/AuthForm.jsx';

function AuthPage({ onLoginSuccess }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">AspireVmodel2</h1>
      <AuthForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}

export default AuthPage;