import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MobileLayout from './components/layout/MobileLayout';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import { autoWarmUp, setupFocusWarmup } from './api/warmup';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Aumentado de 1 para 2
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  useEffect(() => {
    // Inicializa o warmup automático
    autoWarmUp();
    setupFocusWarmup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </MobileLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
