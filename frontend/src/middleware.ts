import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";

// 🔓 Rotas públicas — controlam o que acontece quando o usuário está autenticado
const publicRoutes = [
  { path: "/", whenAutenticated: "next" }, // ✅ permite acessar mesmo logado
  { path: '/forgot-password', whenAutenticated: 'next' },
  { path: '/reset-password', whenAutenticated: 'next' },
  { path: "/login", whenAutenticated: "redirect" },
  { path: "/register", whenAutenticated: "redirect" },
  { path: "/sobre", whenAutenticated: "next" },
  { path: "/contato", whenAutenticated: "next" },
  { path: "/politica", whenAutenticated: "next" },
  { path: "/pricing", whenAutenticated: "next" },
];

// 🔒 Rota padrão para redirecionar quem não está autenticado
const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

// 🚧 Rota de painel (para redirecionar logados, se quiser)
const DASHBOARD_ROUTE = "/dashboard";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("token"); // 🔑 Token salvo nos cookies

  // 1️⃣ Usuário sem token → verificamos se pode acessar
  if (!authToken) {
    // Rota é pública → pode seguir
    if (publicRoute) return NextResponse.next();

    // Rota é privada → redireciona pro login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // 2️⃣ Usuário com token → verificamos o tipo de rota
  if (authToken && publicRoute) {
    // Se a rota pública pede redirecionamento → envia para "/"
    if (publicRoute.whenAutenticated === "redirect") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    // (Opcional) Se quiser redirecionar logados da home para dashboard
    if (publicRoute.whenAutenticated === "redirect-dashboard") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = DASHBOARD_ROUTE;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3️⃣ Usuário logado acessando rota privada → pode seguir
  return NextResponse.next();
}

// ⚙️ Configuração do matcher (middleware roda em todas as páginas, exceto API/arquivos estáticos)
export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
