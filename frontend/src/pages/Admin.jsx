import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [series, setSeries] = useState([])
  const [activeTab, setActiveTab] = useState('series')
  const [message, setMessage] = useState('')
  const [seriesForm, setSeriesForm] = useState({ title: '', description: '', coverImage: '', genre: '', status: 'Devam Ediyor' })
  const [chapterForm, setChapterForm] = useState({ seriesId: '', title: '', number: '' })
  const [pageForm, setPageForm] = useState({ chapterId: '', url: '' })
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
    }
  }, [user])

  useEffect(() => { fetchSeries() }, [])

  const fetchSeries = async () => {
    try {
      const res = await axios.get('https://spirited-charisma-production-c78c.up.railway.app/api/series')
      setSeries(res.data)
    } catch (err) { console.log(err) }
  }

  const fetchChapters = async (seriesId) => {
    try {
      const res = await axios.get(`https://spirited-charisma-production-c78c.up.railway.app/api/series/${seriesId}`)
      setChapters(res.data.chapters)
    } catch (err) { console.log(err) }
  }

  const handleSeriesSubmit = async () => {
    try {
      await axios.post('https://spirited-charisma-production-c78c.up.railway.app/api/series', {
        ...seriesForm,
        genre: seriesForm.genre.split(',').map(g => g.trim())
      })
      setMessage('✓ Seri başarıyla eklendi!')
      setSeriesForm({ title: '', description: '', coverImage: '', genre: '', status: 'Devam Ediyor' })
      fetchSeries()
    } catch (err) { setMessage('✗ Hata oluştu!') }
  }

  const handleChapterSubmit = async () => {
    try {
      await axios.post('https://spirited-charisma-production-c78c.up.railway.app/api/chapters', chapterForm)
      setMessage('✓ Bölüm başarıyla eklendi!')
      setChapterForm({ seriesId: '', title: '', number: '' })
    } catch (err) { setMessage('✗ Hata oluştu!') }
  }

  const handlePageSubmit = async () => {
    if (!pageForm.chapterId || !pageForm.url) {
      setMessage('✗ Bölüm ve URL seçmelisin!')
      return
    }
    try {
      await axios.post(`https://spirited-charisma-production-c78c.up.railway.app/api/chapters/${pageForm.chapterId}/page`, { url: pageForm.url })
      setMessage('✓ Sayfa başarıyla eklendi!')
      setPageForm({ ...pageForm, url: '' })
    } catch (err) { setMessage('✗ Hata oluştu!') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu seriyi silmek istediğine emin misin?')) return
    try {
      await axios.delete(`https://spirited-charisma-production-c78c.up.railway.app/api/series/${id}`)
      fetchSeries()
    } catch (err) { console.log(err) }
  }

  const inputStyle = {
    width: '100%', background: '#0d0d14', border: '1px solid #2a2a3a',
    borderRadius: '10px', padding: '12px 14px', color: '#fff',
    fontSize: '13px', outline: 'none'
  }

  const selectStyle = {
    ...inputStyle, cursor: 'pointer'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', paddingTop: '64px' }}>

      {/* Header */}
      <div style={{ background: '#12121e', borderBottom: '1px solid #1e1e35', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 900 }}>Admin Panel</h1>
            <p style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>None Manga yönetim paneli</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', padding: '6px 14px', borderRadius: '20px' }}>
            <div style={{ width: '8px', height: '8px', background: '#7c3aed', borderRadius: '50%' }} />
            <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>Admin</span>
          </div>
        </div>

        {/* Sekmeler */}
        <div style={{ maxWidth: '1000px', margin: '16px auto 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'series', label: '📚 Seri Ekle' },
            { key: 'chapter', label: '📖 Bölüm Ekle' },
            { key: 'page', label: '🖼️ Sayfa Ekle' },
            { key: 'list', label: `📋 Seriler (${series.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setMessage('') }}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '13px', transition: 'all 0.2s',
                background: activeTab === tab.key ? '#7c3aed' : '#1a1a2e',
                color: activeTab === tab.key ? '#fff' : '#888'
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>

        {message && (
          <div style={{
            marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
            background: message.startsWith('✓') ? 'rgba(34,197,122,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${message.startsWith('✓') ? 'rgba(34,197,122,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: message.startsWith('✓') ? '#4ade80' : '#f87171'
          }}>
            {message}
          </div>
        )}

        {/* Seri Ekle */}
        {activeTab === 'series' && (
          <div style={{ background: '#12121e', borderRadius: '16px', padding: '24px', border: '1px solid #1e1e35' }}>
            <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Yeni Seri Ekle</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Seri Adı</label>
                <input style={inputStyle} placeholder="Örn: Solo Leveling" value={seriesForm.title} onChange={e => setSeriesForm({...seriesForm, title: e.target.value})} />
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Açıklama</label>
                <textarea style={{ ...inputStyle, height: '100px', resize: 'none' }} placeholder="Seri hakkında kısa bir açıklama..." value={seriesForm.description} onChange={e => setSeriesForm({...seriesForm, description: e.target.value})} />
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Kapak Görseli URL</label>
                <input style={inputStyle} placeholder="https://... (görsel linki)" value={seriesForm.coverImage} onChange={e => setSeriesForm({...seriesForm, coverImage: e.target.value})} />
                {seriesForm.coverImage && (
                  <img src={seriesForm.coverImage} alt="önizleme" style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid #2a2a3a' }} onError={e => e.target.style.display='none'} />
                )}
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Türler</label>
                <input style={inputStyle} placeholder="Virgülle ayır: Aksiyon, Fantazi, Macera" value={seriesForm.genre} onChange={e => setSeriesForm({...seriesForm, genre: e.target.value})} />
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Durum</label>
                <select style={selectStyle} value={seriesForm.status} onChange={e => setSeriesForm({...seriesForm, status: e.target.value})}>
                  <option>Devam Ediyor</option>
                  <option>Tamamlandı</option>
                  <option>Beklemede</option>
                </select>
              </div>
              <button onClick={handleSeriesSubmit}
                style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
                Seri Ekle
              </button>
            </div>
          </div>
        )}

        {/* Bölüm Ekle */}
        {activeTab === 'chapter' && (
          <div style={{ background: '#12121e', borderRadius: '16px', padding: '24px', border: '1px solid #1e1e35' }}>
            <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Yeni Bölüm Ekle</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Seri</label>
                <select style={selectStyle} value={chapterForm.seriesId} onChange={e => setChapterForm({...chapterForm, seriesId: e.target.value})}>
                  <option value="">Seri seç...</option>
                  {series.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Bölüm Başlığı</label>
                <input style={inputStyle} placeholder="Örn: Başlangıç" value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} />
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Bölüm Numarası</label>
                <input style={inputStyle} type="number" placeholder="1" value={chapterForm.number} onChange={e => setChapterForm({...chapterForm, number: e.target.value})} />
              </div>
              <button onClick={handleChapterSubmit}
                style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
                Bölüm Ekle
              </button>
            </div>
          </div>
        )}

        {/* Sayfa Ekle */}
        {activeTab === 'page' && (
          <div style={{ background: '#12121e', borderRadius: '16px', padding: '24px', border: '1px solid #1e1e35' }}>
            <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Bölüme Sayfa Ekle</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Seri Seç</label>
                <select style={selectStyle} onChange={e => { fetchChapters(e.target.value); setPageForm({...pageForm, chapterId: ''}) }}>
                  <option value="">Seri seç...</option>
                  {series.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Bölüm Seç</label>
                <select style={selectStyle} value={pageForm.chapterId} onChange={e => setPageForm({...pageForm, chapterId: e.target.value})}>
                  <option value="">Bölüm seç...</option>
                  {chapters.map(ch => <option key={ch._id} value={ch._id}>Bölüm {ch.number} - {ch.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Sayfa Görseli URL</label>
                <input style={inputStyle} placeholder="https://..." value={pageForm.url} onChange={e => setPageForm({...pageForm, url: e.target.value})} />
                <p style={{ color: '#444', fontSize: '11px', marginTop: '4px' }}>Görselin direkt linkini yapıştır (imgur, cloudinary vb.)</p>
              </div>
              {pageForm.url && (
                <div>
                  <label style={{ color: '#666', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Önizleme</label>
                  <img src={pageForm.url} alt="önizleme" style={{ width: '120px', borderRadius: '8px', border: '1px solid #2a2a3a' }} onError={e => e.target.style.display='none'} />
                </div>
              )}
              <button onClick={handlePageSubmit}
                style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
                Sayfa Ekle
              </button>
            </div>
          </div>
        )}

        {/* Seri Listesi */}
        {activeTab === 'list' && (
          <div style={{ background: '#12121e', borderRadius: '16px', padding: '24px', border: '1px solid #1e1e35' }}>
            <h2 style={{ color: '#fff', fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Tüm Seriler</h2>
            {series.length === 0 ? (
              <p style={{ color: '#444', fontSize: '13px' }}>Henüz seri eklenmedi.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {series.map(s => (
                  <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0d0d14', padding: '12px 16px', borderRadius: '10px', border: '1px solid #1e1e35' }}>
                    {s.coverImage && (
                      <img src={s.coverImage} alt={s.title} style={{ width: '36px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} onError={e => e.target.style.display='none'} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{s.title}</p>
                      <p style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>
                        <span style={{ color: s.status === 'Devam Ediyor' ? '#4ade80' : '#888' }}>{s.status}</span>
                        {s.genre?.length > 0 && ` • ${s.genre.join(', ')}`}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(s._id)}
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Admin