'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/app/lib/api'

export default function ResetPasswordPage() {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
    match: false,
  })

  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const tokenFromUrl = params.get('token')
    if (tokenFromUrl) setToken(tokenFromUrl)
  }, [params])

  // Atualiza validação da senha
  useEffect(() => {
    setPasswordValid({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword),
      match: !!newPassword && !!confirmPassword && newPassword === confirmPassword,
    })
  }, [newPassword, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('')

    if (!token) {
      setStatus('Token inválido ou expirado.')
      return
    }

    if (!passwordValid.length || !passwordValid.uppercase || !passwordValid.number || !passwordValid.symbol) {
      setStatus('A senha não atende a todos os requisitos.')
      return
    }

    if (!passwordValid.match) {
      setStatus('As senhas não coincidem.')
      return
    }

    setLoading(true)

    try {
      const res = await api.post('/reset-password', { token, newPassword })
      setStatus(res.data.message || 'Senha redefinida com sucesso!')
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setStatus(err.response?.data?.error || 'Erro ao redefinir a senha')
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
          Redefinir Senha
        </h2>

        <input
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mb-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Confirme a nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-gray-900 focus:ring-2 focus:ring-indigo-500"
        />

        <ul className="mb-4 text-sm text-gray-700">
          <li className={passwordValid.length ? 'text-green-600' : ''}>
            • Pelo menos 8 caracteres
          </li>
          <li className={passwordValid.uppercase ? 'text-green-600' : ''}>
            • Uma letra maiúscula
          </li>
          <li className={passwordValid.number ? 'text-green-600' : ''}>
            • Um número
          </li>
          <li className={passwordValid.symbol ? 'text-green-600' : ''}>
            • Um símbolo especial
          </li>
          <li className={passwordValid.match ? 'text-green-600' : ''}>
            • Senhas coincidem
          </li>
        </ul>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-3 rounded-lg transition ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Redefinindo...' : 'Redefinir senha'}
        </button>

        {status && <p className="text-center text-sm mt-4 text-gray-700">{status}</p>}
      </form>
    </div>
  )
}
