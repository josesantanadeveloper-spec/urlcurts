import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server"

// 🔓 Lista de rotas públicas
// Cada rota pode ter um comportamento definido para quando o usuário já estiver autenticado:
// - "redirect" → se o usuário estiver logado, redireciona para a página inicial
// - "next" → permite o acesso normalmente
const publicRoutes = [
    { path: '/', whenAutenticated: 'redirect' },
    { path: '/login', whenAutenticated: 'redirect' },
    { path: '/sobre', whenAutenticated: 'redirect' },
    { path: '/contato', whenAutenticated: 'redirect' },
    { path: '/politica', whenAutenticated: 'redirect' },
    { path: '/register', whenAutenticated: 'redirect' },
    { path: '/pricing', whenAutenticated: 'next' },
]

// 🔒 Rota padrão para redirecionamento quando o usuário não está autenticado
const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('token') // Token de autenticação salvo em cookies

    // Caso não haja token e a rota seja pública → permite o acesso
    if (!authToken && publicRoute) {
        return NextResponse.next()
    }

    // Caso não haja token e a rota NÃO seja pública → redireciona para login
    if (!authToken && !publicRoute) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
        return NextResponse.redirect(redirectUrl)
    }

    // Caso exista token e a rota seja pública, mas marcada como "redirect" → envia usuário para "/"
    if (authToken && publicRoute && publicRoute?.whenAutenticated == 'redirect') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
    }

    // Caso exista token e a rota seja privada → acesso permitido
    if (authToken && !publicRoute) {
        return NextResponse.next()
    }

    // Caso nenhuma das condições anteriores seja atendida → segue normalmente
    return NextResponse.next()
}

// ⚙️ Configuração do matcher
// Esse padrão garante que o middleware seja executado em todas as rotas,
// exceto rotas da API, arquivos estáticos e metadados do Next.js
export const config: MiddlewareConfig = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
