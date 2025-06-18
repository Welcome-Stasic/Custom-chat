import React from 'react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner-container">
        <div className="spinner-outer"></div>
        <div className="spinner-inner"></div>
      </div>
      
      <div className="text-container">
        <h1 className="title">Идет загрузка</h1>
        <div className="text-change">
          <p>Подготавливаем чат...</p>
          <p>Загружаем сообщения...</p>
          <p>Проверяем соединение...</p>
        </div>
      </div>
      
      <div className="dots-container">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="dot"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;