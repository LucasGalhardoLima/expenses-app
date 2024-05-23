import { Bars3Icon } from '@heroicons/react/24/outline';

interface LayoutMobileHeaderProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const LayoutMobileHeader = ({
  children,
  onClick,
}: LayoutMobileHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      {children}
    </div>
  );
};
