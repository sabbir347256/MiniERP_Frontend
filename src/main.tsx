import React  from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthContext from './components/AuthProvider/AuthContext.tsx';
import Layout from './components/pages/Layout/Layout.tsx';
import UserManagement from './components/pages/AdminPanel/UserManagement/UserManagement.tsx';
import Login from './components/pages/Authentication/Login.tsx';
import ProductManagement from './components/pages/AdminPanel/productmanagement/ProductManagement.tsx';
import Sales from './components/pages/AdminPanel/SalesManagement/Sales.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout></Layout>,
    children: [
        {
          path : '/user-register',
          element : <UserManagement></UserManagement>
        },
        {
          path : '/manage-products',
          element : <ProductManagement></ProductManagement>
        },
        {
          path : '/create-sales',
          element : <Sales></Sales>
        },
    ]
  },
  {
    path: '/user-login',
    element: <Login></Login>
  }
]);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthContext>
      <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
      </React.StrictMode>
    </AuthContext>
  </QueryClientProvider>,
)
