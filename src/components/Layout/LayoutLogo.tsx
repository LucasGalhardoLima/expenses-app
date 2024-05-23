interface LayoutLogoProps {
  logo: string;
}

export const LayoutLogo = ({ logo }: LayoutLogoProps) => {
  return <img className="h-8 w-auto" src={logo} alt="Your Company" />;
};
