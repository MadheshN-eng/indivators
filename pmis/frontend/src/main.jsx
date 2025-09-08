import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import InternshipsPage from './InternshipsPage.jsx';
import '../../styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <InternshipsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ]
  }
]);
 
 ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
     <RouterProvider router={router} />
   </React.StrictMode>,
 )