

type LayoutProps = {
  children?: any;
  routing: any;
};

export const LayoutRoot = ({ children, routing }: LayoutProps) => {
  return (
    <>
      <div>
        {children}
        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{routing}</div>
        </main>
      </div>
    </>
  );
};
