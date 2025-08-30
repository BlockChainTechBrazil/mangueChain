import React from "react";
import { useTranslation, Trans } from 'react-i18next';

const HowToDonate: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto text-center" id="how-to-donate">
      <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full shadow mb-4 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"></polyline>
          <rect x="2" y="7" width="20" height="5"></rect>
          <line x1="12" y1="22" x2="12" y2="7"></line>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
      </div>
      <h2 className="text-4xl font-extrabold mb-4 text-red-500 drop-shadow">
        {t('how_to_donate_title').split(' ')[0]}{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          {t('how_to_donate_title').split(' ')[1] || ''}
        </span>
      </h2>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="w-full max-w-xl bg-white/80 rounded-lg shadow p-6">
          <ol className="list-decimal ml-6 text-base space-y-2 text-left">
            <li>
              <Trans i18nKey="how_to_donate_step1"
                components={{ 1: <span className="font-semibold text-red-500" /> }}
              />
            </li>
            <li>
              <Trans i18nKey="how_to_donate_step2"
                components={{ 1: <span className="font-semibold text-red-500" /> }}
              />
            </li>
            <li>
              <Trans i18nKey="how_to_donate_step3"
                components={{ 1: <span className="font-semibold text-red-500" /> }}
              />
            </li>
            <li>
              <Trans i18nKey="how_to_donate_step4"
                components={{ 1: <span className="font-semibold text-red-500" /> }}
              />
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowToDonate;