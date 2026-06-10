import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [favOpen, setFavOpen] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]') } catch { return [] }
  })
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  window.refreshFavorites = () => {
    try { setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]')) } catch {}
  }

  const removeFav = (id) => {
    const updated = favorites.filter(f => f._id !== id)
    localStorage.setItem('favorites', JSON.stringify(updated))
    setFavorites(updated)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/series?search=${searchQuery}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(8,8,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', height: '64px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', background: '#7c3aed', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <span style={{ fontWeight: 900, fontSize: '18px' }}><span style={{ color: '#fff' }}>NONE </span><span style={{ color: '#a78bfa' }}>MANGA</span></span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/series" style={{ background: '#1a1a2e', color: '#ccc', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', border: '1px solid #2a2a4a' }}>Seriler</Link>

            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#1a1a2e', border: '1px solid #3a3a5a', borderRadius: '8px', overflow: 'hidden' }}>
                <input autoFocus type="text" placeholder="Seri ara..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', padding: '7px 10px', width: '140px' }} />
                <button type="button" onClick={() => setSearchOpen(false)} style={{ padding: '7px 10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>✕</button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} style={{ background: '#1a1a2e', color: '#ccc', padding: '7px 12px', borderRadius: '8px', border: '1px solid #2a2a4a', cursor: 'pointer' }}>🔍</button>
            )}

            <button onClick={() => { setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]')); setFavOpen(true) }}
              style={{ background: '#1a1a2e', color: '#e05080', padding: '7px 12px', borderRadius: '8px', border: '1px solid #2a2a4a', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ♥ <span style={{ color: '#ccc' }}>Favorilerim</span>
              {favorites.length > 0 && <span style={{ background: '#7c3aed', color: '#fff', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{favorites.length}</span>}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ background: '#1a1a2e', color: '#a78bfa', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', border: '1px solid #3730a3' }}>Admin Panel</Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a2e', padding: '5px 12px', borderRadius: '8px', border: '1px solid #2a2a4a' }}>
                  <div style={{ width: '26px', height: '26px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700 }}>
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#ccc', fontSize: '13px' }}>{user.username}</span>
                </div>
                <button onClick={logout} style={{ background: '#1a1a2e', color: '#f87171', padding: '7px 12px', borderRadius: '8px', border: '1px solid #2a2a4a', cursor: 'pointer', fontSize: '13px' }}>Çıkış</button>
              </div>
            ) : (
              <Link to="/login" style={{ background: '#7c3aed', color: '#fff', padding: '7px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>Giriş Yap</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Favoriler Popup */}
      {favOpen && (
        <div onClick={() => setFavOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', borderRadius: '16px', border: '1px solid #2a2a3a', width: '340px', maxHeight: '80vh', overflow: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>♥ Favorilerim</h3>
              <button onClick={() => setFavOpen(false)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            {favorites.length === 0 ? (
              <p style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Henüz favori eklemediniz.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {favorites.map(f => (
                  <div key={f._id} style={{ background: '#0d0d14', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #1e1e35' }}>
                    <div style={{ width: '38px', height: '38px', background: '#1e1b4b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontSize: '13px', fontWeight: 900, flexShrink: 0 }}>
                      {f.title?.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Link to={`/series/${f._id}`} onClick={() => setFavOpen(false)} style={{ color: '#d0d0e8', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>{f.title}</Link>
                      <p style={{ color: '#555', fontSize: '11px' }}>{f.genre?.join(', ')}</p>
                    </div>
                    <button onClick={() => removeFav(f._id)} style={{ background: 'none', border: 'none', color: '#c06060', cursor: 'pointer', fontSize: '11px' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar