import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err: any) {
      console.error(err);
      
      let errorMessage = 'Ошибка входа';
      if (err.code === 'auth/invalid-email') {
        errorMessage = 'Некорректный email';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Пользователь не найден';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Неверный пароль';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Слишком много попыток. Попробуйте позже';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <div className="login-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
        
        <h1 className="login-title">Наш Личный Чат</h1>
        <p className="login-subtitle">Только для нас двоих</p>
        
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-form-label" htmlFor="email">
              Ваш Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="Ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="login-form-group">
            <label className="login-form-label" htmlFor="password">
              Секретный код
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Ваш секретный код"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="error-message" style={{
              color: '#e53e3e',
              backgroundColor: '#fff5f5',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Вход...</span>
            ) : (
              <span>Войти в чат</span>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Это наш личный чат, здесь только мы двое.</p>
          <p>Используйте один и тот же email и пароль на двух устройствах</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;