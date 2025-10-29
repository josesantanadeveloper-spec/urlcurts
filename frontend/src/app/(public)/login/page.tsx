'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { api } from '../../lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await api.post(
        '/login',
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        { withCredentials: true }
      )

      setSuccess(response.data.msg || 'Login realizado com sucesso!')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: any) {
      console.error('Erro no login:', err)
      setError(err.response?.data?.message || 'Usuário ou senha incorreta');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {loading && <LoadingOverlay visible={loading} message="Autenticando..." />}

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm relative z-0"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">
          Login
        </h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-gray-900 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Campo de senha com ícone de olho */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            aria-label="Mostrar/ocultar senha"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex justify-between text-sm mb-6">
          <Link href="/forgot-password" className="text-indigo-600 hover:underline">
            Esqueci a senha
          </Link>
          <Link href="/register" className="text-indigo-600 hover:underline">
            Cadastre-se
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-3 rounded-lg transition ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-4 w-full border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-100 transition"
        >
          Voltar para Home
        </button>
      </form>
    </div>
  )
}

// ======================
// Overlay de Loading
// ======================
interface LoadingOverlayProps {
  visible: boolean
  message: string
}

function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="rounded-lg bg-white/5 backdrop-blur-md p-6 flex flex-col items-center gap-4">
        <Loader2 size={36} className="animate-spin text-white" />
        <div className="text-white font-medium">{message}</div>
      </div>
    </div>
  )
}
