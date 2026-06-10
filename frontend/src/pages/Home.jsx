import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const [series, setSeries] = useState([])
  const [page, setPage] = useState(1)
  const [heroIndex, setHeroIndex] = useState(0)
  const [history, setHistory] = useState([])
  const [likes, setLikes] = useState({})
  const [ratings, setRatings] = useState({})
  const [newBanner, setNewBanner] = useState(null)
  const navigate = useNavigate()
  const perPage = 6

  useEffect(() => {
    axios.get('https://spirited-charisma-production-c78c.up.railway.app/api/series')
      .then(res => {
        setSeries(res.data)
        // Yeni bölüm banner'ı — son 24 saatte eklenen seri
        const recent = res.data.find(s => new Date() - new Date(s.createdAt) < 24 * 60 * 60 * 1000)
        if (recent) setNewBanner(recent)
      })
      .catch(err => console.log(err))

    // Okuma geçmişi
    const h = JSON.parse(localStorage.getItem('readHistory') || '[]')
    setHistory(h)

    // Beğeniler
    const l = JSON.parse(localStorage.getItem('likes') || '{}')
    setLikes(l)

    // Puanlar
    const r = JSON.parse(localStorage.getItem('ratings') || '{}')
    setRatings(r)
  }, [])

  useEffect(() => {
    if (series.length === 0) return
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % Math.min(series.length, 4))
    }, 4000)
    return () => clearInterval(interval)
  }, [series])

  const toggleLike = (e, seriesId) => {
    e.preventDefault()
    const newLikes = { ...likes, [seriesId]: !likes[seriesId] }
    setLikes(newLikes)
    localStorage.setItem('likes', JSON.stringify(newLikes))
  }

  const setRating = (e, seriesId, rating) => {
    e.preventDefault()
    const newRatings = { ...ratings, [seriesId]: rating }
    setRatings(newRatings)
    localStorage.setItem('ratings', JSON.stringify(newRatings))
  }

  const randomManga = () => {
    if (series.length === 0) return
    const random = series[Math.floor(Math.random() * series.length)]
    navigate(`/series/${random._id}`)
  }

  const popular = series.slice(0, 5)
  const totalPages = Math.ceil(series.length / perPage)
  const paginated = series.slice((page - 1) * perPage, page * perPage)
  const heroSeries = series[heroIndex]
  const sliderSeries = series.slice(0, 4)
  const cardColors = ['#1e1b4b','#1a0a2e','#0a1a3a','#2d1b4e','#0f172a','#1a2a1a']

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', paddingTop: '64px' }}>

      {/* Yeni Bölüm Banner */}
      {newBanner && (
        <div style={{ background: 'linear-gradient(to right, #4c1d95, #7c3aed)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#fff', color: '#7c3aed', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '20px' }}>YENİ</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{newBanner.title} eklendi!</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to={`/series/${newBanner._id}`} style={{ color: '#e9d5ff', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>Hemen Oku →</Link>
            <button onClick={() => setNewBanner(null)} style={{ background: 'none', border: 'none', color: '#e9d5ff', cursor: 'pointer', fontSize: '16px' }}>×</button>
          </div>
        </div>
      )}

      {/* Hero Slider */}
      {heroSeries && (
        <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden', background: '#0d0d1a' }}>
          {sliderSeries.map((s, i) => (
            <div key={s._id} style={{ position: 'absolute', inset: 0, opacity: i === heroIndex ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 0 }}>
              {s.coverImage && <img src={s.coverImage} alt={s.title} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '55%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.4 }} />}
            </div>
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #08080f 40%, transparent 100%)', zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #08080f 0%, transparent 40%)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', height: '100%' }}>
            <div style={{ maxWidth: '500px' }}>
              <span style={{ background: '#7c3aed', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', letterSpacing: '1px' }}>{heroSeries.status?.toUpperCase()}</span>
              <h1 style={{ color: '#fff', fontSize: '52px', fontWeight: 900, margin: '10px 0 8px', lineHeight: 1.1 }}>{heroSeries.title}</h1>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{heroSeries.description}</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to={`/series/${heroSeries._id}`} style={{ background: '#7c3aed', color: '#fff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>▶ Okumaya Başla</Link>
                <Link to={`/series/${heroSeries._id}`} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)' }}>Seriye Git</Link>
                <button onClick={randomManga} style={{ background: 'rgba(255,255,255,0.08)', color: '#a78bfa', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(167,139,250,0.3)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>🎲 Rastgele</button>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
            {sliderSeries.map((_, i) => (
              <div key={i} onClick={() => setHeroIndex(i)} style={{ width: i === heroIndex ? '28px' : '8px', height: '4px', borderRadius: '2px', background: i === heroIndex ? '#7c3aed' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
          <button onClick={() => setHeroIndex(prev => (prev - 1 + sliderSeries.length) % sliderSeries.length)} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>‹</button>
          <button onClick={() => setHeroIndex(prev => (prev + 1) % sliderSeries.length)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>›</button>
        </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Okuma Geçmişi */}
        {history.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 900, display: 'inline-block', paddingBottom: '6px', borderBottom: '3px solid #7c3aed' }}>📖 Kaldığın Yerden Devam Et</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {history.slice(0, 6).map((h, i) => (
                <Link key={i} to={`/reader/${h.seriesId}/${h.chapterId}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '12px 16px', minWidth: '160px', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1f2937'}
                  >
                    <p style={{ color: '#a78bfa', fontSize: '10px', fontWeight: 700, marginBottom: '4px' }}>DEVAM ET</p>
                    <p style={{ color: '#fff', fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>Bölüm {h.chapterNumber}</p>
                    <p style={{ color: '#666', fontSize: '11px' }}>{h.chapterTitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Haftanın Popüler Mangaları */}
        {popular.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 900, display: 'inline-block', paddingBottom: '6px', borderBottom: '3px solid #7c3aed' }}>Haftanın Popüler Mangaları</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {popular.map((s, i) => (
                <Link to={`/series/${s._id}`} key={s._id} style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '10px', background: cardColors[i % cardColors.length], overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {s.coverImage
                      ? <img src={s.coverImage} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                      : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '32px', fontWeight: 900 }}>{s.title?.charAt(0)}</div>
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#7c3aed', color: '#fff', fontSize: '11px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>#{i + 1}</div>
                    <p style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', color: '#fff', fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</p>
                  </div>
                  <p style={{ color: '#666', fontSize: '10px', marginTop: '4px' }}>{s.genre?.join(', ')}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Seriler */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 900, display: 'inline-block', paddingBottom: '6px', borderBottom: '3px solid #7c3aed' }}>Seriler</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={randomManga} style={{ background: '#1e1b4b', color: '#a78bfa', padding: '6px 14px', borderRadius: '8px', border: '1px solid #4c1d95', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>🎲 Rastgele</button>
              <Link to="/series" style={{ color: '#a78bfa', fontSize: '13px', textDecoration: 'none', background: '#1e1b4b', padding: '6px 14px', borderRadius: '8px', border: '1px solid #4c1d95' }}>Tümünü Gör →</Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {paginated.map((s, i) => {
              const isNew = new Date() - new Date(s.createdAt) < 7 * 24 * 60 * 60 * 1000
              const isLiked = likes[s._id]
              const rating = ratings[s._id] || 0
              return (
                <Link to={`/series/${s._id}`} key={s._id} style={{ textDecoration: 'none' }}>
                  <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: '10px', background: cardColors[i % cardColors.length], overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {s.coverImage
                      ? <img src={s.coverImage} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                      : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '32px', fontWeight: 900 }}>{s.title?.charAt(0)}</div>
                    }
                    <div style={{ position: 'absolute', top: '6px', left: '6px', background: isNew ? '#16a34a' : '#7c3aed', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                      {isNew ? 'Yeni' : s.status === 'Devam Ediyor' ? 'Devam' : 'Bitti'}
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                    {/* Beğeni butonu */}
                    <button onClick={e => toggleLike(e, s._id)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isLiked ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p style={{ color: '#fff', fontSize: '11px', fontWeight: 700, marginTop: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</p>
                  {/* Yıldız puanı */}
                  <div style={{ display: 'flex', gap: '2px', marginTop: '3px' }}>
                    {[1,2,3,4,5].map(star => (
                      <span key={star} onClick={e => setRating(e, s._id, star)} style={{ cursor: 'pointer', fontSize: '11px', color: star <= rating ? '#fbbf24' : '#374151' }}>★</span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sayfa Navigasyonu */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: page === 1 ? '#1a1a2e' : '#2d2d4e', color: page === 1 ? '#444' : '#fff', border: '1px solid #333', borderRadius: '8px', padding: '8px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
              ← Önceki
            </button>
            <span style={{ color: '#888', fontSize: '13px' }}>Sayfa {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ background: page === totalPages ? '#1a1a2e' : '#2d2d4e', color: page === totalPages ? '#444' : '#fff', border: '1px solid #333', borderRadius: '8px', padding: '8px 16px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
              Sonraki →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Home