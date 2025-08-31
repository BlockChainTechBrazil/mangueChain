import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';

// ...existing code...

const CampaignsContent: React.FC = () => {
  // Removido: campanhas não são usadas pois não há método para buscar
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // MOCK: Simula carregamento e exibe campanhas mockadas
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] relative">
      <Header />
      <section className="max-w-5xl mx-auto w-full pt-32 pb-16 px-2 sm:px-4">
        {loading ? (
          <div className="text-center">Carregando campanhas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1 */}
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 flex flex-col justify-between p-8 transition-transform hover:scale-105">
              <div>
                <h2 className="text-2xl font-extrabold text-[#ef4444] mb-2">Campanha Limpeza</h2>
                <p className="mb-3 text-gray-700">Limpeza do mangue e conscientização ambiental na comunidade local.</p>
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-bold text-green-600 text-lg">5 ETH</span>
                  <span className="text-gray-500 text-sm">arrecadados</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                  <div className="h-3 rounded-full bg-yellow-400" style={{ width: '50%' }} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">Em Andamento</span>
                  <span className="ml-auto text-xs text-gray-500">Meta: 10 ETH</span>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 rounded-full bg-[#ef4444] text-white font-bold shadow hover:bg-[#f97316] transition">Doar</button>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 flex flex-col justify-between p-8 transition-transform hover:scale-105">
              <div>
                <h2 className="text-2xl font-extrabold text-[#ef4444] mb-2">Campanha Reciclagem</h2>
                <p className="mb-3 text-gray-700">Reciclagem de resíduos sólidos e educação ambiental.</p>
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-bold text-green-600 text-lg">3 ETH</span>
                  <span className="text-gray-500 text-sm">arrecadados</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                  <div className="h-3 rounded-full bg-green-400" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">Finalizada</span>
                  <span className="ml-auto text-xs text-gray-500">Meta: 3 ETH</span>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 rounded-full bg-gray-300 text-gray-500 font-bold shadow cursor-not-allowed" disabled>Doar</button>
            </div>
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
