import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './pages/AuthContext.jsx'; // Import it

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your App */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);