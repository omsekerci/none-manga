import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function SeriesDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/series/${id}`)
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFav(favs.some(f => f._id === id))
  }, [id])

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    let updated
    if (isFav) {
      updated = favs.filter(f => f._id !== id)
    } else {
      updated = [...favs, { _id: id, title: data.series.title, genre: data.series.genre }]
    }
    localStorage.setItem('favorites', JSON.stringify(updated))
    setIsFav(!isFav)
    if (window.refreshFavorites) window.refreshFavorites()
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}><p style={{ color: '#666' }}>Yükleniyor...</p></div>
  if (!data) return <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}><p style={{ color: '#666' }}>Seri bulunamadı.</p></div>

  const { series, chapters } = data

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', paddingTop: '64px' }}>
      <div style={{ position: 'relative', width: '100%', height: '220px', background: 'linear-gradient(135deg, #0d0d1a, #1a1035)', display: 'flex', alignItems: 'flex-end', padding: '0 32px 24px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #08080f 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ width: '110px', height: '150px', background: 'linear-gradient(135deg, #3730a3, #1e1b4b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124,58,237,0.3)', flexShrink: 0 }}>
            {series.coverImage
              ? <img src={series.coverImage} alt={series.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
              : <span style={{ color: 'rgba(167,139,250,0.5)', fontSize: '30px', fontWeight: 900 }}>{series.title?.charAt(0)}</span>
            }
          </div>
          <div>
            <span style={{ background: series.status === 'Devam Ediyor' ? '#16a34a' : '#555', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{series.status}</span>
            <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, margin: '6px 0 4px' }}>{series.title}</h1>
            <p style={{ color: '#666', fontSize: '13px' }}>{series.genre?.join(', ')}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        <button onClick={toggleFav}
          style={{ background: isFav ? '#7c3aed' : '#1a1a2e', color: isFav ? '#fff' : '#a78bfa', border: '1px solid #3730a3', borderRadius: '10px', padding: '8px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginBottom: '20px' }}>
          {isFav ? '♥ Favorilerden Çıkar' : '♡ Favorilere Ekle'}
        </button>

        {series.description && (
          <div style={{ background: '#12121e', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', border: '1px solid #1e1e35' }}>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>{series.description}</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 900 }}>Bölümler</h2>
          <span style={{ color: '#555', fontSize: '13px' }}>{chapters.length} bölüm</span>
        </div>

        {chapters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>Henüz bölüm eklenmemiş.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chapters.map(ch => (
              <Link to={`/reader/${id}/${ch._id}`} key={ch._id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#12121e', padding: '14px 16px', borderRadius: '10px', border: '1px solid #1e1e35', textDecoration: 'none', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e35'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ color: '#a78bfa', fontWeight: 900, fontSize: '16px', width: '28px' }}>{ch.number}</span>
                  <span style={{ color: '#fff', fontWeight: 500, fontSize: '14px' }}>{ch.title}</span>
                </div>
                <span style={{ color: '#555', fontSize: '18px' }}>→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SeriesDetail