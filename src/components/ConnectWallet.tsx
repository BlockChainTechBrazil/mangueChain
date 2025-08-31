
// Declaração global para window.ethereum
declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ethers } from "ethers";

const walletIcon = (
  <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2m2-4h-6m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </svg>
);

const ConnectWallet: React.FC<{ onConnect: (address: string | null) => void, address: string | null }> = ({ onConnect, address }) => {
  const navigate = useNavigate();
  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        onConnect(accounts[0]);
        navigate("/campanhas");
      } catch (err) {
        alert("Erro ao conectar carteira: " + (err as Error).message);
      }
    } else {
      alert("MetaMask não encontrada. Instale a extensão para continuar.");
    }
  };

  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  if (address) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xl shadow-lg transition-all duration-200 border-2 border-[#ef4444] bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 hover:shadow-xl"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ minWidth: 200 }}
        >
          <svg className="w-6 h-6 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="#ef4444" />
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">{address.slice(0, 4)}...{address.slice(-4)}</text>
          </svg>
          <span>Menu</span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-red-100 z-50 flex flex-col">
            <div className="px-4 py-3 text-sm text-gray-700 border-b">Carteira: <span className="font-mono text-xs">{address}</span></div>
            <button className="px-4 py-3 text-left hover:bg-red-50" onClick={() => { navigate('/admin'); setMenuOpen(false); }}>Admin</button>
            <button className="px-4 py-3 text-left hover:bg-red-50" onClick={() => { navigate('/campanhas'); setMenuOpen(false); }}>Campanhas</button>
            <button className="px-4 py-3 text-left hover:bg-red-50 text-red-600 font-bold border-t" onClick={() => { onConnect(null); setMenuOpen(false); }}>Sair</button>
          </div>
        )}
      </div>
    );
  }
  return (
    <button
      className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xl shadow-lg transition-all duration-200 border-2 border-[#ef4444] bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50"
      onClick={handleConnect}
      style={{ minWidth: 200 }}
    >
      {walletIcon}
      <span>{t('connect_wallet', 'Conectar Carteira')}</span>
    </button>
  );
};

export default ConnectWallet;
