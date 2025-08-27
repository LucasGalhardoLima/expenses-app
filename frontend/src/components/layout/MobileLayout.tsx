import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Tag, 
  Menu, 
  X,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/', icon: Home, label: 'Dashboard' },
  { name: 'Transactions', href: '/transactions', icon: CreditCard, label: 'Transações' },
  { name: 'Categories', href: '/categories', icon: Tag, label: 'Categorias' },
];

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-snow flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-primary/10 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 rounded-lg text-black/70 hover:text-black hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <TrendingUp className="h-7 w-7 text-primary" />
              <span className="ml-2 text-lg font-semibold text-primary">
                Expenses
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-secondary border-r border-primary/10 shadow-sm">
          <div className="flex items-center flex-shrink-0 px-6 py-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="ml-3 text-xl font-semibold text-primary">
              Expense Tracker
            </span>
          </div>
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-black/70 hover:bg-primary/5 hover:text-black'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-primary' : 'text-black/50 group-hover:text-black/70'
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-secondary border-r border-primary/10">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50 bg-white/10 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <span className="ml-3 text-xl font-semibold text-primary">
                  Expense Tracker
                </span>
              </div>
              <nav className="mt-8 px-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'text-black/70 hover:bg-primary/5 hover:text-black'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          'mr-4 flex-shrink-0 h-6 w-6',
                          isActive ? 'text-primary' : 'text-black/50 group-hover:text-black/70'
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="min-h-full">
          <div className="px-4 py-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary/10 px-4 py-2 safe-area-pb shadow-lg">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0',
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-black/50 hover:text-black/70 hover:bg-primary/5'
                )}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
