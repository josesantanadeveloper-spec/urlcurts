'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/app/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const res = await api.post('/recover-password', { email })

      if (res.status === 200) {
        setMessage('✅ Link de recuperação enviado para o seu e-mail!')
        setTimeout(() => router.push('/login'), 4000)
      }
    } catch (err: any) {
      console.error('Erro:', err.response?.data || err)

      // Aqui capturamos os erros do backend
      if (err.response?.status === 404) {
        setMessage('❌ E-mail não encontrado no banco de dados.')
      } else if (err.response?.status === 400) {
        setMessage('⚠️ O campo de e-mail é obrigatório.')
      } else {
        setMessage('🚨 Erro ao enviar o link de recuperação. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">
          Recuperar Senha
        </h2>

        <input
          type="email"
          placeholder="Digite seu e-mail cadastrado"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-gray-900 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-3 rounded-lg transition ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Verificando...' : 'Enviar link por e-mail'}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-4 ${
              message.startsWith('✅')
                ? 'text-green-600'
                : message.startsWith('⚠️')
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-4 w-full border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-100 transition"
        >
          Voltar para login
        </button>
      </form>
    </div>
  )
}
