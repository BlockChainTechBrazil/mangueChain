// Tipagem para cooperativa
interface Cooperative {
  address: string;
  name: string;
  cnpj: string;
  cpf: string;
  email: string;
  vault: string;
  owner: string;
}
// Componente para listar cooperativas (lado esquerdo)
const CooperativeList: React.FC<{ cooperatives: Cooperative[], onNew: () => void }> = ({ cooperatives, onNew }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-blue-100 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Cooperativas Cadastradas</h2>
        <button onClick={onNew} className="px-4 py-2 rounded-full bg-[#ef4444] text-white font-bold shadow hover:bg-[#f97316] transition text-sm">Nova Cooperativa</button>
      </div>
      {cooperatives.length === 0 ? (
        <p>Nenhuma cooperativa cadastrada.</p>
      ) : (
        <ul className="divide-y divide-blue-50">
          {cooperatives.map(coop => (
            <li key={coop.address} className="py-3 flex flex-col gap-1">
              <span className="font-bold text-[#ef4444]">{coop.name}</span>
              <span className="text-xs font-mono text-gray-500">{coop.address}</span>
              <span className="text-sm text-gray-700">{coop.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
// Componente para cadastrar cooperativa
const CreateCooperativeForm: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
  const [form, setForm] = useState({ vault: '', name: '', cnpj: '', cpf: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error('MetaMask não encontrada.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(mangueChainAddress, mangueChainAbi, signer);
      const tx = await contract.registerCooperative(form.vault, form.name, form.cnpj, form.cpf, form.email);
      await tx.wait();
      alert('Cooperativa cadastrada com sucesso!');
      setForm({ vault: '', name: '', cnpj: '', cpf: '', email: '' });
      onRegister();
    } catch (err) {
      alert('Erro ao cadastrar cooperativa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-blue-100 mb-8">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Nova Cooperativa</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <input name="vault" value={form.vault} onChange={e => setForm(f => ({ ...f, vault: e.target.value }))} placeholder="Endereço do Cofre (vault)" className="input w-full px-3 py-2 border rounded" required />
        <input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome da Cooperativa" className="input w-full px-3 py-2 border rounded" required />
        <input name="cnpj" value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} placeholder="CNPJ" className="input w-full px-3 py-2 border rounded" required />
        <input name="cpf" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="CPF" className="input w-full px-3 py-2 border rounded" required />
        <input name="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="E-mail" className="input w-full px-3 py-2 border rounded" required />
        <div className="md:col-span-2 text-right">
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 disabled:opacity-50 transition-all">
            {loading ? 'Cadastrando...' : 'Cadastrar Cooperativa'}
          </button>
        </div>
      </form>
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';
import { ethers } from 'ethers';
import { mangueChainAddress, mangueChainAbi } from '../constants/contracts';
// Removed duplicate imports

// Tipagem para as tarefas/campanhas vindas do contrato
// ...existing code...
// --- Componentes Funcionais ---

// Componente para o status do contrato (apenas exibição)
const ContractStatus: React.FC<{ paused: boolean; fees: string }> = ({ paused, fees }) => (
  <div className="bg-white rounded-xl shadow p-6 border border-red-100 mb-8">
    <h2 className="text-2xl font-bold mb-4">Status do Contrato</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-lg font-semibold">Estado</span>
        <span className={`text-lg font-bold ${paused ? 'text-red-500' : 'text-green-500'}`}>{paused ? 'Pausado' : 'Ativo'}</span>
      </div>
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-lg font-semibold">Taxas Acumuladas</span>
        <span className="text-lg font-bold text-blue-600">{fees} ETH</span>
      </div>
    </div>
  </div>
);


// MOCK: Campanhas
const mockCampaigns = [
  { id: 1, name: 'Campanha Limpeza', description: 'Limpeza do mangue e conscientização ambiental.', donated: 5, meta: 10, finished: false },
  { id: 2, name: 'Campanha Reciclagem', description: 'Reciclagem de resíduos sólidos e educação ambiental.', donated: 3, meta: 3, finished: true },
];

const CreateCampaignForm: React.FC<{ onRegister: () => void, cooperatives: Cooperative[] }> = ({ onRegister, cooperatives }) => (
  <div className="bg-white rounded-xl shadow p-6 border border-blue-100 w-full max-w-lg">
    <h2 className="text-2xl font-bold mb-4">Cadastrar Nova Campanha</h2>
    <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onRegister(); }}>
      <input className="input px-3 py-2 border rounded" placeholder="Nome da Campanha" required />
      <textarea className="input px-3 py-2 border rounded" placeholder="Descrição" required />
      <input className="input px-3 py-2 border rounded" placeholder="Meta (ETH)" required type="number" min="1" />
      <select className="input px-3 py-2 border rounded" required defaultValue="">
        <option value="" disabled>Selecione a Cooperativa</option>
        {cooperatives.map(coop => (
          <option key={coop.address} value={coop.address}>{coop.name}</option>
        ))}
      </select>
      <div className="text-right">
        <button type="submit" className="px-6 py-2 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 transition-all">Cadastrar</button>
      </div>
    </form>
  </div>
);

const CampaignList: React.FC<{ cooperatives: Cooperative[] }> = ({ cooperatives }) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-red-100 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Campanhas</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-full bg-[#ef4444] text-white font-bold shadow hover:bg-[#f97316] transition">Nova Campanha</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockCampaigns.map(c => {
          const percent = Math.min(100, Math.round((c.donated / c.meta) * 100));
          return (
            <div key={c.id} className="flex flex-col gap-2 bg-white rounded-xl border border-blue-100 shadow p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#ef4444] text-lg">{c.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.finished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.finished ? 'Finalizada' : 'Em Andamento'}</span>
              </div>
              <span className="text-gray-700 text-sm">{c.description}</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-xs">Meta: {c.meta} ETH</span>
                <span className="font-mono text-xs">Arrecadado: {c.donated} ETH</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                <div className={`h-3 rounded-full ${c.finished ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: percent + '%' }} />
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-red-500">×</button>
            <CreateCampaignForm onRegister={() => setShowModal(false)} cooperatives={cooperatives} />
          </div>
        </div>
      )}
    </div>
  );
};


// --- Componente Principal ---

const AdminContent: React.FC = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  // MOCK: Dados de cooperativas
  const [cooperatives] = useState<Cooperative[]>([
    {
      address: '0x1111111111111111111111111111111111111111',
      name: 'Cooperativa Mangue Limpo',
      cnpj: '12.345.678/0001-99',
      cpf: '123.456.789-00',
      email: 'contato@manguelimpomock.com',
      vault: '0x2222222222222222222222222222222222222222',
      owner: '0x3333333333333333333333333333333333333333',
    },
    {
      address: '0x4444444444444444444444444444444444444444',
      name: 'Cooperativa Recicla Mais',
      cnpj: '98.765.432/0001-11',
      cpf: '987.654.321-00',
      email: 'contato@reciclamais.com',
      vault: '0x5555555555555555555555555555555555555555',
      owner: '0x6666666666666666666666666666666666666666',
    },
  ]);
  const [paused, setPaused] = useState(false);
  const [retainedFees, setRetainedFees] = useState('0.0');
  // ...existing code...
  const [error, setError] = useState<string | null>(null);

  // MOCK: Não busca dados reais
  const fetchContractData = useCallback(async () => {
    setPaused(false);
    setRetainedFees('0.0');
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const mangueChainContract = new ethers.Contract(mangueChainAddress, mangueChainAbi, provider);
      setContract(mangueChainContract);
    } else {
      setError("MetaMask não encontrada. Por favor, instale para usar a página de admin.");
      // ...existing code...
    }
  }, []);

  useEffect(() => {
    if (contract) {
      fetchContractData();
    }
  }, [contract, fetchContractData]);

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto w-full pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        </div>
      </div>
    );
  }

  // Modal de cadastro de cooperativa
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto w-full pt-24 sm:pt-32 pb-16 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#ef4444] text-center sm:text-left">Painel de Administração</h1>
        <ContractStatus paused={paused} fees={retainedFees} />
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <div className="flex-1">
            <CooperativeList cooperatives={cooperatives} onNew={() => setShowModal(true)} />
          </div>
          {/* Modal de cadastro de cooperativa */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
                <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-red-500">×</button>
                <CreateCooperativeForm onRegister={() => { setShowModal(false); fetchContractData(); }} />
              </div>
            </div>
          )}
        </div>
        <div className="mt-12">
          <CampaignList cooperatives={cooperatives} />
        </div>
      </main>
    </div>
  );
};

const Admin: React.FC = () => (
  <DonationProvider>
    <AdminContent />
  </DonationProvider>
);

export default Admin;