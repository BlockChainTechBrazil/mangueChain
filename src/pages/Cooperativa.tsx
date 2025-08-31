import React, { useState } from 'react';
import Header from '../components/Header';
import { DonationProvider } from '../contexts/DonationContext';
import { ethers } from 'ethers';

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
  withdraw: () => Promise<ethers.ContractTransactionResponse>;
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
        <p className="mb-2">Endereço do Contrato: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{String(cooperativeContract.target)}</span></p>
        <div className="flex items-center gap-4">
          <p className="text-lg">Saldo: <span className="font-bold text-green-600">{balance} ETH</span></p>
          <button onClick={handleWithdraw} disabled={loading || balance === '0.0'} className="px-4 py-2 rounded-full font-semibold text-sm bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 transition-all">
            {loading ? 'Sacando...' : 'Sacar Saldo'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-red-100">
        <h2 className="text-2xl font-bold mb-4">Minhas Campanhas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map(c => {
            const meta = c.id === 1 ? 10 : 3; // mock meta
            const percent = Math.min(100, Math.round((c.donated / meta) * 100));
            return (
              <div key={c.id} className="flex flex-col gap-2 bg-white rounded-xl border border-blue-100 shadow p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#ef4444] text-lg">{c.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.finished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.finished ? 'Finalizada' : 'Em Andamento'}</span>
                </div>
                <span className="text-gray-700 text-sm">{c.description}</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-xs">Meta: {meta} ETH</span>
                  <span className="font-mono text-xs">Arrecadado: {c.donated} ETH</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                  <div className={`h-3 rounded-full ${c.finished ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: percent + '%' }} />
                </div>
                <div className="flex gap-2 mt-2">
                  {!c.finished && percent >= 100 && (
                    <button className="px-4 py-1 rounded-full bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition">Finalizar</button>
                  )}
                  {!c.finished && percent < 100 && (
                    <button className="px-4 py-1 rounded-full bg-blue-500 text-white font-bold text-xs hover:bg-blue-600 transition">Iniciar</button>
                  )}
                  {c.finished && (
                    <button className="px-4 py-1 rounded-full bg-gray-300 text-gray-500 font-bold text-xs cursor-not-allowed" disabled>Pagamento Realizado</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---

const CooperativaContent: React.FC = () => {
  // const [registerLoading, setRegisterLoading] = useState(false);
  // const handleRegisterCooperative = async () => {};
  // MOCK: Dados da cooperativa
  // const [coopAddress] = useState('0x1111111111111111111111111111111111111111');
  const [cooperativeContract] = useState<CooperativeContract | null>({
    target: '0x1111111111111111111111111111111111111111',
    withdraw: async () => ({ hash: '0xMOCKTX', wait: async () => ({}) }),
    getVaultAddress: async () => '0x2222222222222222222222222222222222222222',
  } as any);
  const [balance] = useState('10.0');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // Campos para criar cooperativa
  // const [form, setForm] = useState({
  //   vault: '',
  //   name: '',
  //   cnpj: '',
  //   cpf: '',
  //   email: ''
  // });

  // const loadCooperativeData = useCallback(async () => {});

  // const handleWithdraw = async () => {};

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto w-full pt-24 sm:pt-32 pb-16 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#ef4444] text-center sm:text-left">Painel da Cooperativa</h1>

        {/* MOCK: Sempre exibe dashboard com campanhas mockadas */}
        <CooperativeDashboard
          cooperativeContract={cooperativeContract!}
          balance={balance}
          campaigns={[
            { id: 1, name: 'Campanha Limpeza', description: 'Limpeza do mangue', donated: 5, finished: false },
            { id: 2, name: 'Campanha Reciclagem', description: 'Reciclagem de resíduos', donated: 3, finished: true },
          ]}
          onWithdraw={async () => alert('Saque simulado!')}
        />
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
