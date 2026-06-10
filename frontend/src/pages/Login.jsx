import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const url = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await axios.post(`https://spirited-charisma-production-c78c.up.railway.app${url}`, form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu!')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}>
      <div style={{ width: '400px', background: '#12121e', borderRadius: '16px', border: '1px solid #1e1e35', padding: '32px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', background: '#7c3aed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 900 }}>
            NONE <span style={{ color: '#a78bfa' }}>MANGA</span>
          </h1>
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', background: '#0d0d14', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '13px',
                background: tab === t ? '#7c3aed' : 'transparent',
                color: tab === t ? '#fff' : '#666',
                transition: 'all 0.2s'
              }}>
              {t === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tab === 'register' && (
            <input
              placeholder="Kullanıcı adı"
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              style={{ background: '#0d0d14', border: '1px solid #2a2a3a', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={{ background: '#0d0d14', border: '1px solid #2a2a3a', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
          <input
            placeholder="Şifre"
            type="password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ background: '#0d0d14', border: '1px solid #2a2a3a', borderRadius: '10px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Bekle...' : tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </div>

        <p style={{ color: '#444', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>← Ana sayfaya dön</Link>
        </p>

      </div>
    </div>
  )
}

export default Login