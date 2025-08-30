import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/Header";
import VideoBackground from "../components/VideoBackground";
import { DonationProvider } from "../contexts/DonationContext";
import { useDonation } from "../hooks/useDonation";
import * as ethers from "ethers";

// const bankContract = '0xE0CeDEF67A7b10355236bD6087DC1ADF494b4817';
const proxyContract = '0x0595d3f5EE5cFb8Ba4FC7Bad31846cd264BFA0CC';
// const clientContract = '0x22A0f7ce33e44702Badd7B31DfDF940535b79dB2';



const HomeContent: React.FC = () => {
  const { address, fetchSaldo, fetchWalletBalance } = useDonation();
  const [donationMessages, setDonationMessages] = useState<{ name: string, value: string, msg: string }[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  async function fetchMessages() {
    setLoadingMessages(true);
    try {
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet não encontrada");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      const proxyABI = [
        { "inputs": [], "name": "getCurrentVault", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
      ];
      const proxy = new ethers.Contract(proxyContract, proxyABI, provider);
      const vaultAddr = await proxy.getCurrentVault();
      const bankABI = [
        {
          "anonymous": false,
          "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "message", "type": "string" }
          ],
          "name": "Deposit",
          "type": "event"
        }
      ];
      const bank = new ethers.Contract(vaultAddr, bankABI, provider);
      const filter = bank.filters.Deposit();
      const events = await bank.queryFilter(filter, 0, "latest");
      const formatted = events.map(ev => {
        const args = (ev as ethers.EventLog).args as unknown as { from: string; amount: bigint; message: string };
        return {
          name: args && args.from ? args.from : "Anônimo",
          value: ethers.formatEther(args.amount) + " ETH",
          msg: args.message
        };
      }).reverse();
      setDonationMessages(formatted);
    } catch {
      setDonationMessages([]);
    }
    setLoadingMessages(false);
  }

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
    fetchMessages();
    fetchSaldo();
    if (address) {
      fetchWalletBalance(address);
    }
  }, [address, fetchSaldo, fetchWalletBalance]);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans">
      <Header />
      <VideoBackground />

      {/* 1. O que é o mangue */}
      <section className="absolute left-1/2 top-64 -translate-x-1/2 flex flex-col items-center justify-center w-full flex-1 gap-12 max-w-screen-2xl mx-auto" data-aos="fade-up">
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <img src="/Crab.png" alt="Mangue" className="w-32 h-32 mb-4 drop-shadow-xl" style={{ borderRadius: '50%', border: '4px solid #ef4444', background: '#fff' }} />
            <h1 className="text-6xl md:text-7xl font-extrabold text-[#ef4444] mb-6 leading-tight drop-shadow-lg" style={{ textShadow: '2px 2px 8px #0008' }}>
              O que é o mangue?
            </h1>
            <p className="text-2xl md:text-3xl text-white mb-8 w-full max-w-3xl font-bold bg-gradient-to-r from-[#ef4444]/80 to-[#f97316]/80 p-6 rounded-2xl shadow-lg border-2 border-[#ef4444]">
              O mangue é um ecossistema costeiro fundamental para a vida marinha, proteção das cidades e manutenção da biodiversidade.<br />
              Ele filtra a água, abriga espécies e protege contra enchentes.<br />
              <span className="text-yellow-300">É o berço da vida no litoral brasileiro!</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Por que preservar o mangue é bom */}
      <section className="w-full flex flex-col items-center py-12 bg-black/60 max-w-screen-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">Por que preservar o mangue é importante?</h2>
        <ul className="text-lg text-white font-medium flex flex-col gap-3 max-w-2xl mx-auto">
          <li>• Protege as cidades de enchentes e erosão.</li>
          <li>• Garante alimento e renda para milhares de famílias.</li>
          <li>• Mantém a biodiversidade e o equilíbrio ambiental.</li>
          <li>• Ajuda a combater as mudanças climáticas.</li>
        </ul>
      </section>

      {/* 3. Recife e Olinda têm as melhores organizações de catadores */}
      <section className="w-full flex flex-col items-center py-12 bg-black/70 max-w-screen-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">Recife e Olinda: referência em organizações de catadores</h2>
        <p className="text-lg text-white font-medium max-w-2xl mx-auto mb-4">
          As cidades de Recife e Olinda são reconhecidas nacionalmente pela força e organização dos catadores de materiais recicláveis. Essas organizações são protagonistas na defesa do mangue e na regeneração do bioma.
        </p>
        <div className="flex flex-wrap gap-6 justify-center items-center mt-4 w-full">
          <div className="bg-white/90 border-l-4 border-primary px-8 py-6 rounded-lg shadow min-w-[200px] font-semibold text-lg">Associação Mangue Vivo</div>
          <div className="bg-white/90 border-l-4 border-blue-500 px-8 py-6 rounded-lg shadow min-w-[200px] font-semibold text-lg">Rede Catadores Recife</div>
          <div className="bg-white/90 border-l-4 border-green-500 px-8 py-6 rounded-lg shadow min-w-[200px] font-semibold text-lg">Olinda Sustentável</div>
        </div>
      </section>

      {/* 4. Mobilização social e empoderamento dos catadores */}
      <section className="w-full flex flex-col items-center py-12 bg-black/60 max-w-screen-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">Mobilização social: catadores regenerando o mangue</h2>
        <p className="text-lg text-white font-medium max-w-2xl mx-auto">
          A mobilização social já existe! Os catadores estão organizados, empoderados e liderando ações de limpeza, educação ambiental e regeneração do mangue. Apoiar essas iniciativas é investir em um futuro sustentável para todos.
        </p>
      </section>

      {/* 5. Prova social */}
      <section className="w-full flex flex-col items-center py-12 bg-black/50 max-w-screen-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">Prova social: mensagens reais de esperança</h2>
        {loadingMessages ? (
          <div className="text-lg text-red-300 font-semibold">Carregando mensagens...</div>
        ) : donationMessages.length === 0 ? (
          <div className="text-lg text-gray-400 font-semibold">Nenhuma mensagem encontrada.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-screen-xl">
            {donationMessages.map((d, i) => (
              <div key={i} className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-red-300 min-w-[220px] max-w-lg w-full">
                <span className="text-lg font-bold text-red-500 mb-1">{d.name}</span>
                <span className="text-[#232946] text-center italic">“{d.msg}”</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-black/80 text-center py-6 text-white text-base mt-8 border-t border-red-300 font-semibold shadow-inner z-10">
        © {new Date().getFullYear()} <span className="text-red-500 font-bold">MangueChain</span>. Juntos pela regeneração do mangue!
      </footer>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

const Home: React.FC = () => (
  <DonationProvider>
    <HomeContent />
  </DonationProvider>
);

export default Home;
