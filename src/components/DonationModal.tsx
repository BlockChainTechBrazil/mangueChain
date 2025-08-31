import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DonationModal: React.FC<DonationModalProps> = ({ open, onClose, children }) => {
  const [showCoin, setShowCoin] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setShowCoin(true);
      const timer = setTimeout(() => setShowCoin(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowCoin(true);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-3xl shadow-2xl p-0 max-w-lg w-full animate-fade-in">
        <button
          className="absolute top-4 right-4 text-2xl text-red-500 hover:text-red-700 font-bold z-10"
          onClick={onClose}
          aria-label={t('close', 'Fechar')}
        >
          ×
        </button>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          {showCoin ? (
            <img
              src="/crabtoken.gif"
              alt={t('spinning_coin', 'Moeda girando')}
              className="w-32 h-32 animate-spin-slow mb-6"
              style={{ animation: 'spin 2s linear infinite' }}
            />
          ) : (
            children
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DonationModal;
