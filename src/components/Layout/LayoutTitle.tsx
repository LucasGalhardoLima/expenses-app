interface LayoutTitleProps {
    text: string;
}

export const LayoutTitle = ({ text }: LayoutTitleProps) => {
  return <h2 className="ml-2 text-lg font-semibold leading-6 text-gray-900">{text}</h2>;
}