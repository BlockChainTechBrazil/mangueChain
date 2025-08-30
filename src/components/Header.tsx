import React from "react";
import LanguageSelector from './LanguageSelector';
import ConnectWallet from "./ConnectWallet";
import { useDonation } from '../hooks/useDonation';

const crabLogo = "/Crab.png";

// Toast de notificação
const Toast: React.FC<{ msg: string; type: 'success' | 'error'; onClose: () => void }> = ({ msg, type, onClose }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-semibold shadow-lg text-white flex items-center gap-3 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
    role="alert">
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 text-white text-xl leading-none">×</button>
  </div>
);

const Header: React.FC<{ toastMsg?: string; toastType?: 'success' | 'error'; onToastClose?: () => void }> = ({ toastMsg, toastType, onToastClose }) => {
  const { address, setAddress, walletBalance } = useDonation();
  return (
    <>
      {/* Toast de notificação */}
      {toastMsg && toastType && onToastClose && (
        <Toast msg={toastMsg} type={toastType} onClose={onToastClose} />
      )}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur shadow-lg flex justify-between items-center px-8 py-6 border-b border-red-300">
        <div className="flex items-center gap-3">
          <img src={crabLogo} alt="Logo MangueChain" className="w-16 h-16 rounded-lg shadow border-2 border-red-200 bg-white object-contain" />
          <span className="text-4xl font-extrabold text-red-500 tracking-tight drop-shadow-sm">MangueChain</span>
        </div>
        <nav className="md:flex gap-6 mx-8">
          <a href="#oque-e-o-mangue" className="text-lg font-bold text-red-600 hover:text-red-800 transition-colors">O que é o mangue</a>
          <a href="#por-que-preservar" className="text-lg font-bold text-red-600 hover:text-red-800 transition-colors">Por que preservar</a>
          <a href="#organizacoes" className="text-lg font-bold text-red-600 hover:text-red-800 transition-colors">Organizações</a>
          <a href="#mobilizacao" className="text-lg font-bold text-red-600 hover:text-red-800 transition-colors">Mobilização</a>
          <a href="#prova-social" className="text-lg font-bold text-red-600 hover:text-red-800 transition-colors">Prova social</a>
        </nav>
        <div className="flex items-center gap-4">
          {/* Exibe endereço e saldo quando conectado */}
          {address && (
            <span className="text-base font-semibold text-red-600 bg-red-100 rounded-lg px-3 py-1">
              {`${address}: ${walletBalance === "-" ? "..." : `${Number(walletBalance).toFixed(2)} ETH`}`}
            </span>
          )}
          <ConnectWallet onConnect={setAddress} address={address} />
          {/* Seletor de idioma com bandeira */}
          <LanguageSelector />
        </div>
      </header>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default Header;