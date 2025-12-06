import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { router } from "@/router"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      gcTime: 1000 * 60 * 10,
    },
  },
});

import './styles.css';
import reportWebVitals from './reportWebVitals.ts';

const rootElement = document.getElementById('app');

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}

reportWebVitals();
