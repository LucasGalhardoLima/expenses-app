import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from './translations';

const i18nConfig = {
  resources: translations,
  fallbackLng: 'pt-BR',
  defaultNS: 'translations',
};

i18n.use(initReactI18next).init(i18nConfig);

export default i18n;
