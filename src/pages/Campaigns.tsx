import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';
import { ethers } from 'ethers';
import { mangueChainAddress, mangueChainAbi } from '../constants/contracts';

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
    const fetchCampaigns = async () => {
      if (!window.ethereum) {
        setError("MetaMask não encontrada. Instale a extensão para continuar.");
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(mangueChainAddress, mangueChainAbi, provider);

        const taskCount = await contract.getTaskCount();
        const campaignsData: Campaign[] = [];

        for (let i = 1; i <= Number(taskCount); i++) {
          const task = await contract.getTask(i);
          campaignsData.push({
            id: i,
            cooperative: task.cooperative,
            name: task.tipo,
            description: task.descr,
            donated: parseFloat(ethers.formatEther(task.value)),
            area: task.georef, // Assuming georef is the area
            finished: task.finished,
          });
        }

        setCampaigns(campaignsData);
      } catch (err) {
        console.error("Erro ao buscar campanhas:", err);
        setError("Erro ao buscar campanhas do contrato.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {campaigns.map((c) => (
              <div key={c.id} className={`bg-white rounded-2xl shadow-lg border-2 p-4 sm:p-8 flex flex-col gap-2 relative hover:scale-[1.02] transition-transform ${c.finished ? 'border-gray-300' : 'border-red-100'}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-[#ef4444] mb-1">{c.name}</h2>
                <div className="text-sm sm:text-base font-semibold text-[#1677ff]">Área: {c.area}</div>
                <div className="text-gray-700 mb-2 text-xs sm:text-base">{c.description}</div>
                <div className="text-xs sm:text-sm text-gray-600 mb-2">
                  <span className="font-bold text-[#ef4444]">{c.donated.toLocaleString()} ETH</span> arrecadados
                </div>
                {c.finished ? (
                  <div className="mt-2 px-4 sm:px-6 py-2 rounded-full font-semibold text-center bg-gray-200 text-gray-600">
                    Campanha Finalizada
                  </div>
                ) : (
                  <button className="mt-2 px-4 sm:px-6 py-2 rounded-full font-semibold border-2 border-[#ef4444] text-[#ef4444] bg-white hover:bg-[#ef4444] hover:text-white transition-all text-xs sm:text-base">
                    Doar para esta campanha
                  </button>
                )}
              </div>
            ))}
          </div>
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
