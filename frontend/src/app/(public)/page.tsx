'use client';

import React, { useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

import ConsentFooter from './pages/ConsentFooter';
import FeaturesSection from './pages/FeaturesSection';
import FeaturesSection1 from './pages/FeaturesSection1';
import FeaturesSection2 from './pages/FeaturesSection2';
import AboutSection from './pages/AboutSection';
import ArticlesSection from './pages/ArticlesSection';
import { FloatingShare } from './components/FloatingShare';

const articlesMock = [
  {
    id: 1,
    title: 'Por que usar encurtadores de URL? Vantagens para negócios digitais',
    summary:
      'Entenda como URLs curtas aumentam a confiança e a usabilidade nas suas campanhas.',
    url: 'https://blog.hubspot.com/marketing/',
  },
  {
    id: 2,
    title: 'Os benefícios do encurtamento de URLs para marketing digital',
    summary:
      'Como links curtos ajudam a melhorar o engajamento e as métricas das campanhas.',
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

  // 🌌 EFEITO DE FUNDO ESPACIAL FUTURISTA
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    let animationFrameId: number;
  
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  
    // Cria estrelas
    const stars = Array.from({ length: 400 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      o: 0.2 + Math.random() * 0.8,
    }));
  
    const draw = () => {
      // Fundo com leve gradiente
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(10, 10, 30, 0.9)');
      gradient.addColorStop(1, 'rgba(0, 0, 20, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Estrelas
      for (let star of stars) {
        star.z -= 2;
        if (star.z <= 0) star.z = canvas.width;
  
        const k = 128.0 / star.z;
        const px = star.x * k + canvas.width / 2;
        const py = star.y * k + canvas.height / 2;
  
        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = (1 - star.z / canvas.width) * 2.5;
          ctx.beginPath();
          ctx.fillStyle = `rgba(139, 92, 246, ${star.o})`;
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
  
      animationFrameId = requestAnimationFrame(draw);
    };
  
    draw();
  
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef]);  

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
            Transforme seus links longos em URLs curtas e personalizadas, prontas
            para compartilhar nas redes sociais, campanhas e sites. Monitore
            cliques, desempenho e conquiste uma presença digital mais inteligente.
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
      <ConsentFooter />
      {/*<CallToAction onRegisterClick={handleRegister} />*/}

      <footer className="footer">
        <small>
          © {new Date().getFullYear()} UrlCurt. Todos os direitos reservados. |{' '}
          <a href="/politica">Política de Privacidade</a>
        </small>
      </footer>

      {/* Canvas Futurista */}
      <canvas
        ref={canvasRef}
        className="background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none', // evita bloquear cliques
        }}
      />

      {/* 🔹 Estilo aprimorado */}
      <style jsx>{`
        :root {
          --accent: #6366f1;
          --accent-strong: #8b5cf6;
          --text-light: #e2e8f0;
        }

        /* 🔹 O botão hambúrguer fica escondido por padrão (desktop) */
        /* 🔹 Esconde o botão hambúrguer no desktop */
.hamburger {
  display: none;
}

/* 🔹 Mostra o menu normalmente em desktop */
.nav-links {
  display: flex;
  gap: 1rem;
}

/* 🔹 Mobile: botão aparece, menu fica oculto por padrão */
@media (max-width: 768px) {
  .hamburger {
    display: block;
    font-size: 1.8rem;
    background: transparent;
    border: none;
    color: #8b5cf6;
    cursor: pointer;
    z-index: 100; /* acima do menu */
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(15, 32, 39, 0.98);
    padding: 1rem;
    gap: 1rem;
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(139, 92, 246, 0.3);
    transition: all 0.3s ease;
  }

  /* 🔹 Quando ativo: mostra o menu */
  .nav-links.active {
    display: flex;
    animation: slideDown 0.3s ease forwards;
  }

  /* 🔹 Animação suave */
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}


        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          color: var(--text-light);
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
          margin: 100px auto 60px;
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
        }

        .btn-primary:hover {
          background: var(--accent);
          transform: scale(1.05);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: white;
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

        .background {
          background: radial-gradient(circle at 20% 20%, #1e1b4b, #0f172a, #020617);
          filter: brightness(1.2) saturate(1.1);
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
