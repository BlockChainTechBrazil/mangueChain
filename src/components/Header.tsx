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
  const { address, setAddress } = useDonation();
  // Removido estado de modal de doação
  return (
    <>
      {/* Toast de notificação */}
      {toastMsg && toastType && onToastClose && (
        <Toast msg={toastMsg} type={toastType} onClose={onToastClose} />
      )}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur shadow-lg flex justify-between items-center px-4 md:px-8 py-4 md:py-6 border-b border-red-300">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <img src={crabLogo} alt="Logo MangueChain" className="w-12 h-12 md:w-16 md:h-16 rounded-lg shadow border-2 border-red-200 bg-white object-contain" />
            <span className="text-2xl md:text-4xl font-extrabold text-red-500 tracking-tight drop-shadow-sm">MangueChain</span>
          </a>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <MobileMenu>
            <ConnectWallet onConnect={setAddress} address={address} />
            <LanguageSelector />
          </MobileMenu>
        </div>
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <ConnectWallet onConnect={setAddress} address={address} />
          <LanguageSelector />
        </div>
      </header>
      {/* Modal de doação removido */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @media (max-width: 768px) {
          .mobile-menu-content {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            min-width: 180px;
            z-index: 50;
            border: 1px solid #fecaca;
          }
        }

      `}</style>
    </>
  );
};

// Componente MobileMenu para menu hamburguer responsivo
const MobileMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);
  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-md border border-red-200 bg-white text-red-500 shadow-md focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open && (
        <div className="mobile-menu-content flex flex-col gap-2 mt-2 p-2">
          {children}
        </div>
      )}
    </div>
  );
};
export default Header;