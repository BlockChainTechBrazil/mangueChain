import React, { useState } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';


interface Campaign {
  id: number;
  name: string;
  area: string;
  description: string;
  goal: number;
  donated: number;
}

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Campanha Limpeza do Mangue', area: 'Recife', description: 'Limpeza de resíduos sólidos no manguezal do Recife.', goal: 1000, donated: 350 },
  { id: 2, name: 'Recuperação de Fauna', area: 'Olinda', description: 'Apoio à recuperação de espécies nativas do mangue.', goal: 2000, donated: 1200 },
];

const CampaignsContent: React.FC = () => {
  const [campaigns] = useState<Campaign[]>(initialCampaigns);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] relative">
      <Header />
      <section className="max-w-5xl mx-auto w-full pt-32 pb-16 px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {campaigns.map((c) => {
            const percent = Math.round((c.donated / c.goal) * 100);
            return (
              <div key={c.id} className="bg-white rounded-2xl shadow-lg border-2 border-red-100 p-4 sm:p-8 flex flex-col gap-2 relative hover:scale-[1.02] transition-transform">
                <h2 className="text-xl sm:text-2xl font-bold text-[#ef4444] mb-1">{c.name}</h2>
                <div className="text-sm sm:text-base font-semibold text-[#1677ff]">Área: {c.area}</div>
                <div className="text-gray-700 mb-2 text-xs sm:text-base">{c.description}</div>
                <div className="w-full h-4 bg-[#e6f4ff] rounded-lg overflow-hidden mb-2">
                  <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-[#ef4444] to-[#f97316] transition-all duration-500"></div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mb-2">
                  <span className="font-bold text-[#ef4444]">R$ {c.donated.toLocaleString()}</span> de R$ {c.goal.toLocaleString()} arrecadados ({percent}%)
                </div>
                <button className="mt-2 px-4 sm:px-6 py-2 rounded-full font-semibold border-2 border-[#ef4444] text-[#ef4444] bg-white hover:bg-[#ef4444] hover:text-white transition-all text-xs sm:text-base">
                  Doar para esta campanha
                </button>
              </div>
            );
          })}
        </div>
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
