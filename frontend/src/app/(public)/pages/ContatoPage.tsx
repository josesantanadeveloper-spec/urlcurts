'use client';
import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/navigation';
import './LoadingSpinner.css';

interface ContactPageData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const service_email = process.env.NEXT_PUBLIC_YOUR_SERVICE_ID!;
  const template_email = process.env.NEXT_PUBLIC_YOUR_TEMPLATE_ID!;
  const user_email = process.env.NEXT_PUBLIC_YOUR_USER_ID!;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter(); // ✅ substitui useNavigate()

  const [formData, setFormData] = useState<ContactPageData>({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Por favor, preencha todos os campos.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus('E-mail inválido.');
      return;
    }

    setIsLoading(true);

    try {
      await emailjs.send(service_email, template_email, { ...formData }, user_email);
      setFormData({ name: '', email: '', message: '' });
      setIsLoading(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push('/'); // ✅ substitui navigate('/')
      }, 8000);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      setStatus('Erro ao enviar. Tente novamente mais tarde.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Encurtador de link | UrlCurt</title>
        <meta
          name="description"
          content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real."
        />
        <meta property="og:title" content="Encurtador de URL | UrlCurt" />
        <meta property="og:description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />
        <meta property="og:image" content="https://www.urlcurt.com.br/images/share-image.png" />
        <meta property="og:url" content="https://www.urlcurt.com.br" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Encurtador de Link | UrlCurt" />
        <meta name="twitter:description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />
        <meta name="twitter:image" content="https://www.urlcurt.com.br/images/share-image.png" />
        <link rel="canonical" href="https://www.urlcurt.com.br/" />
      </Helmet>
  
      <canvas
        ref={canvasRef}
        className="background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          display: 'block',
        }}
      />
  
      <div
        className="flex items-center justify-center min-h-screen px-4"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%)' }}
      >
        <div
          className="w-full text-gray-700 max-w-md p-8 rounded-2xl shadow-2xl"
          style={{ backgroundColor: '#ffffff' }}
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Fale Conosco
          </h2>
  
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p className="loading-text">Enviando sua mensagem...</p>
            </div>
          )}
  
          {showSuccessModal && (
            <div style={modalOverlayStyle}>
              <div style={modalStyle}>
                <h3 style={{ marginBottom: '10px' }}>Mensagem enviada com sucesso!</h3>
                <p>Entraremos em contato em breve.</p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  style={closeButtonStyle}
                >
                  OK
                </button>
              </div>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nome:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">E-mail:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Mensagem:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full p-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              style={{ minHeight: '120px' }}
            ></textarea>
          </div>

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition duration-300"
          >
            Enviar
          </button>

          {/* Botão Voltar */}
          <button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition duration-300"
            onClick={() => router.push('/')}>
            Voltar para a tela inicial
          </button>

          {status && (
            <p className="text-center text-red-500 text-sm mt-2">{status}</p>
          )}
        </form>
        </div>
      </div>
    </>
  );  
};

export default ContactPage;

// 🎨 Estilos do modal
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#ffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  maxWidth: '400px',
  width: '80%',
};

const closeButtonStyle: React.CSSProperties = {
  marginTop: '15px',
  padding: '8px 16px',
  backgroundColor: '#fff',
  color: '#0000',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
