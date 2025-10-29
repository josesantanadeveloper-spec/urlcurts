"use client";

import { useState, useEffect } from "react";
import { User2, Mail, Phone, MapPin, Loader2, X } from "lucide-react";
import { api } from "@/app/lib/api";

interface UserProfileManagerProps {
  closeModal: () => void;
}

interface User {
  id: number;
  name: string;
  age?: number;
  email: string;
  phone: string;
}

const UserProfileManager: React.FC<UserProfileManagerProps> = ({ closeModal }) => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Busca dados do usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const { data } = await api.get("/me", { withCredentials: true });
        setUser(data);
      } catch (err: any) {
        console.error("Erro ao buscar usuário:", err.response || err.message);
        if (err.response?.status === 401) {
          setError("Token inválido ou expirado. Faça login novamente.");
        } else {
          setError("Erro ao carregar dados do usuário.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (user) setUser({ ...user, [name]: value });
  };

  // Atualiza perfil do usuário
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await api.put("/me", user, { withCredentials: true });
      setUser(data);
      setSuccess("Perfil atualizado com sucesso!");
      setEditing(false);
    } catch (err: any) {
      console.error("Erro ao salvar usuário:", err.response || err.message);
      if (err.response?.status === 401) {
        setError("Token inválido ou expirado. Faça login novamente.");
      } else {
        setError(err.response?.data?.error || "Erro ao salvar usuário.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Erro ao sair:", err);
    } finally {
      window.location.href = "/login";
    }
  };

  if (loading) return <LoadingOverlay message="Carregando perfil..." />;
  if (error) return <p className="text-center mt-10 text-red-400">{error}</p>;
  if (!user) return null;

  return (
    <div className="relative bg-gray-900 text-white p-8 rounded-2xl shadow-xl border border-gray-700 max-w-3xl mx-auto space-y-6">
      {saving && <LoadingOverlay message="Salvando alterações..." />}

      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 text-indigo-400">
          <User2 size={26} />
          <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
        </div>

        <button
          onClick={closeModal}
          className="p-2 rounded-full hover:bg-gray-800 text-gray-300 transition"
          title="Fechar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Campos */}
      <div className="space-y-4">
        <InputField
          icon={<User2 size={18} />}
          label="Nome"
          name="name"
          value={user.name}
          editable={editing}
          onChange={handleChange}
        />
        <InputField
          icon={<Mail size={18} />}
          label="Email"
          name="email"
          value={user.email}
          editable={editing}
          onChange={handleChange}
        />
        <InputField
          icon={<Phone size={18} />}
          label="Telefone"
          name="phone"
          value={user.phone}
          editable={editing}
          onChange={handleChange}
        />
        <InputField
          icon={<MapPin size={18} />}
          label="Idade"
          name="age"
          value={user.age?.toString() || ""}
          editable={editing}
          onChange={handleChange}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4 mt-6">
        {editing ? (
          <>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-2 disabled:opacity-60"
            >
              {saving && <Loader2 className="animate-spin w-5 h-5" />}
              Salvar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Editar Perfil
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Sair da Conta
            </button>
          </>
        )}
      </div>

      {success && <p className="text-green-400 mt-2 text-sm">{success}</p>}
    </div>
  );
};

export default UserProfileManager;

// Campo de input genérico com ícones
function InputField({
  icon,
  label,
  name,
  value,
  editable,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  editable: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 bg-gray-800">
        <div className="mr-2 text-indigo-400">{icon}</div>
        {editable ? (
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        ) : (
          <span className="text-gray-300 break-all">{value}</span>
        )}
      </div>
    </div>
  );
}

// Overlay de loading moderno
function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-400 mb-3" />
      <div className="text-indigo-300 font-medium">{message}</div>
    </div>
  );
}
