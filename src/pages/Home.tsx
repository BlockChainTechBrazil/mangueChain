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

      {/* 0. Token */}
      <section className="absolute left-1/2 top-36 -translate-x-1/2 flex flex-col items-center justify-center w-full flex-1 gap-12 max-w-screen-2xl mx-auto" data-aos="fade-up">
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <img
              src="/crabtoken.gif"
              alt="Mangue"
              className="mb-4 drop-shadow-xl animate-spin-slow"
              style={{ borderRadius: '50%', background: '#fff', width: '96px', height: '96px', maxWidth: '25vw', maxHeight: '25vw', minWidth: '64px', minHeight: '64px' }}
            />
            <style>{`
              @keyframes spin-slow {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
              }
              .animate-spin-slow {
                animation: spin-slow 3s linear infinite;
                transform-style: preserve-3d;
              }
            `}</style>
            <h1
              className="text-2xl font-extrabold text-[#ef4444] mb-6 leading-tight drop-shadow-lg"
              style={{ textShadow: '4px 4px 32px #fff, 0 0 16px #fff, 0 0 24px #fff' }}
            >
              CrabCoin
            </h1>
          </div>
        </div>
      </section>

      {/* 1. O que é o mangue */}
      <section id="oque-e-o-mangue" className="flex items-center justify-center w-full flex-1 gap-8 mt-20 sm:mt-24 mx-auto scroll-mt-32 px-2" data-aos="fade-up">
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#ef4444] mb-2 md:mb-4 leading-tight drop-shadow-lg text-center" style={{ textShadow: '2px 2px 8px #0008' }}>
              O que é o mangue?
            </h1>
            <div className="text-base xs:text-lg sm:text-xl md:text-2xl text-white mb-4 md:mb-6 w-full sm:w-4/5 md:w-1/2 font-bold bg-gradient-to-r from-[#ef4444]/80 to-[#f97316]/80 p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg border-2 border-[#ef4444] mx-auto">
              <p className="mb-3 leading-relaxed">
                O mangue é um ecossistema costeiro essencial para a vida marinha, proteção das cidades e manutenção da biodiversidade.<br />
                Ele filtra a água, abriga espécies e protege contra enchentes.<br />
                <span className="text-yellow-300 font-bold">É o berço da vida no litoral brasileiro!</span>
              </p>
              <div className="bg-white/10 rounded-xl p-2 sm:p-4 mt-2 mb-2">
                <span className="text-white font-semibold block mb-2">Curiosidades sobre o mangue:</span>
                <ul className="text-base xs:text-lg sm:text-xl text-white font-medium flex flex-col gap-2 list-none pl-0 text-left">
                  <li><span className="mr-2">🦀</span> Um dos ecossistemas mais produtivos do planeta, berçário de peixes, caranguejos e camarões.</li>
                  <li><span className="mr-2">💧</span> Suas raízes filtram poluentes e ajudam a manter a qualidade da água.</li>
                  <li><span className="mr-2">🌱</span> O solo do mangue armazena até 5x mais carbono que florestas tropicais, combatendo o aquecimento global.</li>
                  <li><span className="mr-2">👩‍👩‍👦‍👦</span> Fonte de sustento para milhares de famílias de pescadores e catadores.</li>
                  <li><span className="mr-2">🌊</span> Símbolo de resistência e adaptação, sobrevive em áreas de água doce e salgada.</li>
                </ul>
              </div>
              <span className="text-orange-200 block mt-2 text-base sm:text-lg">Preservar o mangue é preservar a vida, a cultura e o futuro das cidades costeiras!</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Por que preservar o mangue é importante? */}
      <section id="por-que-preservar" className="w-full py-12 sm:py-20 max-w-screen-3xl mx-auto px-2 sm:px-6 md:px-10 mt-8 sm:mt-12 rounded-2xl scroll-mt-32" data-aos="fade-right">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-start justify-center text-left w-full md:ml-24">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#ef4444] mb-4 md:mb-6 drop-shadow-lg">Por que preservar o mangue é importante?</h2>
            <ul className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold flex flex-col gap-3 sm:gap-4 mb-4">
              <li><span className="mr-2">🌊</span> Protege as cidades de enchentes e erosão.</li>
              <li><span className="mr-2">🍤</span> Garante alimento e renda para milhares de famílias.</li>
              <li><span className="mr-2">🌱</span> Mantém a biodiversidade e o equilíbrio ambiental.</li>
              <li><span className="mr-2">🌎</span> Ajuda a combater as mudanças climáticas.</li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center w-full mt-6 md:mt-0">
            <img src="/img/manguezal.png" alt="Manguezal" className="w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-cover rounded-2xl border-4 border-yellow-300 shadow-xl" />
          </div>
        </div>
      </section>

      {/* 3. Recife e Olinda têm as melhores organizações de catadores */}
      <section id="organizacoes" className="w-full py-12 sm:py-20 max-w-screen-3xl mx-auto px-2 sm:px-6 md:px-10 mt-8 sm:mt-12 rounded-2xl scroll-mt-32" data-aos="fade-left">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-start justify-center text-left w-full md:w-5/6">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2563eb] mb-4 md:mb-6 drop-shadow-lg">Recife e Olinda: referência em organizações de catadores</h2>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold mb-3 md:mb-4">
              As cidades de Recife e Olinda são reconhecidas nacionalmente pela força e organização dos catadores de materiais recicláveis. Essas organizações são protagonistas na defesa do mangue e na regeneração do bioma.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full justify-center md:justify-start">
              <div className="bg-white border-l-4 border-primary px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-lg shadow min-w-[140px] sm:min-w-[180px] md:min-w-[220px] font-semibold text-base sm:text-lg flex flex-col items-center">
                <img src="/img/redeReciclaMais.png" alt="Mangue Vivo Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" />
                Rede Recicla
              </div>
              <div className="bg-white border-l-4 border-blue-500 px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-lg shadow min-w-[140px] sm:min-w-[180px] md:min-w-[220px] font-semibold text-base sm:text-lg flex flex-col items-center">
                <img src="/src/assets/img/cooperativa-rec-limpa.png" alt="Rede Catadores Recife Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" />
                Rede Catadores Recife
              </div>
              <div className="bg-white border-l-4 border-green-500 px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-lg shadow min-w-[140px] sm:min-w-[180px] md:min-w-[220px] font-semibold text-base sm:text-lg flex flex-col items-center">
                <img src="/src/assets/img/nva-olinda.jpeg" alt="Olinda Sustentável Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" />
                Olinda Sustentável
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mobilização social e empoderamento dos catadores */}
      <section id="mobilizacao" className="w-full flex flex-col md:flex-row items-center justify-center py-24 bg-white max-w-screen-2xl mx-auto gap-8 px-4 scroll-mt-32" data-aos="fade-right">
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8">
          <div className="flex flex-col items-center justify-center w-full md:w-auto mb-6 md:mb-0">
            <img src="/img/caranguejo.png" alt="Catadores" className="w-40 h-40 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-2xl border-4 border-orange-300 shadow-xl" />
          </div>
          <div className="flex-1 flex flex-col items-start justify-center text-left bg-white/80 rounded-2xl shadow-lg p-4 sm:p-8 border border-green-200">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-[#22c55e] mb-4 sm:mb-6 drop-shadow-lg text-left w-full" style={{textShadow: '0 2px 12px #22c55e22'}}>
              Mobilização social: <span className="text-green-700">catadores regenerando o mangue</span>
            </h2>
            <div className="text-lg xs:text-xl sm:text-2xl text-gray-800 font-semibold mb-2 sm:mb-4 leading-relaxed">
              A mobilização social já existe! Os catadores estão organizados, empoderados e liderando ações de limpeza, educação ambiental e regeneração do mangue.<br />
              Apoiar essas iniciativas é investir em um futuro sustentável para todos.
            </div>
            <div className="w-full bg-gradient-to-r from-green-100/80 to-green-200/80 rounded-xl shadow p-3 sm:p-5 mb-3 border-l-4 border-green-400">
              <span className="block text-green-700 font-extrabold text-xl sm:text-2xl mb-2">Destaques da mobilização:</span>
              <ul className="flex flex-col gap-2 sm:gap-3 list-none pl-0 text-base xs:text-lg sm:text-xl text-green-900 font-medium">
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>Cooperativas e associações promovem mutirões de limpeza em rios, canais e manguezais.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>Catadores atuam como agentes ambientais, conscientizando comunidades sobre reciclagem e descarte correto.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>Projetos de educação ambiental em escolas e comunidades, integrando jovens à causa.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>Parcerias com prefeituras e ONGs ampliam o impacto das ações de regeneração.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>O trabalho dos catadores gera renda, dignidade e protagonismo social para centenas de famílias.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>Recife e Olinda são referência nacional em mobilização de catadores para defesa do mangue.</li>
              </ul>
            </div>
            <span className="block text-green-900 font-bold text-lg sm:text-xl mt-2">Catador é guardião do mangue e da vida!</span>
          </div>
        </div>
      </section>

      {/* 5. Prova social */}
      <section id="prova-social" className="w-full flex flex-col items-center py-12 max-w-screen-2xl mx-auto scroll-mt-32">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#ef4444] mb-8 text-center drop-shadow-lg">Prova social: mensagens reais de esperança</h2>
        {loadingMessages ? (
          <div className="text-lg text-red-300 font-semibold">Carregando mensagens...</div>
        ) : donationMessages.length === 0 ? (
          <div className="text-lg text-gray-400 font-semibold">Nenhuma mensagem encontrada.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-screen-xl">
            {donationMessages.map((d, i) => (
              <div key={i} className="bg-[#ef4444] rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-red-300 min-w-[220px] max-w-lg w-full">
                <span className="text-lg font-bold text-white mb-1">Recife</span>
                <span className="text-white text-center italic">“{d.msg}”</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-black/80 text-center py-6 text-white text-2xl mt-8 border-t border-red-300 font-semibold shadow-inner z-10">
        © {new Date().getFullYear()} <span className="text-red-500 font-bold">BlockChain Tech Brazil</span>. Juntos pela regeneração do mangue!
      </footer>
      <style>{`
        html, body {
          scroll-behavior: smooth;
          overflow-x: hidden !important;
          width: 100vw;
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
