import React from "react";
import { useTranslation, Trans } from 'react-i18next';



const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto text-center" id="about">
      <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-full shadow mb-4 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60" height="60">
          <path d="M 20 50 C 20 30, 80 30, 80 50 C 80 70, 20 70, 20 50 Z" fill="#FFFFFF"/>
          <circle cx="40" cy="45" r="3" fill="#000000"/>
          <circle cx="60" cy="45" r="3" fill="#000000"/>
          <path d="M 15 40 C 5 30, 5 20, 15 20 C 25 20, 25 30, 15 40 Z" fill="#FFFFFF"/>
          <path d="M 85 40 C 95 30, 95 20, 85 20 C 75 20, 75 30, 85 40 Z" fill="#FFFFFF"/>
          <path d="M 10 25 C 5 20, 10 15, 15 20 Z" fill="#000000"/>
          <path d="M 90 25 C 95 20, 90 15, 85 20 Z" fill="#000000"/>
          <path d="M 25 65 C 15 75, 15 85, 25 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 35 70 C 25 80, 25 90, 35 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 75 65 C 85 75, 85 85, 75 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 65 70 C 75 80, 75 90, 65 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      <h2 className="text-4xl font-extrabold mb-4 text-red-500 drop-shadow">
        {t('about_title_full')}
      </h2>
      <p className="mb-4 text-lg text-gray-700 font-medium">
        <Trans i18nKey="about_paragraph"
          components={{
            1: <span className="font-bold text-red-500" />,
            2: <span className="text-orange-600 font-semibold" />,
            3: <span className="text-yellow-600 font-semibold" />
          }}
        />
      </p>
      <ul className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
        <li className="bg-white/80 border-l-4 border-red-500 px-6 py-3 rounded shadow text-left w-full md:w-auto font-semibold">{t('about_item_smart')}</li>
        <li className="bg-white/80 border-l-4 border-orange-500 px-6 py-3 rounded shadow text-left w-full md:w-auto font-semibold">{t('about_item_transparency')}</li>
        <li className="bg-white/80 border-l-4 border-yellow-500 px-6 py-3 rounded shadow text-left w-full md:w-auto font-semibold">{t('about_item_security')}</li>
      </ul>
    </section>
  );
};

export default About;