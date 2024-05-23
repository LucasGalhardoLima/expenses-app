import { useTranslation } from 'react-i18next';

export const Expenses: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('expenses.title')}</h1>
    </div>
  );
};
