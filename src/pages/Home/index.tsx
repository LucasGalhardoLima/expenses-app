import { useTranslation } from 'react-i18next';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
    </div>
  );
};
