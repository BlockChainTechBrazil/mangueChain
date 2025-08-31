import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';
import { ethers } from 'ethers';
import { cooperativeAbi, mangueChainAbi, mangueChainAddress } from '../constants/contracts';

// --- Type Definitions ---
interface Campaign {
  id: number;
  name: string;
  description: string;
  donated: number;
  finished: boolean;
}

// --- Helper Components ---

// Tipagem customizada para o contrato da cooperativa
type CooperativeContract = ethers.Contract & {
  withdraw: () => Promise<any>;
  getVaultAddress: () => Promise<string>;
};

const CooperativeDashboard: React.FC<{
  cooperativeContract: CooperativeContract;
  balance: string;
  campaigns: Campaign[];
  onWithdraw: () => Promise<void>;
}> = ({ cooperativeContract, balance, campaigns, onWithdraw }) => {
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    setLoading(true);
    await onWithdraw();
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow p-6 border border-blue-100 mb-8">
        <h2 className="text-2xl font-bold mb-4">Painel da Cooperativa</h2>
        <p className="mb-2">Endereço do Contrato: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{cooperativeContract.target}</span></p>
        <div className="flex items-center gap-4">
          <p className="text-lg">Saldo: <span className="font-bold text-green-600">{balance} ETH</span></p>
          <button onClick={handleWithdraw} disabled={loading || balance === '0.0'} className="px-4 py-2 rounded-full font-semibold text-sm bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 transition-all">
            {loading ? 'Sacando...' : 'Sacar Saldo'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-red-100">
        <h2 className="text-2xl font-bold mb-4">Minhas Campanhas</h2>
        {campaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Nome</th>
                  <th className="py-2 px-4">Arrecadado (ETH)</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2 px-4">{c.id}</td>
                    <td className="py-2 px-4 font-semibold">{c.name}</td>
                    <td className="py-2 px-4">{c.donated.toLocaleString()}</td>
                    <td className="py-2 px-4">{c.finished ? <span className="text-green-600 font-bold">Finalizada</span> : <span className="text-yellow-600 font-bold">Em Andamento</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Nenhuma campanha encontrada para esta cooperativa.</p>
        )}
      </div>
    </div>
  );
};


// --- Main Component ---

const CooperativaContent: React.FC = () => {
  const [registerLoading, setRegisterLoading] = useState(false);
  // Função para cadastrar cooperativa
  const handleRegisterCooperative = async () => {
    setRegisterLoading(true);
    try {
      if (!(window as any).ethereum) {
        alert("MetaMask não encontrada.");
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const mangueContract = new ethers.Contract(mangueChainAddress, mangueChainAbi, signer);
      const tx = await mangueContract.registerCooperative(
        form.vault,
        form.name,
        form.cnpj,
        form.cpf,
        form.email
      );
      await tx.wait();
      alert("Cooperativa cadastrada com sucesso!");
      setForm({ vault: '', name: '', cnpj: '', cpf: '', email: '' });
    } catch (err) {
      console.error("Erro ao cadastrar cooperativa:", err);
      alert("Falha ao cadastrar cooperativa. Verifique os dados e tente novamente.");
    } finally {
      setRegisterLoading(false);
    }
  };
  const [coopAddress, setCoopAddress] = useState('');
  const [cooperativeContract, setCooperativeContract] = useState<CooperativeContract | null>(null);
  const [balance, setBalance] = useState('0.0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Campos para criar cooperativa
  const [form, setForm] = useState({
    vault: '',
    name: '',
    cnpj: '',
    cpf: '',
    email: ''
  });

  const loadCooperativeData = useCallback(async () => {
    if (!ethers.isAddress(coopAddress)) {
      setError("Endereço de contrato inválido.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (!(window as any).ethereum) {
        throw new Error("MetaMask não encontrada.");
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      // Create contract instance
      const coopContract = new ethers.Contract(coopAddress, cooperativeAbi, provider) as CooperativeContract;
      setCooperativeContract(coopContract);
      // Buscar saldo
      const coopBalance = await provider.getBalance(coopContract.target);
      setBalance(ethers.formatEther(coopBalance));
    } catch (err) {
      console.error("Erro ao carregar dados da cooperativa:", err);
      setError("Falha ao carregar dados. Verifique o endereço e sua conexão.");
      setCooperativeContract(null);
    } finally {
      setLoading(false);
    }
  }, [coopAddress]);

  const handleWithdraw = async () => {
    if (!cooperativeContract) return;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const tx = await cooperativeContract.connect(signer).withdraw();
      await tx.wait();
      alert("Saque realizado com sucesso!");
      loadCooperativeData(); // Refresh data
    } catch (error) {
      console.error("Erro ao sacar:", error);
      alert("Falha ao realizar o saque.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto w-full pt-24 sm:pt-32 pb-16 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#ef4444] text-center sm:text-left">Painel da Cooperativa</h1>

        <div className="bg-white rounded-xl shadow p-6 border border-red-100 mb-8">
          <h2 className="text-2xl font-bold mb-4">Buscar Cooperativa</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              value={coopAddress}
              onChange={(e) => setCoopAddress(e.target.value)}
              placeholder="Cole o endereço do contrato da sua cooperativa"
              className="input w-full px-4 py-2 border rounded-full flex-grow"
            />
            <button onClick={loadCooperativeData} disabled={loading} className="px-6 py-2 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 disabled:opacity-50 transition-all">
              {loading ? 'Carregando...' : 'Carregar'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold mb-4">Cadastrar Nova Cooperativa</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); handleRegisterCooperative(); }}>
            <input name="vault" value={form.vault} onChange={e => setForm(f => ({ ...f, vault: e.target.value }))} placeholder="Endereço do Cofre (vault)" className="input w-full px-3 py-2 border rounded" required />
            <input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome da Cooperativa" className="input w-full px-3 py-2 border rounded" required />
            <input name="cnpj" value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} placeholder="CNPJ" className="input w-full px-3 py-2 border rounded" required />
            <input name="cpf" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="CPF" className="input w-full px-3 py-2 border rounded" required />
            <input name="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="E-mail" className="input w-full px-3 py-2 border rounded" required />
            <div className="md:col-span-2 text-right">
              <button type="submit" disabled={registerLoading} className="px-6 py-2 rounded-full font-bold text-lg shadow bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white hover:scale-105 disabled:opacity-50 transition-all">
                {registerLoading ? 'Cadastrando...' : 'Cadastrar Cooperativa'}
              </button>
            </div>
          </form>
        </div>

        {cooperativeContract && (
          <CooperativeDashboard
            cooperativeContract={cooperativeContract}
            balance={balance}
            campaigns={[]}
            onWithdraw={handleWithdraw}
          />
        )}
      </main>
    </div>
  );
};

const Cooperativa: React.FC = () => (
  <DonationProvider>
    <CooperativaContent />
  </DonationProvider>
);

export default Cooperativa;
