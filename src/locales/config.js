import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import publicUS from './en-US/public.json';
import publicCN from './zh-CN/public.json';

const resources = {
    "zh-CN": {
        translation: publicCN,
    },
    "en-US": {
        translation: publicUS,
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en-US',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
