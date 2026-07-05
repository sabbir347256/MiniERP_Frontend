import React  from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthContext from './components/AuthProvider/AuthContext.tsx';
import Layout from './components/pages/Layout/Layout.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout></Layout>,
    children: [

    ]
  },
  // {
  //   path: '/user-login',
  //   element: <UserLogin></UserLogin>
  // }
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
