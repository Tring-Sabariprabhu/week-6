import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals.js';
import { UserProvider } from './Context/UserContext.js';
import { ToastContainer } from 'react-toastify';
import ApolloWrapper from './ApolloClient/backendConnect.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloWrapper>
      <UserProvider>
        <App />
        <ToastContainer position="top-right"/>
      </UserProvider>
    </ApolloWrapper>
  </React.StrictMode>
);


reportWebVitals();
