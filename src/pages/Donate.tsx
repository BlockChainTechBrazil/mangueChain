
import React, { useState } from "react";

const ZONAS = [
  { value: "recife", label: "Recife" },
  { value: "paiva", label: "Paiva" },
];

export const DonateFormModalContent: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [zona, setZona] = useState(ZONAS[0].value);
  const [valor, setValor] = useState(0.01);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setSucesso("");
    setErro("");
    // Aqui você pode integrar com o contrato ou backend
    setTimeout(() => {
      setEnviando(false);
      setSucesso("Doação enviada com sucesso! Obrigado pela esperança.");
      setValor(0.01);
      setMensagem("");
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-6 w-full max-w-lg border-2 border-[#ef4444]">
      <h1 className="text-3xl font-extrabold text-[#ef4444] mb-2 text-center">Doação para Revitalização do Mangue</h1>
      <label className="flex flex-col gap-2 font-semibold text-lg">
        Escolha a zona:
        <select value={zona} onChange={e => setZona(e.target.value)} className="rounded-lg border-2 border-[#ef4444] p-2 text-lg">
          {ZONAS.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2 font-semibold text-lg">
        Valor da doação (ETH):
        <input type="number" min={0.01} step={0.01} value={valor} onChange={e => setValor(Number(e.target.value))} className="rounded-lg border-2 border-[#ef4444] p-2 text-lg" />
      </label>
      <label className="flex flex-col gap-2 font-semibold text-lg">
        Mensagem de esperança:
        <textarea value={mensagem} onChange={e => setMensagem(e.target.value)} maxLength={120} rows={3} className="rounded-lg border-2 border-[#ef4444] p-2 text-lg" placeholder="Deixe uma mensagem para inspirar outros!" />
      </label>
      <button type="submit" disabled={enviando} className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-bold text-xl py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
        {enviando ? "Enviando..." : "Doar agora"}
      </button>
      {sucesso && <div className="text-green-600 font-bold text-center mt-2">{sucesso}</div>}
      {erro && <div className="text-red-600 font-bold text-center mt-2">{erro}</div>}
    </form>
  );
};
