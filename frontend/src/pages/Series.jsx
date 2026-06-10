import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function Series() {
  const [series, setSeries] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')

  const colors = [
    'from-indigo-900 to-indigo-950',
    'from-purple-900 to-purple-950',
    'from-blue-900 to-blue-950',
    'from-violet-900 to-violet-950',
    'from-slate-700 to-slate-900',
  ]

  useEffect(() => {
    axios.get('https://spirited-charisma-production-c78c.up.railway.app/api/series')
      .then(res => {
        setSeries(res.data)
        setFiltered(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered(series)
    } else {
      setFiltered(series.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.genre?.some(g => g.toLowerCase().includes(query.toLowerCase()))
      ))
    }
  }, [query, series])

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Başlık ve Arama */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 900 }}>Tüm Seriler</h1>
            <div style={{ width: '32px', height: '3px', background: '#7c3aed', borderRadius: '2px', marginTop: '4px' }} />
          </div>

          {/* Arama kutusu */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', overflow: 'hidden', width: '260px' }}>
            <svg style={{ margin: '0 10px', flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Seri veya tür ara..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', padding: '10px 10px 10px 0', width: '100%' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ padding: '0 10px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            )}
          </div>
        </div>

        {/* Sonuç sayısı */}
        {query && (
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
            "{query}" için {filtered.length} sonuç bulundu
          </p>
        )}

        {loading ? (
          <p style={{ color: '#6b7280' }}>Yükleniyor...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>"{query}" için sonuç bulunamadı.</p>
            <button onClick={() => setQuery('')} style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', fontSize: '14px' }}>
              Tüm serileri göster →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {filtered.map((s, i) => (
              <Link to={`/series/${s._id}`} key={s._id} style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '10px', background: `linear-gradient(135deg, ${['#1e1b4b', '#1a0a2e', '#0a1a3a', '#2d1b4e', '#0f172a'][i % 5]}, #08080f)`, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  {s.coverImage ? (
                    <img src={s.coverImage} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '28px', fontWeight: 900 }}>
                        {s.title?.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '6px', left: '6px', background: s.status === 'Devam Ediyor' ? '#16a34a' : '#6b7280', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                    {s.status === 'Devam Ediyor' ? 'Devam' : 'Bitti'}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                </div>
                <p style={{ color: '#fff', fontSize: '12px', fontWeight: 700, marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</p>
                <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>{s.genre?.join(', ')}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Series