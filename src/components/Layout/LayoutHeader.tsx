interface LayoutHeaderProps {
  children: React.ReactNode;
}

export const LayoutHeader = ({ children }: LayoutHeaderProps) => {
  return <div className="flex h-16 shrink-0 items-center">{children}</div>;
};
