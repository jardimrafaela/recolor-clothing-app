import React from 'react';
import ReactDOM from 'react-dom/client'; // Use a nova API de renderização
import './App.css';
import RecolorTool from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecolorTool />
  </React.StrictMode>
);

