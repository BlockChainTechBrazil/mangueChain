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
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewName('');
    setNewArea('');
    setNewDescription('');
    setNewGoal('');
  };

  const handleCreate = () => {
    if (!newName || !newArea || !newDescription || !newGoal || isNaN(Number(newGoal))) return;
    setCampaigns([
      ...campaigns,
      {
        id: campaigns.length + 1,
        name: newName,
        area: newArea,
        description: newDescription,
        goal: Number(newGoal),
        donated: 0,
      },
    ]);
    closeModal();
  };

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] relative">
      <Header />
      <section className="max-w-5xl mx-auto w-full pt-32 pb-16 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#ef4444] drop-shadow-lg">Campanhas Ativas</h1>
          <button
            onClick={openModal}
            className="px-8 py-3 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 hover:shadow-xl transition-all"
          >
            Criar Campanha
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {campaigns.map((c) => {
            const percent = Math.round((c.donated / c.goal) * 100);
            return (
              <div key={c.id} className="bg-white rounded-2xl shadow-lg border-2 border-red-100 p-8 flex flex-col gap-2 relative hover:scale-[1.02] transition-transform">
                <h2 className="text-2xl font-bold text-[#ef4444] mb-1">{c.name}</h2>
                <div className="text-base font-semibold text-[#1677ff]">Área: {c.area}</div>
                <div className="text-gray-700 mb-2">{c.description}</div>
                <div className="w-full h-4 bg-[#e6f4ff] rounded-lg overflow-hidden mb-2">
                  <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-[#ef4444] to-[#f97316] transition-all duration-500"></div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-bold text-[#ef4444]">R$ {c.donated.toLocaleString()}</span> de R$ {c.goal.toLocaleString()} arrecadados ({percent}%)
                </div>
                <button className="mt-2 px-6 py-2 rounded-full font-semibold border-2 border-[#ef4444] text-[#ef4444] bg-white hover:bg-[#ef4444] hover:text-white transition-all">
                  Doar para esta campanha
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 340, boxShadow: '0 2px 16px #0002' }}>
            <h2 style={{ marginBottom: 18 }}>Criar nova campanha</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                placeholder="Nome da campanha"
                value={newName}
                onChange={e => setNewName((e.target as HTMLInputElement).value)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
              />
              <input
                placeholder="Área (ex: Recife, Olinda, etc)"
                value={newArea}
                onChange={e => setNewArea((e.target as HTMLInputElement).value)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
              />
              <textarea
                placeholder="Descrição da campanha"
                value={newDescription}
                onChange={e => setNewDescription((e.target as HTMLTextAreaElement).value)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, minHeight: 60, resize: 'vertical' }}
              />
              <input
                placeholder="Valor necessário (R$)"
                value={newGoal}
                onChange={e => setNewGoal((e.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))}
                type="number"
                min={1}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button onClick={closeModal} style={{ padding: '6px 18px', background: '#eee', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleCreate} style={{ padding: '6px 18px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Campaigns: React.FC = () => (
  <DonationProvider>
    <CampaignsContent />
  </DonationProvider>
);

export default Campaigns;
