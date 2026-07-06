import React from 'react';
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
import ProductView from './components/pages/AdminPanel/productmanagement/ProductView.tsx';
import Dashboard from './components/pages/AdminPanel/Dashboard/Dashboard.tsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><Layout></Layout></PrivateRoute>,
    children: [
      {
        index : true,
        element : <Dashboard></Dashboard>
      },
      {
        path: '/user-register',
        element: <PrivateRoute allowedRoles={['ADMIN']}><UserManagement></UserManagement></PrivateRoute>
      },
      {
        path: '/manage-products',
        element: <PrivateRoute allowedRoles={['ADMIN','MANAGER']}><ProductManagement></ProductManagement></PrivateRoute>
      },
      {
        path: '/create-sales',
        element: <PrivateRoute allowedRoles={['ADMIN','MANAGER','EMPLOYEE']}><Sales></Sales></PrivateRoute>
      },
      {
        path: '/view-products',
        element: <PrivateRoute allowedRoles={['ADMIN','MANAGER','EMPLOYEE']}><ProductView></ProductView></PrivateRoute>
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
