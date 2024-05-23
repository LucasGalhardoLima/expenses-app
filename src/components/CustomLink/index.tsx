import { Link, useMatch, useResolvedPath } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { classNames } from "../../utils/classnames";

interface CustomLinkProps extends LinkProps {
  icon: any;
}

export const CustomLink = ({
  children,
  to,
  icon: Icon,
  onClick,
  ...props
}: CustomLinkProps) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link
        className={classNames(
          match
            ? "bg-gray-50 text-indigo-600"
            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
        )}
        to={to}
        onClick={onClick}
        {...props}
      >
        <Icon
          className={classNames(
            match
              ? "text-indigo-600"
              : "text-gray-400 group-hover:text-indigo-600",
            "h-6 w-6 shrink-0"
          )}
          aria-hidden="true"
        />
        {children}
      </Link>
    </div>
  );
};
