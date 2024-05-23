interface LayoutMobileHeaderTitleProps {
  text: string;
}

export const LayoutMobileHeaderTitle = ({
  text,
}: LayoutMobileHeaderTitleProps) => {
  return (
    <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
      {text}
    </div>
  );
};
