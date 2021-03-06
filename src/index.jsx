import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import App from './App';
import ru from './i18n/ru.json';
import en from './i18n/en.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            ru: {
                translation: ru,
            },
        },
        lng: localStorage.getItem('paint-react-lang') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>,
);
