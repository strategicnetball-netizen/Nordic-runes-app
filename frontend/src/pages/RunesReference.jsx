import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTranslatedRune } from '../utils/runeTranslations'

function RunesReference() {
  const { t, i18n } = useTranslation()
  const [runes, setRunes] = useState([])
  const [translatedRunes, setTranslatedRunes] = useState([])
  const [expandedRune, setExpandedRune] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Scroll to top when page loads (with small delay for rendering)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:3003/api/runes`
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setRunes(data)
        // Translate runes based on current language
        const translated = data.map(rune => getTranslatedRune(rune, i18n.language))
        setTranslatedRunes(translated)
        // Auto-expand rune if passed in URL
        const runeId = searchParams.get('rune')
        if (runeId) {
          setExpandedRune(parseInt(runeId))
        }
      })
      .catch(err => console.error('Failed to load runes:', err))
    
    return () => clearTimeout(timer)
  }, [searchParams])

  // Update translations when language changes
  useEffect(() => {
    if (runes.length > 0) {
      const translated = runes.map(rune => getTranslatedRune(rune, i18n.language))
      setTranslatedRunes(translated)
    }
  }, [i18n.language, runes])

  // Filter runes based on search term (show all if empty)
  const displayRunes = searchTerm === '' ? translatedRunes : translatedRunes.filter(rune => {
    const searchLower = searchTerm.toLowerCase()
    return (
      rune.name.toLowerCase().includes(searchLower) ||
      rune.meaning.toLowerCase().includes(searchLower) ||
      rune.reversed.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Dark Viking background with image overlay */}
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

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-100 mb-4">{t('runesReference.heading')}</h1>
          <p className="text-xl text-amber-200">{t('runesReference.subheading')}</p>
          <p className="text-sm text-amber-300 mt-4">{t('runesReference.hint')}</p>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-slate-900 bg-opacity-70 border border-amber-900 rounded text-xs text-amber-300 max-w-3xl mx-auto">
            <p>{t('runesReference.disclaimer')}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={t('runesReference.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-6 py-3 bg-slate-800 bg-opacity-90 border border-amber-700 rounded-lg text-amber-100 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          {searchTerm && (
            <p className="text-center text-sm text-amber-400 mt-2">
              {t('runesReference.found')} {displayRunes.length}
            </p>
          )}
        </div>

        {/* Runes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayRunes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-amber-300 text-lg">{t('runesReference.noMatch')}</p>
            </div>
          ) : (
            displayRunes.map((rune) => (
              <div
                key={rune.id}
                onClick={() => setExpandedRune(expandedRune === rune.id ? null : rune.id)}
                className="cursor-pointer transform transition hover:scale-105 duration-300"
              >
                {/* Rune Card */}
                <div className="bg-slate-900 bg-opacity-80 border-2 border-amber-700 rounded-lg p-6 backdrop-blur-sm hover:border-amber-500 transition">
                  {/* Rune Symbol */}
                  <div className="text-6xl font-bold text-amber-100 text-center mb-3" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                    {rune.symbol}
                  </div>

                  {/* Rune Name */}
                  <h2 className="text-2xl font-bold text-amber-100 text-center mb-2" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                    {rune.name}
                  </h2>

                  {/* Upright and Reversed meanings side by side */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-amber-300 mb-1">{t('runesReference.upright')}</p>
                      <p className="text-sm text-amber-100">{rune.meaning}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-red-400 mb-1">{t('runesReference.reversed')}</p>
                      <p className="text-sm text-amber-100">{rune.reversed}</p>
                    </div>
                  </div>

                  {/* Click indicator */}
                  <p className="text-xs text-amber-400 text-center italic">
                    {expandedRune === rune.id ? t('runesReference.hideDetails') : t('runesReference.clickDetails')}
                  </p>
                </div>

                {/* Expanded Details */}
                {expandedRune === rune.id && (
                  <div className="mt-4 bg-slate-900 bg-opacity-90 border border-amber-600 rounded-lg p-6 backdrop-blur-sm">
                    <div className="space-y-6">
                      {/* Upright Section */}
                      <div className="border-l-4 border-amber-500 pl-4">
                        <h3 className="text-xl font-bold text-amber-100 mb-3">{t('runesReference.uprightTitle')}</h3>
                        
                        <div className="mb-4">
                          <h4 className="font-bold text-amber-200 mb-2">{t('runesReference.guidancePoints')}</h4>
                          <p className="text-amber-100 text-sm leading-relaxed">{rune.upright_guidance}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-amber-200 mb-2">{t('runesReference.description')}</h4>
                          <p className="text-amber-100 text-sm leading-relaxed">{rune.description}</p>
                        </div>
                      </div>

                      {/* Reversed Section */}
                      <div className="border-l-4 border-red-500 pl-4">
                        <h3 className="text-xl font-bold text-red-300 mb-3">{t('runesReference.reversedTitle')}</h3>
                        
                        <div className="mb-4">
                          <h4 className="font-bold text-amber-200 mb-2">{t('runesReference.guidancePoints')}</h4>
                          <p className="text-amber-100 text-sm leading-relaxed">{rune.reversed_guidance}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-amber-200 mb-2">{t('runesReference.description')}</h4>
                          <p className="text-amber-100 text-sm leading-relaxed">{rune.reversed_description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mb-6">
          <p className="text-amber-300 text-sm italic">{t('runesReference.studyDeeper')}</p>
        </div>

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
        </div>
      </div>
    </div>
  )
}

export default RunesReference
