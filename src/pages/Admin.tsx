import React, { useState } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';

interface Cooperative {
  id: number;
  name: string;
  cpfCnpj: string;
  wallet: string;
  address: string;
  zone: string;
}

interface Campaign {
  id: number;
  name: string;
  area: string;
  description: string;
  goal: number;
  donated: number;
  cooperativeId?: number;
  startedAt?: string;
  finishedAt?: string;
  paid?: boolean;
}

const initialCooperatives: Cooperative[] = [
  { id: 1, name: 'Cooperativa Mangue Vivo', cpfCnpj: '12.345.678/0001-99', wallet: '0x123...', address: 'Rua do Mangue, 100', zone: 'Recife' },
];

const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Limpeza Mangue', area: 'Recife', description: 'Limpeza geral do manguezal', goal: 1000, donated: 1000, cooperativeId: 1, startedAt: '2025-08-01 09:00', finishedAt: '2025-08-10 17:00', paid: false },
];

const Admin: React.FC = () => {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(initialCooperatives);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  // Form states
  const [coopForm, setCoopForm] = useState({ name: '', cpfCnpj: '', wallet: '', address: '', zone: '' });
  const [campForm, setCampForm] = useState({ name: '', area: '', description: '', goal: '' });
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [isCoopModalOpen, setIsCoopModalOpen] = useState(false);

  // Handlers
  const handleCoopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoopForm({ ...coopForm, [e.target.name]: e.target.value });
  };
  const handleCampChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCampForm({ ...campForm, [e.target.name]: e.target.value });
  };
  const addCooperative = () => {
    if (!coopForm.name || !coopForm.cpfCnpj || !coopForm.wallet || !coopForm.address || !coopForm.zone) return;
    setCooperatives([...cooperatives, { ...coopForm, id: cooperatives.length + 1 }]);
    setCoopForm({ name: '', cpfCnpj: '', wallet: '', address: '', zone: '' });
  };
  const addCampaign = () => {
    if (!campForm.name || !campForm.area || !campForm.description || !campForm.goal) return;
    setCampaigns([
      ...campaigns,
      { id: campaigns.length + 1, name: campForm.name, area: campForm.area, description: campForm.description, goal: Number(campForm.goal), donated: 0 }
    ]);
    setCampForm({ name: '', area: '', description: '', goal: '' });
  };
  const liberarPagamento = (id: number) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, paid: true } : c));
  };

  return (
    <DonationProvider>
      <Header />
      <div className="w-full mx-auto py-6 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#ef4444] text-center sm:text-left">Administração</h1>
        <div className='mx-0 sm:mx-8'>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
            <h2 className="text-2xl font-bold">Cooperativas</h2>
            <button
              className="px-6 py-2 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 hover:shadow-xl transition-all border-2 border-[#ef4444]"
              onClick={() => setIsCoopModalOpen(true)}
            >
              <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nova Cooperativa
            </button>
          </div>
          {/* Listagem de cooperativas */}
          <div className="bg-white rounded-xl shadow p-2 sm:p-6 border border-red-100 mb-8">
            {/* Tabela no desktop, cards no mobile */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-[600px] w-full text-left border text-xs sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4">Nome</th>
                    <th className="py-2 px-4">CPF/CNPJ</th>
                    <th className="py-2 px-4">Carteira</th>
                    <th className="py-2 px-4">Endereço</th>
                    <th className="py-2 px-4">Zona</th>
                    <th className="py-2 px-4">Total Arrecadado</th>
                  </tr>
                </thead>
                <tbody>
                  {cooperatives.map(coop => {
                    const total = campaigns.filter(c => c.cooperativeId === coop.id).reduce((sum, c) => sum + c.donated, 0);
                    return (
                      <tr key={coop.id} className="border-t">
                        <td className="py-2 px-4 font-semibold">{coop.name}</td>
                        <td className="py-2 px-4">{coop.cpfCnpj}</td>
                        <td className="py-2 px-4 font-mono text-xs">{coop.wallet}</td>
                        <td className="py-2 px-4">{coop.address}</td>
                        <td className="py-2 px-4">{coop.zone}</td>
                        <td className="py-2 px-4 text-green-700 font-bold">R$ {total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Cards no mobile */}
            <div className="flex flex-col gap-4 sm:hidden">
              {cooperatives.map(coop => {
                const total = campaigns.filter(c => c.cooperativeId === coop.id).reduce((sum, c) => sum + c.donated, 0);
                return (
                  <div key={coop.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div className="font-bold text-lg mb-1">{coop.name}</div>
                    <div className="text-xs mb-1"><span className="font-semibold">CPF/CNPJ:</span> {coop.cpfCnpj}</div>
                    <div className="text-xs mb-1"><span className="font-semibold">Carteira:</span> <span className="font-mono">{coop.wallet}</span></div>
                    <div className="text-xs mb-1"><span className="font-semibold">Endereço:</span> {coop.address}</div>
                    <div className="text-xs mb-1"><span className="font-semibold">Zona:</span> {coop.zone}</div>
                    <div className="text-xs mt-2 text-green-700 font-bold"><span className="font-semibold">Total Arrecadado:</span> R$ {total.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {isCoopModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-[1000] px-2"
              onClick={e => {
                if (e.target === e.currentTarget) setIsCoopModalOpen(false);
              }}
            >
              <div className="bg-white rounded-xl p-4 sm:p-10 w-full max-w-[95vw] sm:max-w-xl shadow-2xl">
                <h2 className="mb-6 text-xl sm:text-2xl font-bold">Cadastrar Cooperativa</h2>
                <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); addCooperative(); setIsCoopModalOpen(false); }}>
                  <label className="font-semibold text-sm mb-1">Nome
                    <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Nome da cooperativa" name="name" value={coopForm.name} onChange={handleCoopChange} required />
                  </label>
                  <label className="font-semibold text-sm mb-1">CPF/CNPJ
                    <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="CPF ou CNPJ" name="cpfCnpj" value={coopForm.cpfCnpj} onChange={handleCoopChange} required />
                  </label>
                  <label className="font-semibold text-sm mb-1">Endereço da carteira
                    <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Endereço da carteira" name="wallet" value={coopForm.wallet} onChange={handleCoopChange} required />
                  </label>
                  <label className="font-semibold text-sm mb-1">Endereço
                    <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Endereço físico" name="address" value={coopForm.address} onChange={handleCoopChange} required />
                  </label>
                  <label className="font-semibold text-sm mb-1">Zona de atuação
                    <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Zona de atuação" name="zone" value={coopForm.zone} onChange={handleCoopChange} required />
                  </label>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsCoopModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded font-medium">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Cadastrar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
              <h2 className="text-2xl font-bold">Campanhas</h2>
              <button
                className="px-6 py-2 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 hover:shadow-xl transition-all border-2 border-[#ef4444]"
                onClick={() => setIsCampModalOpen(true)}
              >
                <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Nova Campanha
              </button>
            </div>
            <div className="bg-white rounded-xl shadow p-2 sm:p-6 border border-red-100">
              {/* Tabela no desktop, cards no mobile */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-[600px] w-full text-left border text-xs sm:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4">Nome</th>
                      <th className="py-2 px-4">Área</th>
                      <th className="py-2 px-4">Cooperativa</th>
                      <th className="py-2 px-4">Meta</th>
                      <th className="py-2 px-4">Arrecadado</th>
                      <th className="py-2 px-4">Início</th>
                      <th className="py-2 px-4">Fim</th>
                      <th className="py-2 px-4">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(c => {
                      const coop = cooperatives.find(co => co.id === c.cooperativeId);
                      return (
                        <tr key={c.id} className="border-t">
                          <td className="py-2 px-4 font-semibold">{c.name}</td>
                          <td className="py-2 px-4">{c.area}</td>
                          <td className="py-2 px-4">{coop ? coop.name : '-'}</td>
                          <td className="py-2 px-4">R$ {c.goal.toLocaleString()}</td>
                          <td className="py-2 px-4">R$ {c.donated.toLocaleString()}</td>
                          <td className="py-2 px-4">{c.startedAt || '-'}</td>
                          <td className="py-2 px-4">{c.finishedAt || '-'}</td>
                          <td className="py-2 px-4">
                            {!c.paid && c.donated >= c.goal ? (
                              <button
                                className="px-4 py-2 rounded-full font-bold text-base shadow bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-105 hover:shadow-xl transition-all border-2 border-green-600"
                                onClick={() => liberarPagamento(c.id)}
                              >
                                Liberar
                              </button>
                            ) : c.paid ? (
                              <span className="text-green-600 font-bold">Já pago</span>
                            ) : (
                              <span className="text-gray-400 italic">Aguardando meta</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Cards no mobile */}
              <div className="flex flex-col gap-4 sm:hidden">
                {campaigns.map(c => {
                  const coop = cooperatives.find(co => co.id === c.cooperativeId);
                  return (
                    <div key={c.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                      <div className="font-bold text-lg mb-1">{c.name}</div>
                      <div className="text-xs mb-1"><span className="font-semibold">Área:</span> {c.area}</div>
                      <div className="text-xs mb-1"><span className="font-semibold">Cooperativa:</span> {coop ? coop.name : '-'}</div>
                      <div className="text-xs mb-1"><span className="font-semibold">Meta:</span> R$ {c.goal.toLocaleString()}</div>
                      <div className="text-xs mb-1"><span className="font-semibold">Arrecadado:</span> R$ {c.donated.toLocaleString()}</div>
                      <div className="text-xs mb-1"><span className="font-semibold">Início:</span> {c.startedAt || '-'}</div>
                      <div className="text-xs mb-1"><span className="font-semibold">Fim:</span> {c.finishedAt || '-'}</div>
                      <div className="text-xs mt-2">
                        <span className="font-semibold">Pagamento:</span> {' '}
                        {!c.paid && c.donated >= c.goal ? (
                          <button
                            className="px-3 py-1 rounded-full font-bold text-xs shadow bg-gradient-to-r from-green-500 to-green-700 text-white border-2 border-green-600 mt-1"
                            onClick={() => liberarPagamento(c.id)}
                          >
                            Liberar
                          </button>
                        ) : c.paid ? (
                          <span className="text-green-600 font-bold">Já pago</span>
                        ) : (
                          <span className="text-gray-400 italic">Aguardando meta</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {isCampModalOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-[1000] px-2"
                onClick={e => {
                  if (e.target === e.currentTarget) setIsCampModalOpen(false);
                }}
              >
                <div className="bg-white rounded-xl p-4 sm:p-10 w-full max-w-[95vw] sm:max-w-xl shadow-2xl">
                  <h2 className="mb-6 text-xl sm:text-2xl font-bold">Cadastrar Campanha</h2>
                  <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); addCampaign(); setIsCampModalOpen(false); }}>
                    <label className="font-semibold text-sm mb-1">Nome
                      <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Nome da campanha" name="name" value={campForm.name} onChange={handleCampChange} required />
                    </label>
                    <label className="font-semibold text-sm mb-1">Área
                      <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Área de atuação" name="area" value={campForm.area} onChange={handleCampChange} required />
                    </label>
                    <label className="font-semibold text-sm mb-1">Descrição
                      <textarea className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Descrição da campanha" name="description" value={campForm.description} onChange={handleCampChange} required />
                    </label>
                    <label className="font-semibold text-sm mb-1">Meta (R$)
                      <input className="input w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Meta em reais" name="goal" value={campForm.goal} onChange={handleCampChange} type="number" required />
                    </label>
                    <div className="flex justify-end gap-3 mt-4">
                      <button type="button" onClick={() => setIsCampModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded font-medium">Cancelar</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Cadastrar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DonationProvider>
  );
};

export default Admin;
