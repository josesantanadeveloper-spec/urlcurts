import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RecoverPasswordResponse {
  message: string;
}

export const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      const res = await api.post<RecoverPasswordResponse>('/api/recover-password', { email });
      setStatus(res.data.message || 'Link de recuperação enviado com sucesso!');
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        navigate('/login');
      }, 4000);
    } catch (err: any) {
      setStatus(err.response?.data?.error || 'Erro ao enviar link de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Recuperar Senha</h2>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Enviando...' : 'Enviar link por e-mail'}
        </button>

        {status && <p style={{ marginTop: 12, color: '#555' }}>{status}</p>}

        <button
          type="button"
          onClick={() => navigate('/login')}
          style={styles.link}
        >
          Voltar para login
        </button>
      </form>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Link de recuperação enviado!</h3>
            <p>Agora confira seu E-mail...</p>
            <div style={styles.spinner}></div>
          </div>
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: { maxWidth: 400, margin: '40px auto', padding: 30, background: '#f9f9f9', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  title: { marginBottom: 24, textAlign: 'center', fontWeight: 600 },
  input: { width: '100%', padding: 12, marginBottom: 16, borderRadius: 5, border: '1px solid #ccc', fontSize: 16 },
  button: { width: '100%', padding: 12, backgroundColor: '#4F46E5', color: 'white', fontWeight: 600, border: 'none', borderRadius: 5, cursor: 'pointer' },
  link: { background: 'none', border: 'none', marginTop: 20, textDecoration: 'underline', cursor: 'pointer', color: '#007bff' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { backgroundColor: '#fff', padding: 30, borderRadius: 8, textAlign: 'center', width: 300, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', color: 'green' },
  spinner: { margin: '20px auto 0', border: '6px solid #f3f3f3', borderTop: '6px solid #4F46E5', borderRadius: '50%', width: 30, height: 30, animation: 'spin 1s linear infinite' },
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
