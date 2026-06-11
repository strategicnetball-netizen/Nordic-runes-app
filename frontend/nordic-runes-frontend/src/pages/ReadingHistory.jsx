import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function ReadingHistory() {
  const { t } = useTranslation()
  const [readings, setReadings] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [selectedFilterTag, setSelectedFilterTag] = useState(null)
  const navigate = useNavigate()

  const allTags = [t('reading.love'), t('reading.career'), t('reading.health'), t('reading.finances'), t('reading.personal'), t('reading.family'), t('reading.creativity'), t('reading.spirituality')]

  useEffect(() => {
    // Scroll to top when page loads (with small delay for rendering)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    
    // Load readings from localStorage
    const savedReadings = localStorage.getItem('savedReadings')
    if (savedReadings) {
      try {
        setReadings(JSON.parse(savedReadings))
      } catch (err) {
        console.error('Failed to load readings:', err)
      }
    }
    
    return () => clearTimeout(timer)
  }, [])

  const deleteReading = (id) => {
    const updated = readings.filter(r => r.id !== id)
    setReadings(updated)
    localStorage.setItem('savedReadings', JSON.stringify(updated))
  }

  const clearAllReadings = () => {
    if (window.confirm('Are you sure? This will permanently delete all saved readings.')) {
      setReadings([])
      localStorage.removeItem('savedReadings')
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter readings by selected tag
  const filteredReadings = selectedFilterTag
    ? readings.filter(reading => reading.tags && reading.tags.includes(selectedFilterTag))
    : readings

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Dark Viking background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(10, 10, 20, 0.7) 0%, rgba(20, 15, 35, 0.7) 50%, rgba(10, 10, 20, 0.7) 100%),
            url('/viking-bg.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
      </div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-amber-300 hover:text-amber-200 text-lg font-bold z-20"
      >
        ← {t('common.home')}
      </button>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-100 mb-4">{t('history.heading')}</h1>
          <p className="text-xl text-amber-200">{t('history.subheading')}</p>
        </div>

        {readings.length === 0 ? (
          // Empty state
          <div className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-12 text-center backdrop-blur-sm">
            <p className="text-amber-300 text-lg mb-6">{t('history.empty')}</p>
            <button
              onClick={() => navigate('/draw')}
              className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded transition"
            >
              {t('history.drawFirst')}
            </button>
          </div>
        ) : (
          <>
            {/* Filter by Tags */}
            <div className="mb-8 bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-amber-100 font-bold mb-3">{t('history.filterBy')}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedFilterTag(null)}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition ${
                    selectedFilterTag === null
                      ? 'bg-amber-600 text-white border-2 border-amber-400'
                      : 'bg-slate-800 text-amber-300 border-2 border-amber-700 hover:border-amber-500'
                  }`}
                >
                  {t('history.all')}
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedFilterTag(tag)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition ${
                      selectedFilterTag === tag
                        ? 'bg-amber-600 text-white border-2 border-amber-400'
                        : 'bg-slate-800 text-amber-300 border-2 border-amber-700 hover:border-amber-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {filteredReadings.length === 0 ? (
              <div className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 text-center backdrop-blur-sm">
                <p className="text-amber-300">{t('history.noReadingsWithTag')} {selectedFilterTag}</p>
              </div>
            ) : (
              <div className="space-y-4 mb-12">
                {filteredReadings.map((reading, index) => (
                <div
                  key={reading.id}
                  className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg backdrop-blur-sm overflow-hidden"
                >
                  {/* Reading Header - Clickable */}
                  <button
                    onClick={() => setExpandedId(expandedId === reading.id ? null : reading.id)}
                    className="w-full p-6 text-left hover:bg-slate-800 hover:bg-opacity-50 transition flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-bold text-amber-100">#{readings.length - index}</span>
                        <div>
                          <p className="text-lg font-bold text-amber-100">
                            {reading.readingType} - {reading.customQuestion || reading.context?.title}
                          </p>
                          <p className="text-sm text-amber-400">{formatDate(reading.timestamp)}</p>
                          {reading.tags && reading.tags.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {reading.tags.map(tag => (
                                <span key={tag} className="text-xs bg-amber-700 text-amber-100 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-amber-300 text-2xl">
                      {expandedId === reading.id ? '▼' : '▶'}
                    </span>
                  </button>

                  {/* Reading Details - Expanded */}
                  {expandedId === reading.id && (
                    <div className="border-t border-amber-900 p-6 bg-slate-800 bg-opacity-50">
                      {/* Question */}
                      {reading.customQuestion && (
                        <div className="mb-4">
                          <h4 className="font-bold text-amber-200 mb-2">{t('history.yourQuestion')}</h4>
                          <p className="text-amber-100 italic">"{reading.customQuestion}"</p>
                        </div>
                      )}

                      {/* Stones */}
                      <div className="mb-4">
                        <h4 className="font-bold text-amber-200 mb-3">{t('history.runesDrawn')}</h4>
                        <div className="flex gap-4 flex-wrap">
                          {reading.stones.map((stone, idx) => (
                            <div key={idx} className="bg-slate-700 bg-opacity-80 border border-amber-700 rounded p-3">
                              <p className="text-3xl text-amber-100 text-center mb-2">{stone.symbol}</p>
                              <p className="text-sm font-bold text-amber-200">{stone.name}</p>
                              <p className="text-xs text-amber-300">
                                {stone.reversed ? t('reading.reversed') : t('reading.upright')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reading Text */}
                      <div className="mb-4">
                        <h4 className="font-bold text-amber-200 mb-2">{t('history.reading')}</h4>
                        <div className="bg-slate-700 bg-opacity-60 rounded p-4 max-h-64 overflow-y-auto">
                          <p className="text-sm text-amber-100 whitespace-pre-wrap leading-relaxed">
                            {reading.comprehensiveReading}
                          </p>
                        </div>
                      </div>

                      {/* Notes */}
                      {reading.notes && (
                        <div className="mb-4">
                          <h4 className="font-bold text-amber-200 mb-2">{t('history.yourReflections')}</h4>
                          <p className="text-amber-100 italic">"{reading.notes}"</p>
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteReading(reading.id)}
                        className="mt-4 px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 text-sm font-bold rounded transition"
                      >
                        {t('history.deleteThis')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}

            {/* Stats and Clear */}
            <div className="flex gap-4 justify-between items-center">
              <div className="text-amber-300">
                <p className="text-lg font-bold">{filteredReadings.length} {filteredReadings.length === 1 ? t('history.reading') : t('history.readings')}</p>
              </div>
              <button
                onClick={clearAllReadings}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 text-sm font-bold rounded border border-red-900 transition"
              >
                {t('history.clearAll')}
              </button>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="mt-12 flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded transition"
          >
            {t('common.home')}
          </button>
          <button
            onClick={() => navigate('/draw')}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded transition"
          >
            {t('draw.drawBtn')}
          </button>
          <button
            onClick={() => navigate('/runes')}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded transition"
          >
            {t('reference.allRunes')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReadingHistory
