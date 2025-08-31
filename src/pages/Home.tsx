import React, { useEffect, useState } from "react";
import { useTranslation, Trans } from 'react-i18next';
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
  const { t } = useTranslation();
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
              src={`${import.meta.env.BASE_URL}crabtoken.gif`}
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
              {t('crabcoin')}
            </h1>
          </div>
        </div>
      </section>

      {/* 1. O que é o mangue */}
      <section id="oque-e-o-mangue" className="flex items-center justify-center w-full flex-1 gap-8 mt-20 sm:mt-24 mx-auto scroll-mt-32 px-2" data-aos="fade-up">
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#ef4444] mb-2 md:mb-4 leading-tight drop-shadow-lg text-center" style={{ textShadow: '2px 2px 8px #0008' }}>
              {t('home_oque_e_o_mangue')}
            </h1>
            <div className="text-base xs:text-lg sm:text-xl md:text-2xl text-white mb-4 md:mb-6 w-full sm:w-4/5 md:w-1/2 font-bold bg-gradient-to-r from-[#ef4444]/80 to-[#f97316]/80 p-3 sm:p-4 md:p-6 rounded-2xl shadow-lg border-2 border-[#ef4444] mx-auto">
              <p className="mb-3 leading-relaxed">
                {t('home_mangue_desc1')}<br />
                {t('home_mangue_desc2')}<br />
                <span className="text-yellow-300 font-bold">{t('home_mangue_berco')}</span>
              </p>
              <div className="bg-white/10 rounded-xl p-2 sm:p-4 mt-2 mb-2">
                <span className="text-white font-semibold block mb-2">{t('home_curiosidades_mangue')}</span>
                <ul className="text-base xs:text-lg sm:text-xl text-white font-medium flex flex-col gap-2 list-none pl-0 text-left">
                  <li><span className="mr-2">🦀</span> {t('home_curio_1')}</li>
                  <li><span className="mr-2">💧</span> {t('home_curio_2')}</li>
                  <li><span className="mr-2">🌱</span> {t('home_curio_3')}</li>
                  <li><span className="mr-2">👩‍👩‍👦‍👦</span> {t('home_curio_4')}</li>
                  <li><span className="mr-2">🌊</span> {t('home_curio_5')}</li>
                </ul>
              </div>
              <span className="text-orange-200 block mt-2 text-base sm:text-lg">{t('home_preservar_mangue')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Por que preservar o mangue é importante? */}
      <section id="por-que-preservar" className="w-full py-12 sm:py-20 max-w-screen-3xl mx-auto px-2 sm:px-6 md:px-10 mt-8 sm:mt-12 rounded-2xl scroll-mt-32" data-aos="fade-right">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-start justify-center text-left w-full md:ml-24">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#ef4444] mb-4 md:mb-6 drop-shadow-lg">{t('home_por_que_preservar_titulo')}</h2>
            <ul className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold flex flex-col gap-3 sm:gap-4 mb-4">
              <li><span className="mr-2">🌊</span> {t('home_por_que_preservar_1')}</li>
              <li><span className="mr-2">🍤</span> {t('home_por_que_preservar_2')}</li>
              <li><span className="mr-2">🌱</span> {t('home_por_que_preservar_3')}</li>
              <li><span className="mr-2">🌎</span> {t('home_por_que_preservar_4')}</li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center w-full mt-6 md:mt-0">
            <img src={`${import.meta.env.BASE_URL}img/manguezal.png`} alt="Manguezal" className="w-48 h-48 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-cover rounded-2xl border-4 border-yellow-300 shadow-xl" />
          </div>
        </div>
      </section>

      {/* 3. Recife e Olinda têm as melhores organizações de catadores */}
      <section id="organizacoes" className="w-full py-12 sm:py-20 max-w-screen-3xl mx-auto px-2 sm:px-6 md:px-10 mt-8 sm:mt-12 rounded-2xl scroll-mt-32" data-aos="fade-left">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-start justify-center text-left w-full md:w-5/6">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2563eb] mb-4 md:mb-6 drop-shadow-lg">{t('home_organizacoes_titulo')}</h2>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold mb-3 md:mb-4">
              {t('home_organizacoes_desc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full justify-center md:justify-start">
              <div className="bg-white border-l-4 border-primary px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-lg shadow min-w-[140px] sm:min-w-[180px] md:min-w-[220px] font-semibold text-base sm:text-lg flex flex-col items-center">
                <img src={`${import.meta.env.BASE_URL}img/redeReciclaMais.png`} alt="Mangue Vivo Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" />
                {t('home_organizacao_rede_recicla')}
              </div>
              <div className="bg-white border-l-4 border-blue-500 px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-lg shadow min-w-[140px] sm:min-w-[180px] md:min-w-[220px] font-semibold text-base sm:text-lg flex flex-col items-center">
                <img src={`${import.meta.env.BASE_URL}img/redeReciclaMais.png`} alt="Rede Catadores Recife Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" />
                {t('home_organizacao_rede_catadores')}
              </div>
              <div className="bg-white border-l-4 border-green-500 px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-lg shadow min-w-[140px] sm:min-w-[180px] md:min-w-[220px] font-semibold text-base sm:text-lg flex flex-col items-center">
                <img src={`${import.meta.env.BASE_URL}img/redeReciclaMais.png`} alt="Olinda Sustentável Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" />
                {t('home_organizacao_olinda_sustentavel')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mobilização social e empoderamento dos catadores */}
      <section id="mobilizacao" className="w-full flex flex-col md:flex-row items-center justify-center py-24 bg-white max-w-screen-2xl mx-auto gap-8 px-4 scroll-mt-32" data-aos="fade-right">
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8">
          <div className="flex flex-col items-center justify-center w-full md:w-auto mb-6 md:mb-0">
            <img src={`${import.meta.env.BASE_URL}img/caranguejo.png`} alt="Catadores" className="w-40 h-40 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-2xl border-4 border-orange-300 shadow-xl" />
          </div>
          <div className="flex-1 flex flex-col items-start justify-center text-left bg-white/80 rounded-2xl shadow-lg p-4 sm:p-8 border border-green-200">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-[#22c55e] mb-4 sm:mb-6 drop-shadow-lg text-left w-full" style={{ textShadow: '0 2px 12px #22c55e22' }}>
              <Trans
                i18nKey="home_mobilizacao_titulo"
                components={{ 1: <span className="text-green-700" /> }}
              />
            </h2>
            <div className="text-lg xs:text-xl sm:text-2xl text-gray-800 font-semibold mb-2 sm:mb-4 leading-relaxed">
              <Trans
                i18nKey="home_mobilizacao_desc"
                components={{ 1: <br /> }}
              />
            </div>
            <div className="w-full bg-gradient-to-r from-green-100/80 to-green-200/80 rounded-xl shadow p-3 sm:p-5 mb-3 border-l-4 border-green-400">
              <span className="block text-green-700 font-extrabold text-xl sm:text-2xl mb-2">{t('home_mobilizacao_destaques_titulo')}</span>
              <ul className="flex flex-col gap-2 sm:gap-3 list-none pl-0 text-base xs:text-lg sm:text-xl text-green-900 font-medium">
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>{t('home_mobilizacao_destaque_1')}</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>{t('home_mobilizacao_destaque_2')}</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>{t('home_mobilizacao_destaque_3')}</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>{t('home_mobilizacao_destaque_4')}</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>{t('home_mobilizacao_destaque_5')}</li>
                <li className="flex items-start gap-2"><span className="text-green-500 text-xl">✔️</span>{t('home_mobilizacao_destaque_6')}</li>
              </ul>
            </div>
            <span className="block text-green-900 font-bold text-lg sm:text-xl mt-2">{t('home_mobilizacao_guardiao')}</span>
          </div>
        </div>
      </section>

      {/* 5. Prova social */}
      <section id="prova-social" className="w-full flex flex-col items-center py-12 max-w-screen-2xl mx-auto scroll-mt-32">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#ef4444] mb-8 text-center drop-shadow-lg">{t('home_prova_social_titulo')}</h2>
        {loadingMessages ? (
          <div className="text-lg text-red-300 font-semibold">{t('home_prova_social_carregando')}</div>
        ) : donationMessages.length === 0 ? (
          <div className="text-lg text-gray-400 font-semibold">{t('home_prova_social_nenhuma')}</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-screen-xl">
            {donationMessages.map((d, i) => (
              <div key={i} className="bg-[#ef4444] rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-red-300 min-w-[220px] max-w-lg w-full">
                <span className="text-lg font-bold text-white mb-1">{t('home_prova_social_cidade')}</span>
                <span className="text-white text-center italic">“{d.msg}”</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-black/80 text-center py-6 text-white text-2xl mt-8 border-t border-red-300 font-semibold shadow-inner z-10">
        © {new Date().getFullYear()} <span className="text-red-500 font-bold">BlockChain Tech Brazil</span>. {t('home_footer_home')}
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
