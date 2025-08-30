import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

interface DonateFormProps {
  onDonate?: (amount: string) => void;
  disabled?: boolean;
}

const DonateForm: React.FC<DonateFormProps> = ({ onDonate, disabled }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      alert(t('donate_form_invalid_amount_alert'));
      return;
    }
    if (onDonate) {
      onDonate(amount);
    }
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center max-w-sm mx-auto bg-white/90 rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="amount" className="text-left font-semibold text-red-500">{t('donate_form_title')}</label>
        <input
          id="amount"
          type="text"
          placeholder={t('donate_form_placeholder')}
          className="border-2 border-red-500/30 focus:border-red-500 rounded px-4 py-2 w-full text-lg transition-all outline-none bg-white"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={disabled}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m0 0l-3-3m3 3l3-3" />
        </svg>
        {t('donate_form_button')}
      </button>
    </form>
  );
};

export default DonateForm;