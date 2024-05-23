import { Routes, Route } from 'react-router-dom';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import './App.css';
import { Home } from './pages/Home';
import { NoMatch } from './pages/NoMatch';
import { Layout } from './components/Layout';
import { Expenses } from './pages/Expenses';
import { Income } from './pages/Income';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: ArrowTrendingDownIcon,
    current: false,
  },
  { name: 'Income', href: '/income', icon: CurrencyDollarIcon, current: false },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSideBar = () => {
    setSidebarOpen(false);
  };

  const handleOpenSideBar = () => {
    setSidebarOpen(true);
  };

  return (
    <Layout.Root
      routing={
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      }
    >
      <Layout.Desktop>
        <Layout.Header>
          <Layout.Logo logo="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" />
          <Layout.Title text="Dashboard" />
        </Layout.Header>
        <Layout.Navigation
          navigation={navigation}
          onClick={handleCloseSideBar}
        />
      </Layout.Desktop>

      <Layout.MobileHeader title="Dashboard" onClick={handleOpenSideBar} />

      <Layout.Mobile show={sidebarOpen} onClose={handleCloseSideBar}>
        <Layout.Header>
          <Layout.Logo logo="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" />
        </Layout.Header>
        <Layout.Navigation
          navigation={navigation}
          onClick={handleCloseSideBar}
        />
      </Layout.Mobile>
    </Layout.Root>
  );
}

export default App;
