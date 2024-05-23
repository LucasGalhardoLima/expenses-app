interface ButtonContentProps {
  text: string;
}

export const ButtonContent = ({ text }: ButtonContentProps) => {
  return <span>{text}</span>;
};
