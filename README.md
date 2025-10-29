# UrlCurt
**Encurtador de URLs moderno, seguro e com monitoramento em tempo real**

## 🚀 Visão Geral
O **UrlCurt** é uma plataforma de encurtamento de URLs criada para facilitar o compartilhamento de links, proporcionando **controle completo**, **estatísticas de tráfego** e uma interface moderna e responsiva.

Com o UrlCurt, você pode:
- Transformar URLs longas em links curtos personalizados.
- Acompanhar cliques e métricas em tempo real.
- Gerenciar links e perfil de usuário.
- Operar com segurança usando tokens armazenados em cookies HttpOnly.
- Desfrutar de uma interface moderna com efeitos visuais interativos.

## 🧩 Funcionalidades Principais
- **Encurtamento de URLs**: Crie links curtos e personalize slugs.
- **Dashboard de links**: Visualize estatísticas detalhadas, incluindo cliques, datas e tendências.
- **Autenticação segura**: Login com tokens armazenados em cookies HttpOnly.
- **Responsividade completa**: Funciona perfeitamente em dispositivos móveis e desktop.
- **Interface moderna**: Design clean com tema escuro e efeitos visuais futuristas.
- **Compartilhamento rápido**: Links prontos para redes sociais e campanhas de marketing.

## 🏗 Arquitetura do Projeto
- **Frontend**: Next.js + React, com hooks, efeitos visuais no canvas e navegação dinâmica.
- **Backend**: Node.js (ou outro stack) para gerenciamento de URLs, autenticação e estatísticas.
- **Banco de dados**: Estrutura para armazenar URLs, slugs, contagem de cliques, usuários e tokens.
- **Autenticação**: Cookie seguro (`token`) para verificar se o usuário está logado.
- **Componentização**: Layout modular com seções reutilizáveis (Features, About, Articles, Footer).

## 🎨 Tecnologias Utilizadas
- **Next.js** — renderização híbrida (SSG + SSR)
- **React** — criação de componentes modernos
- **TypeScript** — tipagem estática para maior segurança
- **CSS Modules / JSX Styling** — estilização modular e responsiva
- **Node.js** — backend e API
- **Cookies HttpOnly** — autenticação segura
- **Canvas 2D** — efeitos visuais interativos na interface

## 🧪 Instalação e Execução Local
1. Clone o repositório:
```bash
git clone https://github.com/josesantanadeveloper-spec/urlcurts.git
