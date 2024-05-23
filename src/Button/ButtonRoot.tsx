interface ButtonRootProps {
  children: React.ReactNode;
}

export const ButtonRoot = ({ children }: ButtonRootProps) => {
  return (
    <button className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      {children}
    </button>
  );
};
