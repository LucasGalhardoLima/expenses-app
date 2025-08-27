import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

const breadcrumbMap: Record<string, string> = {
  '/': 'Home',
  '/transactions': 'Transações',
  '/categories': 'Categorias',
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className={cn(
              "inline-flex items-center text-sm font-medium text-black/70 hover:text-black transition-colors duration-200",
              location.pathname === '/' && "text-black"
            )}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const pageName = breadcrumbMap[routeTo] || pathname;

          return (
            <li key={routeTo}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-black/40" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-black md:ml-2">
                    {pageName}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="ml-1 text-sm font-medium text-black/70 hover:text-black md:ml-2 transition-colors duration-200"
                  >
                    {pageName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
