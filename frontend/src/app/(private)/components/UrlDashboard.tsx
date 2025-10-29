"use client";

import React, { useEffect, useState, Fragment } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import type { ApexOptions } from "apexcharts";
import { api } from "@/app/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from "./LoadingSpinner";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Copy, Trash2, Edit, Save, Eye, EyeOff, Settings } from "lucide-react";
import UserProfileManager from "./UserProfileManager";

interface Url {
  id: number;
  original: string;
  slug: string;
  visits: number;
  createdAt: string;
}

interface TrafficEntry {
  date: string;
  count: number;
}

export const UrlManager: React.FC = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [copiedUrlId, setCopiedUrlId] = useState<number | null>(null);
  const [trafficData, setTrafficData] = useState<Record<number, TrafficEntry[]>>({});
  const [expandedUrlId, setExpandedUrlId] = useState<number | null>(null);
  const [loadingTraffic, setLoadingTraffic] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedUrls, setUpdatedUrls] = useState<Record<number, Url>>({});
  const [visibleCount, setVisibleCount] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<Url | null>(null);
  const [creatingUrl, setCreatingUrl] = useState(false);
  const [savingUrlId, setSavingUrlId] = useState<number | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false); // Novo estado do modal de usuário

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await api.get<{ urls: Url[] }>("/urls", { withCredentials: true });
      setUrls(res.data.urls);
    } catch (err) {
      console.error("Erro ao buscar URLs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUrl = async () => {
    if (!newUrl) return;
    setCreatingUrl(true);
    try {
      const payload: { originalUrl: string; customSlug?: string } = { originalUrl: newUrl };
      if (newSlug.trim()) payload.customSlug = newSlug.trim();
      const res = await api.post<Url>("/urls", payload, { withCredentials: true });
      setUrls([res.data, ...urls]);
      setNewUrl("");
      setNewSlug("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao criar URL");
    } finally {
      setCreatingUrl(false);
    }
  };

  const handleCopy = (urlId: number, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedUrlId(urlId);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  const fetchTraffic = async (urlId: number) => {
    setLoadingTraffic(urlId);
    try {
      const res = await api.get<TrafficEntry[]>(`/urls/${urlId}/traffic`);
      setTrafficData(prev => ({ ...prev, [urlId]: res.data }));
      setExpandedUrlId(urlId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTraffic(null);
    }
  };

  const handleEdit = (url: Url) => {
    setEditingId(url.id);
    setUpdatedUrls(prev => ({ ...prev, [url.id]: { ...url } }));
  };

  const handleSave = async (id: number) => {
    const updated = updatedUrls[id];
    setSavingUrlId(id);
    try {
      const payload: { originalUrl: string; shortSlug?: string } = { originalUrl: updated.original };
      if (updated.slug.trim()) payload.shortSlug = updated.slug.trim();
      const res = await api.put<Url>(`/urls/${id}`, payload);
      setUrls(urls.map(u => (u.id === id ? res.data : u)));
      setEditingId(null);
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao salvar URL");
    } finally {
      setSavingUrlId(null);
    }
  };

  const openDeleteModal = (url: Url) => {
    setUrlToDelete(url);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!urlToDelete) return;
    try {
      await api.delete(`/urls/${urlToDelete.id}`, { withCredentials: true });
      setUrls(urls.filter(u => u.id !== urlToDelete.id));
      setDeleteModalOpen(false);
      setUrlToDelete(null);
    } catch {
      alert("Erro ao deletar URL");
    }
  };

  const buildChartOptions = (data: TrafficEntry[]) => {
    const options: ApexOptions = {
      chart: { type: "area" as const, height: 260, toolbar: { show: false }, background: "transparent" },
      xaxis: { type: "datetime", labels: { style: { colors: "#ffffff" } } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3, colors: ["#6366f1"] },
      grid: { borderColor: "#444", strokeDashArray: 4 },
      fill: {
        type: "gradient",
        gradient: { shade: "dark", type: "vertical", shadeIntensity: 0.3, gradientToColors: ["#818cf8"], opacityFrom: 0.6, opacityTo: 0.05, stops: [0, 90, 100] },
      },
      markers: { size: 4, colors: ["#6366f1"], strokeColors: "#fff", strokeWidth: 2 },
      tooltip: { theme: "dark", x: { format: "dd/MM/yyyy" } },
      yaxis: { labels: { style: { colors: "#fff" } } },
    };

    const series = [{ name: "Visitas", data: data.map(d => d.count) }];
    return { options, series };
  };

  if (loading) return <p className="text-gray-300 mt-8 text-center">Carregando URLs...</p>;

  const visibleUrls = urls.slice(0, visibleCount);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Fundo espaço sideral */}
      <Particles
        className="absolute inset-0 -z-10"
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          particles: {
            color: { value: ["#ffffff", "#aaaaff", "#ffddff"] },
            links: { enable: true, distance: 200, color: "#8888ff", opacity: 0.3, width: 1 },
            collisions: { enable: true },
            move: { enable: true, speed: 1.5, direction: "none", outModes: "bounce" },
            number: { value: 80 },
            opacity: { value: 0.5, random: true },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
      />

      {/* Botão de configurações do usuário */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={() => setUserModalOpen(true)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition"
          title="Configurações do usuário"
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-indigo-400 mb-6">Gerenciador de URLs</h2>

        {/* Criar nova URL */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Cole a URL aqui"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white transition"
          />
          <input
            type="text"
            placeholder="Slug personalizado (opcional)"
            value={newSlug}
            onChange={e => setNewSlug(e.target.value)}
            className="px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-white transition"
          />
          <button
            onClick={handleCreateUrl}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            {creatingUrl ? <LoadingSpinner /> : "Criar URL"}
          </button>
        </div>

        {/* Lista de URLs */}
        <ul className="space-y-4">
          {visibleUrls.map(url => {
            const shortUrl = `http://localhost:4000/${url.slug}`;
            const isExpanded = expandedUrlId === url.id;
            const history = trafficData[url.id];
            const isLoading = loadingTraffic === url.id;
            const isEditing = editingId === url.id;

            return (
              <li key={url.id} className="bg-gray-900/90 backdrop-blur-sm shadow-lg rounded-xl p-5 border border-gray-700 hover:shadow-indigo-500/50 transition">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex-1">
                    {isEditing ? (
                      <>
                        <input
                          value={updatedUrls[url.id]?.original || ""}
                          onChange={e =>
                            setUpdatedUrls(prev => ({ ...prev, [url.id]: { ...prev[url.id], original: e.target.value } }))
                          }
                          className="w-full mb-1 px-3 py-2 border rounded bg-gray-800 text-white transition"
                          disabled={savingUrlId === url.id}
                        />
                        <input
                          value={updatedUrls[url.id]?.slug || ""}
                          onChange={e =>
                            setUpdatedUrls(prev => ({ ...prev, [url.id]: { ...prev[url.id], slug: e.target.value } }))
                          }
                          className="w-full mb-1 px-3 py-2 border rounded bg-gray-800 text-white transition"
                          disabled={savingUrlId === url.id}
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300"><strong>Original:</strong> <a href={url.original} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{url.original}</a></p>
                        <p className="text-gray-300 mt-1"><strong>Encurtada:</strong> <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{shortUrl}</a></p>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 mt-2 md:mt-0">
                    {isEditing ? (
                      <button onClick={() => handleSave(url.id)} className="flex items-center gap-1 px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white transition" disabled={savingUrlId === url.id}>
                        <Save size={16} /> {savingUrlId === url.id ? <LoadingSpinner /> : "Salvar"}
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(url)} className="flex items-center gap-1 px-3 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white transition">
                        <Edit size={16} /> Editar
                      </button>
                    )}

                    <button onClick={() => openDeleteModal(url)} className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition">
                      <Trash2 size={16} /> Deletar
                    </button>

                    <button onClick={() => handleCopy(url.id, shortUrl)} className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition ${copiedUrlId === url.id ? "bg-green-500 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"}`}>
                      <Copy size={16} /> {copiedUrlId === url.id ? "Copiado!" : "Copiar"}
                    </button>

                    <button
                      onClick={() => {
                        if (isExpanded) setExpandedUrlId(null);
                        else if (!history) fetchTraffic(url.id);
                        else setExpandedUrlId(url.id);
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
                    >
                      {isExpanded ? <><EyeOff size={16} /> Ocultar tráfego</> : isLoading ? "Carregando..." : <><Eye size={16} /> Ver tráfego</>}
                    </button>
                  </div>

                  <div className="mt-3 text-gray-400 text-sm">
                    <span className="mr-4"><strong>Visitas:</strong> {url.visits}</span>
                    <span><strong>Criada em:</strong> {new Date(url.createdAt).toLocaleString()}</span>
                  </div>

                  {isExpanded && history && (
                    <div className="mt-5 bg-gray-800/80 p-4 rounded-lg shadow-inner">
                      <ReactApexChart
                        options={buildChartOptions(history).options}
                        series={buildChartOptions(history).series}
                        type="area"
                        height={260}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {visibleCount < urls.length && (
          <div className="text-center mt-4">
            <button onClick={() => setVisibleCount(prev => prev + 5)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Ver mais
            </button>
          </div>
        )}

        {/* Modal de exclusão */}
        <Transition appear show={deleteModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setDeleteModalOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title className="text-lg font-medium text-white">Confirmar exclusão</Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        Tem certeza que deseja deletar a URL <strong>{urlToDelete?.original}</strong>?
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button type="button" className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white" onClick={() => setDeleteModalOpen(false)}>Cancelar</button>
                      <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={handleDelete}>Deletar</button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Modal do perfil do usuário */}
        <Transition appear show={userModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20" onClose={() => setUserModalOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-70" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                    <UserProfileManager closeModal={() => setUserModalOpen(false)} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default UrlManager;
