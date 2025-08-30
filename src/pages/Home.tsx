import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import AOS from "aos";
import "aos/dist/aos.css";
import About from "../components/About";
import HowToDonate from "../components/HowToDonate";
import Impact from "../components/Impact";
import Partners from "../components/Partners";
import Header from "../components/Header";
import ImpactCard from "../components/ImpactCard";
import { DonationProvider } from "../contexts/DonationContext";
import { useDonation } from "../hooks/useDonation";
import * as ethers from "ethers";
import VideoBackground from "../components/VideoBackground";

// const bankContract = '0xE0CeDEF67A7b10355236bD6087DC1ADF494b4817';
const proxyContract = '0x0595d3f5EE5cFb8Ba4FC7Bad31846cd264BFA0CC';
// const clientContract = '0x22A0f7ce33e44702Badd7B31DfDF940535b79dB2';


const HomeContent: React.FC = () => {
  const { t } = useTranslation();
  const { address, fetchSaldo, fetchWalletBalance } = useDonation();

  // Estado para mensagens reais
  const [donationMessages, setDonationMessages] = useState<{ name: string, value: string, msg: string }[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  async function fetchMessages() {
    setLoadingMessages(true);
    try {
      // ethers já está disponível no contexto global do projeto
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet not found");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      // Buscar o endereço do cofre atual
      const proxyABI = [
        { "inputs": [], "name": "getCurrentVault", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
      ];
      const proxy = new ethers.Contract(proxyContract, proxyABI, provider);
      const vaultAddr = await proxy.getCurrentVault();
      // ABI mínima para evento Deposit
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
      // Busca todos os eventos Deposit do cofre
      const filter = bank.filters.Deposit();
      const events = await bank.queryFilter(filter, 0, "latest");
      const formatted = events.map(ev => {
        // ev.args is a Result object, so we need to extract by index or by key if available
        // For ethers v6, args is an array-like object with named properties
        const args = (ev as ethers.EventLog).args as unknown as { from: string; amount: bigint; message: string };
        return {
          name: args && args.from ? args.from : "Anônimo",
          value: ethers.formatEther(args.amount) + " ETH",
          msg: args.message
        };
      }).reverse(); // mais recentes primeiro
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
      <VideoBackground />
      <Header />

      <section className="relative flex flex-col md:flex-row items-center justify-center px-4 py-12 w-full flex-1 gap-12" data-aos="fade-up">
        <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2/3 font-medium">
            {t('subtitle')}
            <br />
            <span className="text-red-300 font-bold">{t('transparency')}</span>, <span className="text-red-500 font-bold">{t('joy')}</span> and <span className="text-yellow-400 font-bold">{t('real_impact')}</span>.
          </p>
        </div>
      </section>

      <Impact />

      {/* Mensagens reais de esperança */}
      <section className="w-full flex flex-col items-center py-12 bg-black/50">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">{t('messages_title')}</h2>
        {loadingMessages ? (
          <div className="text-lg text-red-300 font-semibold">Carregando mensagens...</div>
        ) : donationMessages.length === 0 ? (
          <div className="text-lg text-gray-400 font-semibold">Nenhuma mensagem encontrada.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
            {donationMessages.map((d, i) => (
              <div key={i} className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-red-300 min-w-[220px] max-w-lg w-full">
                <span className="text-lg font-bold text-red-500 mb-1">{d.name}</span>
                <span className="text-[#232946] text-center italic">“{d.msg}”</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Impact cards */}
      <section className="w-full flex flex-col items-center py-16 bg-transparent">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center drop-shadow-lg">{t('impact_title')}</h2>
        <div className="flex flex-wrap justify-center gap-12 w-full max-w-6xl">
          <ImpactCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60" height="60" className="w-16 h-16"><path d="M 20 50 C 20 30, 80 30, 80 50 C 80 70, 20 70, 20 50 Z" fill="#FFFFFF"/><circle cx="40" cy="45" r="3" fill="#000000"/><circle cx="60" cy="45" r="3" fill="#000000"/><path d="M 15 40 C 5 30, 5 20, 15 20 C 25 20, 25 30, 15 40 Z" fill="#FFFFFF"/><path d="M 85 40 C 95 30, 95 20, 85 20 C 75 20, 75 30, 85 40 Z" fill="#FFFFFF"/><path d="M 10 25 C 5 20, 10 15, 15 20 Z" fill="#000000"/><path d="M 90 25 C 95 20, 90 15, 85 20 Z" fill="#000000"/><path d="M 25 65 C 15 75, 15 85, 25 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M 35 70 C 25 80, 25 90, 35 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M 75 65 C 85 75, 85 85, 75 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M 65 70 C 75 80, 75 90, 65 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            title={t('impact_crabs')}
            value="+120"
            description={t('impact_crabs_desc')}
            colorFrom="#ef4444"
            colorTo="#f97316"
          />
          <ImpactCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" className="w-12 h-12"><path d="M 20 50 C 20 30, 80 30, 80 50 C 80 70, 20 70, 20 50 Z" fill="#FFFFFF"/><circle cx="40" cy="45" r="3" fill="#000000"/><circle cx="60" cy="45" r="3" fill="#000000"/><path d="M 15 40 C 5 30, 5 20, 15 20 C 25 20, 25 30, 15 40 Z" fill="#FFFFFF"/><path d="M 85 40 C 95 30, 95 20, 85 20 C 75 20, 75 30, 85 40 Z" fill="#FFFFFF"/><path d="M 10 25 C 5 20, 10 15, 15 20 Z" fill="#000000"/><path d="M 90 25 C 95 20, 90 15, 85 20 Z" fill="#000000"/><path d="M 25 65 C 15 75, 15 85, 25 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M 35 70 C 25 80, 25 90, 35 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M 75 65 C 85 75, 85 85, 75 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M 65 70 C 75 80, 75 90, 65 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>}
            title={t('impact_donations')}
            value="R$ 500k+"
            description={t('impact_donations_desc')}
            colorFrom="#f97316"
            colorTo="#eab308"
          />
          <ImpactCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" className="w-12 h-12"><path d="M 20 50 C 20 30, 80 30, 80 50 C 80 70, 20 70, 20 50 Z" fill="#FFFFFF"/><circle cx="40" cy="45" r="3" fill="#000000"/><circle cx="60" cy="45" r="3" fill="#000000"/><path d="M 15 40 C 5 30, 5 20, 15 20 C 25 20, 25 30, 15 40 Z" fill="#FFFFFF"/><path d="M 85 40 C 95 30, 95 20, 85 20 C 75 20, 75 30, 85 40 Z" fill="#FFFFFF"/><path d="M 10 25 C 5 20, 10 15, 15 20 Z" fill="#000000"/><path d="M 90 25 C 95 20, 90 15, 85 20 Z" fill="#000000"/><path d="M 25 65 C 15 75, 15 85, 25 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M 35 70 C 25 80, 25 90, 35 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M 75 65 C 85 75, 85 85, 75 85" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M 65 70 C 75 80, 75 90, 65 90" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/></svg>}
            title={t('impact_projects')}
            value="15+"
            description={t('impact_projects_desc')}
            colorFrom="#eab308"
            colorTo="#ef4444"
          />
        </div>
      </section>

      <main className="flex-1 w-full mx-auto text-white max-w-[1400px] z-10">
        <section id="about" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-black/70 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-red-300">
            <About />
          </div>
        </section>
        <section id="how-to-donate" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-black/60 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-red-300">
            <HowToDonate />
          </div>
        </section>
        <section id="partners" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-black/70 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-red-300">
            <Partners />
          </div>
        </section>
      </main>

      <footer className="bg-black/80 text-center py-6 text-white text-base mt-8 border-t border-red-300 font-semibold shadow-inner z-10">
        © {new Date().getFullYear()} <span className="text-red-500 font-bold">MangueChain</span>. {t('footer')}
      </footer>
      {/* Navegação suave */}
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
