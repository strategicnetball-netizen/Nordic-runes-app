import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { getTranslatedRune } from '../utils/runeTranslations'

function RuneOfDay() {
  const { t, i18n } = useTranslation()
  const [runeOfDay, setRuneOfDay] = useState(null)
  const [translatedRune, setTranslatedRune] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Scroll to top when page loads (with small delay for rendering)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    
    // Get daily rune based on date
    const today = new Date().toDateString()
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    
    const fetchRune = async () => {
      try {
        const apiUrl = `${window.location.protocol}//${window.location.hostname}:3003/api/runes`
        const response = await fetch(apiUrl)
        const runes = await response.json()
        const rune = runes[seed % runes.length]
        
        // Determine if reversed
        const isReversed = (seed % 2) === 0
        
        const runeData = {
          ...rune,
          reversed: isReversed
        }
        
        setRuneOfDay(runeData)
        // Translate rune based on current language
        setTranslatedRune(getTranslatedRune(runeData, i18n.language))
      } catch (err) {
        console.error('Failed to fetch rune of day:', err)
      }
    }
    
    fetchRune()
    
    return () => clearTimeout(timer)
  }, [i18n.language])

  // Update translation when language changes
  useEffect(() => {
    if (runeOfDay) {
      setTranslatedRune(getTranslatedRune(runeOfDay, i18n.language))
    }
  }, [i18n.language, runeOfDay])

  if (!translatedRune) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-amber-300">{t('runeOfDay.today')}...</p>
      </div>
    )
  }

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

      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-100 mb-2">{t('runeOfDay.heading')}</h1>
          <p className="text-amber-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Stone and Basic Info */}
        <div className="bg-slate-900 bg-opacity-80 border-2 border-amber-700 rounded-lg p-8 mb-8 backdrop-blur-sm text-center">
          {/* Stone */}
          <div 
            style={{
              width: 160,
              height: 180,
              borderRadius: '45% 55% 52% 48%',
              background: 'radial-gradient(ellipse 35% 45% at 35% 35%, #6b5a4a, #5a4a3a, #4a3a2a)',
              boxShadow: `
                0 12px 28px rgba(0, 0, 0, 0.7),
                inset -4px -6px 12px rgba(0, 0, 0, 0.5),
                inset 6px 6px 12px rgba(255, 255, 255, 0.1),
                inset -2px 2px 8px rgba(0, 0, 0, 0.6)
              `,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 6px'
            }}
          >
            {/* Stone texture */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '45% 55% 52% 48%',
                backgroundImage: `
                  radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.12) 0.5px, transparent 1px),
                  radial-gradient(circle at 70% 65%, rgba(0, 0, 0, 0.2) 1px, transparent 2px),
                  radial-gradient(circle at 85% 30%, rgba(0, 0, 0, 0.12) 0.5px, transparent 1px)
                `,
                backgroundSize: '12px 12px, 18px 18px, 15px 15px',
                opacity: 0.6,
              }}
            />
            {/* Rune symbol */}
            <div 
              style={{
                fontSize: '5rem',
                color: '#d4af6a',
                position: 'relative',
                zIndex: 10,
                textShadow: `
                  -1px -1px 0px rgba(255, 255, 255, 0.3),
                  1px 1px 2px rgba(0, 0, 0, 0.8),
                  inset -1px -1px 0px rgba(0, 0, 0, 0.5)
                `,
                filter: 'drop-shadow(-1px -1px 1px rgba(255, 255, 255, 0.2))',
              }}
            >
              {translatedRune.symbol}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-amber-100 mb-2">{translatedRune.name}</h2>
          {translatedRune.reversed && (
            <p className="text-red-400 text-lg font-bold mb-4">{t('runeOfDay.reversed')}</p>
          )}
          <p className="text-lg text-amber-200">
            <span className="font-bold">{translatedRune.reversed ? t('reading.reversed') : t('reading.upright')}</span> {translatedRune.reversed ? translatedRune.reversed : translatedRune.meaning}
          </p>
        </div>

        {/* Full Details */}
        <div className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 mb-8 backdrop-blur-sm">
          <div className="space-y-6 text-amber-100">
            {/* Primary Meaning (based on today's orientation) */}
            {translatedRune.reversed ? (
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-2xl font-bold text-red-300 mb-3">{t('runeOfDay.reversedMeaning')}</h3>
                <p className="mb-3">{translatedRune.reversed_description}</p>
                <div>
                  <h4 className="font-bold text-amber-200 mb-2">{t('runeOfDay.guidance')}</h4>
                  <p className="text-sm leading-relaxed">{translatedRune.reversed_guidance}</p>
                </div>
              </div>
            ) : (
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-2xl font-bold text-amber-100 mb-3">{t('runeOfDay.uprightMeaning')}</h3>
                <p className="mb-3">{translatedRune.description}</p>
                <div>
                  <h4 className="font-bold text-amber-200 mb-2">{t('runeOfDay.guidance')}</h4>
                  <p className="text-sm leading-relaxed">{translatedRune.upright_guidance}</p>
                </div>
              </div>
            )}

            {/* Show the other state for full understanding */}
            {translatedRune.reversed ? (
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-xl font-bold text-amber-200 mb-2">{t('runeOfDay.uprightContext')}</h3>
                <p className="mb-2 text-sm">{translatedRune.description}</p>
                <div>
                  <h4 className="font-bold text-amber-200 mb-1">{t('runeOfDay.guidance')}</h4>
                  <p className="text-xs leading-relaxed">{translatedRune.upright_guidance}</p>
                </div>
              </div>
            ) : (
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-xl font-bold text-red-300 mb-2">{t('runeOfDay.reversedContext')}</h3>
                <p className="mb-2 text-sm">{translatedRune.reversed}</p>
                <div>
                  <h4 className="font-bold text-red-300 mb-1">{t('runeOfDay.guidance')}</h4>
                  <p className="text-xs leading-relaxed">{translatedRune.reversed_guidance}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded transition"
          >
            {t('common.home')}
          </button>
          <button
            onClick={() => navigate('/runes')}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded transition"
          >
            {t('runeOfDay.viewAll')}
          </button>
          <button
            onClick={() => navigate('/draw')}
            className="px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded transition"
          >
            {t('draw.drawBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RuneOfDay
