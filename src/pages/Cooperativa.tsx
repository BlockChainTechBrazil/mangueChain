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
  startedAt?: string;
  finishedAt?: string;
  status: 'aguardando' | 'pronta' | 'em_andamento' | 'finalizada';
}

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Limpeza Mangue', area: 'Recife', description: 'Limpeza geral do manguezal', goal: 1000, donated: 1000, status: 'pronta' },
  { id: 2, name: 'Plantio de Mudas', area: 'Olinda', description: 'Plantio de mudas nativas', goal: 2000, donated: 1500, status: 'aguardando' },
  { id: 3, name: 'Oficina Reciclagem', area: 'Paulista', description: 'Oficina de reciclagem para crianças', goal: 500, donated: 500, status: 'finalizada', startedAt: '2025-07-01', finishedAt: '2025-07-10' },
];

const Cooperativa: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

  const iniciarCampanha = (id: number) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, status: 'em_andamento', startedAt: new Date().toISOString().slice(0, 10) } : c
    ));
  };

  const finalizarCampanha = (id: number) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, status: 'finalizada', finishedAt: new Date().toISOString().slice(0, 10) } : c
    ));
  };

  return (
    <DonationProvider>
      <Header />
      <div className="w-full mx- mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-[#ef4444]">Minhas Campanhas</h1>
        <div className="bg-white rounded-xl shadow p-6 border border-red-100 mx-8">
          <table className="min-w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Nome</th>
                <th className="py-2 px-4">Área</th>
                <th className="py-2 px-4">Meta</th>
                <th className="py-2 px-4">Arrecadado</th>
                <th className="py-2 px-4">Início</th>
                <th className="py-2 px-4">Fim</th>
                <th className="py-2 px-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="py-2 px-4 font-semibold">{c.name}</td>
                  <td className="py-2 px-4">{c.area}</td>
                  <td className="py-2 px-4">R$ {c.goal.toLocaleString()}</td>
                  <td className="py-2 px-4 text-green-700 font-bold">R$ {c.donated.toLocaleString()}</td>
                  <td className="py-2 px-4">{c.startedAt || '-'}</td>
                  <td className="py-2 px-4">{c.finishedAt || '-'}</td>
                  <td className="py-2 px-4">
                    {c.status === 'pronta' && c.donated >= c.goal && (
                      <button
                        className="px-4 py-2 rounded-full font-bold text-base shadow bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105 hover:shadow-xl transition-all border-2 border-green-600"
                        onClick={() => iniciarCampanha(c.id)}
                      >
                        Iniciar Campanha
                      </button>
                    )}
                    {c.status === 'em_andamento' && (
                      <button
                        className="px-4 py-2 rounded-full font-bold text-base shadow bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:scale-105 hover:shadow-xl transition-all border-2 border-orange-600"
                        onClick={() => finalizarCampanha(c.id)}
                      >
                        Finalizar Campanha
                      </button>
                    )}
                    {c.status === 'finalizada' && (
                      <span className="text-green-700 font-bold">Finalizada</span>
                    )}
                    {c.status === 'aguardando' && (
                      <span className="text-gray-400 italic">Aguardando meta</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DonationProvider>
  );
};

export default Cooperativa;
