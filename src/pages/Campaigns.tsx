import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';

interface Campaign {
  id: number;
  name: string;
  area: string;
  description: string;
  donated: number; // Em ETH
  cooperative: string;
  finished: boolean;
}

const CampaignsContent: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Não é possível listar campanhas diretamente pelo contrato pois não há métodos para isso na ABI.
    setError("Não é possível listar campanhas diretamente pelo contrato. Consulte o admin para detalhes.");
    setLoading(false);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] relative">
      <Header />
      <section className="max-w-5xl mx-auto w-full pt-32 pb-16 px-2 sm:px-4">
        {loading ? (
          <div className="text-center">Carregando campanhas...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="text-center text-gray-500">Nenhuma campanha disponível no momento.<br />Consulte o administrador para mais informações.</div>
        )}
      </section>
    </div>
  );
};

const Campaigns: React.FC = () => (
  <DonationProvider>
    <CampaignsContent />
  </DonationProvider>
);

export default Campaigns;
