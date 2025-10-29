'use client';

import React, { useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

import ConsentFooter from './pages/ConsentFooter';
import FeaturesSection from './pages/FeaturesSection';
import FeaturesSection1 from './pages/FeaturesSection1';
import FeaturesSection2 from './pages/FeaturesSection2';
import AboutSection from './pages/AboutSection';
import CallToAction from './pages/CallToAction';
import ArticlesSection from './pages/ArticlesSection';
import { FloatingShare } from './components/FloatingShare';

const articlesMock = [
  {
    id: 1,
    title: 'Por que usar encurtadores de URL? Vantagens para negócios digitais',
    summary: 'Entenda como URLs curtas aumentam a confiança e a usabilidade nas suas campanhas.',
    url: 'https://blog.hubspot.com/marketing/',
  },
  {
    id: 2,
    title: 'Os benefícios do encurtamento de URLs para marketing digital',
    summary: 'Como links curtos ajudam a melhorar o engajamento e as métricas das campanhas.',
    url: 'https://neilpatel.com/blog/',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    router.push('/login');
  };

  const handleRegister = () => router.push('/register');
  const handleSobre = () => router.push('/sobre');
  const handleContato = () => router.push('/contato');

  const handleLogout = () => {
    setIsLoggedIn(false);
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Encurtador de Link | UrlCurt</title>
        <meta
          name="description"
          content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real."
        />
      </Head>

      {/* 🔹 Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => router.push('/')}>
          UrlCurt
        </div>

        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {!isLoggedIn ? (
            <>
              <button onClick={handleSobre} className="btn btn-login">
                Sobre
              </button>
              <button onClick={handleContato} className="btn btn-login">
                Contato
              </button>
              <button onClick={handleLogin} className="btn btn-login">
                Login
              </button>
              <button onClick={handleRegister} className="btn btn-register">
                Registrar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-user"
                title="Perfil"
              >
                👤
              </button>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <FloatingShare />

      {/* Hero */}
      <main className="hero">
        <div className="hero-content">
          <h1>
            Encurte e Compartilhe URLs com{' '}
            <span className="highlight">Facilidade</span>
          </h1>

          <p>
            Transforme seus links longos em URLs curtas e personalizadas, prontas para compartilhar nas redes sociais, campanhas e sites. 
            Monitore cliques, desempenho e conquiste uma presença digital mais inteligente.
          </p>

          <div className="hero-buttons">
            <button onClick={handleRegister} className="btn btn-primary">
              Comece Agora 🚀
            </button>
            <button onClick={handleLogin} className="btn btn-secondary">
              Já Tenho Conta
            </button>
          </div>
        </div>
      </main>

      <FeaturesSection />
      <FeaturesSection1 />
      <FeaturesSection2 />
      <AboutSection />
      <ArticlesSection articles={articlesMock} />
      {/*<CallToAction onRegisterClick={handleRegister} />*/}
      <ConsentFooter />

      <footer className="footer">
        <small>
          © {new Date().getFullYear()} UrlCurt. Todos os direitos reservados. |{' '}
          <a href="/politica">Política de Privacidade</a>
        </small>
      </footer>

      {/* Canvas */}
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
        }}
      />

      {/* 🔹 Estilo visual 3D aprimorado */}
      <style jsx>{`
        :root {
          --bg-dark: #0f172a;
          --accent: #6366f1;
          --accent-strong: #8b5cf6;
          --text-light: #e2e8f0;
        }

        body {
          margin: 0;
          background: radial-gradient(circle at 25% 25%, #1e1b4b, #0f172a);
          color: var(--text-light);
          font-family: 'Inter', sans-serif;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(99, 102, 241, 0.2);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 10;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-login {
          background: transparent;
          color: #cbd5e1;
          border: none;
        }

        .btn-login:hover {
          color: white;
        }

        .btn-register {
          background: var(--accent-strong);
          color: white;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
        }

        .btn-register:hover {
          background: var(--accent);
        }

        .hero {
          max-width: 900px;
          margin: 160px auto 60px;
          text-align: center;
          padding: 0 1.5rem;
          color: #e0e7ff;
        }

        .hero h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #fff;
        }

        .highlight {
          color: var(--accent-strong);
        }

        .hero p {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #cbd5e1;
          margin-bottom: 2rem;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .btn-primary {
          background: var(--accent-strong);
          color: white;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          border: none;
        }

        .btn-primary:hover {
          background: var(--accent);
          transform: scale(1.05);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border: none;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .footer {
          text-align: center;
          padding: 2rem 0;
          color: #94a3b8;
          font-size: 0.9rem;
          border-top: 1px solid rgba(99, 102, 241, 0.15);
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.3rem;
          }
          .hero p {
            font-size: 1rem;
          }
          .nav-links {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
