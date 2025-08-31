import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';
import { ethers } from 'ethers';
import { mangueChainAddress, mangueChainAbi } from '../constants/contracts';
// Removed duplicate imports

// Tipagem para as tarefas/campanhas vindas do contrato
interface Campaign {
  id: number;
  cooperative: string;
  name: string;
  description: string;
  donated: number;
  area: number;
  finished: boolean;
}
// --- Componentes Funcionais ---

// Componente para o status do contrato e ações globais
const ContractStatus: React.FC<{
  contract: ethers.Contract | null;
  paused: boolean;
  fees: string;
  fetchContractData: () => void;
}> = ({ contract, paused, fees, fetchContractData }) => {
  const [loading, setLoading] = useState(false);

  const togglePause = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      let tx;
      if (paused) {
        tx = await contract.connect(signer).unpause();
      } else {
        tx = await contract.connect(signer).pause();
      }
      await tx.wait();
      fetchContractData();
    } catch (error) {
      console.error("Erro ao alterar status do contrato:", error);
      alert("Falha ao alterar status.");
    } finally {
      setLoading(false);
    }
  };

  const withdrawFees = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).withdrawFees();
      await tx.wait();
      fetchContractData();
    } catch (error) {
      console.error("Erro ao sacar taxas:", error);
      alert("Falha ao sacar taxas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-red-100 mb-8">
      <h2 className="text-2xl font-bold mb-4">Status do Contrato</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-lg font-semibold">Estado</span>
          <span className={`text-lg font-bold ${paused ? 'text-red-500' : 'text-green-500'}`}>
            {paused ? 'Pausado' : 'Ativo'}
          </span>
          <button onClick={togglePause} disabled={loading} className="mt-2 px-4 py-2 rounded-full font-semibold text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 transition-all">
            {loading ? 'Aguarde...' : (paused ? 'Reativar' : 'Pausar')}
          </button>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-lg font-semibold">Taxas Acumuladas</span>
          <span className="text-lg font-bold text-blue-600">{fees} ETH</span>
          <button onClick={withdrawFees} disabled={loading || fees === '0.0'} className="mt-2 px-4 py-2 rounded-full font-semibold text-sm bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 transition-all">
            {loading ? 'Aguarde...' : 'Sacar Taxas'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para criar uma nova tarefa
const CreateTaskForm: React.FC<{
  contract: ethers.Contract | null;
  fetchContractData: () => void;
}> = ({ contract, fetchContractData }) => {
  const [formData, setFormData] = useState({ copAddr: '', tipo: '', descr: '', area: '', georef: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).setTask(
        formData.copAddr,
        formData.tipo,
        formData.descr,
        BigInt(formData.area), // Corrected: use BigInt for uint256
        formData.georef
      );
      await tx.wait();
      setFormData({ copAddr: '', tipo: '', descr: '', area: '', georef: '' });
      fetchContractData();
      alert("Tarefa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Falha ao criar tarefa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-red-100 mb-8">
      <h2 className="text-2xl font-bold mb-4">Criar Nova Campanha (Tarefa)</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="copAddr" value={formData.copAddr} onChange={handleChange} placeholder="Endereço da Cooperativa" className="input w-full px-3 py-2 border rounded" required />
        <input name="tipo" value={formData.tipo} onChange={handleChange} placeholder="Tipo (Nome da Campanha)" className="input w-full px-3 py-2 border rounded" required />
        <textarea name="descr" value={formData.descr} onChange={handleChange} placeholder="Descrição" className="input w-full px-3 py-2 border rounded md:col-span-2" required />
        <input name="area" value={formData.area} onChange={handleChange} placeholder="Área (m²)" type="number" className="input w-full px-3 py-2 border rounded" required />
        <input name="georef" value={formData.georef} onChange={handleChange} placeholder="Georeferência" className="input w-full px-3 py-2 border rounded" required />
        <div className="md:col-span-2 text-right">
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 disabled:opacity-50 transition-all">
            {loading ? 'Criando...' : 'Criar Campanha'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente para listar as tarefas e interagir com elas
const TaskList: React.FC<{
  contract: ethers.Contract | null;
  campaigns: Campaign[];
  loading: boolean;
  fetchContractData: () => void;
}> = ({ contract, campaigns, loading, fetchContractData }) => {

  const handleCheckTask = async (id: number) => {
    if (!contract) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).checkTask(id);
      await tx.wait();
      fetchContractData();
      alert(`Tarefa ${id} marcada como finalizada!`);
    } catch (error) {
      console.error("Erro ao finalizar tarefa:", error);
      alert("Falha ao finalizar tarefa.");
    }
  };

  const handleAuditTask = async (id: number) => {
    if (!contract) return;
    const comments = prompt("Digite os comentários da auditoria:");
    if (comments) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tx = await contract.connect(signer).auditTask(id, comments);
        await tx.wait();
        fetchContractData();
        alert(`Auditoria da tarefa ${id} registrada!`);
      } catch (error) {
        console.error("Erro ao auditar tarefa:", error);
        alert("Falha ao auditar tarefa.");
      }
    }
  };

  if (loading) return <div className="text-center">Carregando tarefas...</div>;

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-red-100">
      <h2 className="text-2xl font-bold mb-4">Lista de Campanhas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nome</th>
              <th className="py-2 px-4">Cooperativa</th>
              <th className="py-2 px-4">Arrecadado (ETH)</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id} className="border-t">
                <td className="py-2 px-4">{c.id}</td>
                <td className="py-2 px-4 font-semibold">{c.name}</td>
                <td className="py-2 px-4 font-mono text-xs">{c.cooperative}</td>
                <td className="py-2 px-4">{c.donated.toLocaleString()}</td>
                <td className="py-2 px-4">{c.finished ? <span className="text-green-600 font-bold">Finalizada</span> : <span className="text-yellow-600 font-bold">Em Andamento</span>}</td>
                <td className="py-2 px-4 flex gap-2">
                  {!c.finished && (
                    <button onClick={() => handleCheckTask(c.id)} className="px-3 py-1 text-xs rounded-full bg-green-500 text-white hover:bg-green-600">
                      Finalizar
                    </button>
                  )}
                  <button onClick={() => handleAuditTask(c.id)} className="px-3 py-1 text-xs rounded-full bg-yellow-500 text-white hover:bg-yellow-600">
                    Auditar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- Componente Principal ---

const AdminContent: React.FC = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [paused, setPaused] = useState(false);
  const [retainedFees, setRetainedFees] = useState('0.0');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContractData = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    try {
      // Buscar apenas o que existe no contrato
      const [isPaused, fees] = await Promise.all([
        contract.isPaused(),
        contract.retainedFees()
      ]);

      setPaused(isPaused);
      setRetainedFees(ethers.formatEther(fees));

      // Não é possível buscar campanhas sem um método de contagem
      setCampaigns([]);
    } catch (err) {
      console.error("Erro ao buscar dados do contrato:", err);
      setError("Não foi possível carregar os dados do contrato. Verifique se está conectado na rede correta e se o contrato foi implantado.");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const mangueChainContract = new ethers.Contract(mangueChainAddress, mangueChainAbi, provider);
      setContract(mangueChainContract);
    } else {
      setError("MetaMask não encontrada. Por favor, instale para usar a página de admin.");
      setLoading(false);
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

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto w-full pt-24 sm:pt-32 pb-16 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#ef4444] text-center sm:text-left">Painel de Administração</h1>

        <ContractStatus contract={contract} paused={paused} fees={retainedFees} fetchContractData={fetchContractData} />

        <CreateTaskForm contract={contract} fetchContractData={fetchContractData} />

        <TaskList contract={contract} campaigns={campaigns} loading={loading} fetchContractData={fetchContractData} />
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