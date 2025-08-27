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
import Breadcrumb from '../ui/Breadcrumb';

interface SidebarProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Transações', href: '/transactions', icon: CreditCard },
  { name: 'Categorias', href: '/categories', icon: Tag },
];

export default function DashboardLayout({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen flex bg-snow">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Mobile sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#72DDF7] border-r border-[#5BBDE3]">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 bg-white/10 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <TrendingUp className="h-8 w-8 text-white" />
                <span className="ml-3 text-xl font-semibold text-white">
                  Expense Tracker
                </span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-white/20 text-white border-r-2 border-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white',
                        'group flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-white' : 'text-white/70 group-hover:text-white',
                          'mr-4 flex-shrink-0 h-5 w-5'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div 
            className="flex flex-col h-0 flex-1 border-r shadow-sm"
            style={{ backgroundColor: '#72DDF7', borderRightColor: '#5BBDE3' }}
          >
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <TrendingUp className="h-8 w-8 text-white" />
                <span className="ml-3 text-xl font-semibold text-white">
                  Expense Tracker
                </span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-white/20 text-white border-r-2 border-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white',
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-white' : 'text-white/70 group-hover:text-white',
                          'mr-3 flex-shrink-0 h-5 w-5'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden bg-snow">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-sky-blue/10">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-lg text-black/70 hover:text-black hover:bg-sky-blue/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-blue/50 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Breadcrumb />
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
