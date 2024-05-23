import { useTranslation } from 'react-i18next';

export const Income: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('income.title')}</h1>
    </div>
  );
};
