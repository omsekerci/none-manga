import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function Reader() {
  const { id, chapter } = useParams()
  const [chapterData, setChapterData] = useState(null)
  const [allChapters, setAllChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [comments, setComments] = useState([])
  const [username, setUsername] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    axios.get(`https://spirited-charisma-production-c78c.up.railway.app/api/chapters/${chapter}`)
      .then(res => {
        setChapterData(res.data)
        setLoading(false)
        saveHistory(res.data)
      })
      .catch(() => setLoading(false))
    fetchComments()
  }, [chapter])

  useEffect(() => {
    if (id) {
      axios.get(`https://spirited-charisma-production-c78c.up.railway.app/api/series/${id}`)
        .then(res => setAllChapters(res.data.chapters || []))
        .catch(() => {})
    }
  }, [id])

  const saveHistory = (data) => {
    if (!data) return
    const history = JSON.parse(localStorage.getItem('readHistory') || '[]')
    const newEntry = {
      seriesId: id,
      chapterId: chapter,
      chapterTitle: data.title,
      chapterNumber: data.number,
      readAt: new Date().toISOString()
    }
    const filtered = history.filter(h => h.chapterId !== chapter)
    filtered.unshift(newEntry)
    localStorage.setItem('readHistory', JSON.stringify(filtered.slice(0, 20)))
  }

  const fetchComments = () => {
    axios.get(`https://spirited-charisma-production-c78c.up.railway.app/api/comments/${chapter}`)
      .then(res => setComments(res.data))
      .catch(() => {})
  }

  const handleComment = async () => {
    if (!username.trim() || !text.trim()) return
    try {
      await axios.post('https://spirited-charisma-production-c78c.up.railway.app/api/comments', { chapterId: chapter, username, text })
      setText('')
      fetchComments()
    } catch (err) { console.log(err) }
  }

  const currentIndex = allChapters.findIndex(ch => ch._id === chapter)
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#666' }}>Yükleniyor...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', paddingTop: '64px' }}>

      {/* Üst Bar */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '64px', zIndex: 10 }}>
        <Link to={`/series/${id}`} style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Seriye Dön
        </Link>
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700, textAlign: 'center' }}>
          {chapterData ? `Bölüm ${chapterData.number} — ${chapterData.title}` : ''}
        </div>
        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ background: '#1f2937', border: '1px solid #374151', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>−</button>
          <span style={{ color: '#888', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} style={{ background: '#1f2937', border: '1px solid #374151', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>+</button>
          <button onClick={() => setZoom(100)} style={{ background: '#1f2937', border: '1px solid #374151', color: '#888', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>Sıfırla</button>
        </div>
      </div>

      {/* Sayfalar */}
      <div style={{ maxWidth: `${zoom * 8}px`, margin: '0 auto', padding: '24px 16px', transition: 'max-width 0.2s' }}>
        {chapterData?.pages?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {chapterData.pages.map((url, i) => (
              <img key={i} src={url} alt={`Sayfa ${i + 1}`} style={{ width: '100%', display: 'block' }} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📄</p>
            <p>Bu bölüme henüz sayfa eklenmemiş.</p>
          </div>
        )}
      </div>

      {/* Bölümler Arası Geçiş */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        {prevChapter ? (
          <Link to={`/reader/${id}/${prevChapter._id}`} style={{ background: '#1f2937', color: '#fff', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #374151', flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
            ← Önceki: Bölüm {prevChapter.number}
          </Link>
        ) : <div style={{ flex: 1 }} />}

        <Link to={`/series/${id}`} style={{ background: '#111', color: '#a78bfa', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #4c1d95', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>
          Seri
        </Link>

        {nextChapter ? (
          <Link to={`/reader/${id}/${nextChapter._id}`} style={{ background: '#7c3aed', color: '#fff', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
            Sonraki: Bölüm {nextChapter.number} →
          </Link>
        ) : <div style={{ flex: 1 }} />}
      </div>

      {/* Yorum Bölümü */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px 48px' }}>
        <div style={{ background: '#111', borderRadius: '14px', padding: '20px', border: '1px solid #1f2937' }}>
          <h3 style={{ color: '#e0e0e0', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
            💬 Bölüm Yorumları
            <span style={{ background: '#1e1e35', color: '#666', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', marginLeft: '8px' }}>{comments.length}</span>
          </h3>

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input placeholder="Kullanıcı adın..." value={username} onChange={e => setUsername(e.target.value)} style={{ background: '#0d0d14', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} />
            <textarea placeholder="Yorumunu yaz..." value={text} onChange={e => setText(e.target.value)} rows={3} style={{ background: '#0d0d14', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'none' }} />
            <button onClick={handleComment} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-end' }}>Gönder</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {comments.length === 0 ? (
              <p style={{ color: '#444', fontSize: '13px' }}>Henüz yorum yok. İlk yorumu yap!</p>
            ) : comments.map(c => (
              <div key={c._id} style={{ background: '#0d0d14', borderRadius: '8px', padding: '10px 12px', borderLeft: '2px solid #7c3aed' }}>
                <div style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{c.username}</div>
                <div style={{ color: '#888', fontSize: '12px', lineHeight: 1.5 }}>{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Reader