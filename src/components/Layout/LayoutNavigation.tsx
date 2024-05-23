import { CustomLink } from '../CustomLink';

interface LayoutNavigationProps {
  navigation: { name: string; href: string; icon: any }[];
  onClick: () => void;
}

interface ItemNavigationProps {
  name: string;
  href: string;
  icon: any;
}

export const LayoutNavigation = ({
  navigation,
  onClick,
}: LayoutNavigationProps) => {
  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="-mx-2 space-y-1">
            {navigation.map((item: ItemNavigationProps) => (
              <li key={item.name}>
                <CustomLink
                  to={item.href}
                  icon={item.icon}
                  //   onClick={() => setSidebarOpen(false)}
                  onClick={onClick}
                >
                  {item.name}
                </CustomLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
};
