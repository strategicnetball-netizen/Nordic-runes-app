import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from '../components/LanguageToggle'

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [runeOfDay, setRuneOfDay] = useState(null)

  useEffect(() => {
    // Scroll to top when page loads (with small delay for rendering)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    
    // Get daily rune based on date (consistent throughout the day)
    const today = new Date().toDateString()
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    
    const fetchRunes = async () => {
      try {
        const apiUrl = `${window.location.protocol}//${window.location.hostname}:3003/api/runes`
        const response = await fetch(apiUrl)
        const runes = await response.json()
        const rune = runes[seed % runes.length]
        
        // Determine if reversed (50/50 chance based on date seed)
        const isReversed = (seed % 2) === 0
        
        setRuneOfDay({
          ...rune,
          reversed: isReversed
        })
      } catch (err) {
        console.error('Failed to fetch rune of day:', err)
      }
    }
    
    fetchRunes()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
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

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center max-w-3xl px-4 py-4">
        
        {/* Main title with striking effect */}
        <div className="mb-4">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-2xl"
            style={{
              textShadow: `
                0 0 20px rgba(255, 215, 0, 0.5),
                0 0 40px rgba(255, 215, 0, 0.3),
                -2px -2px 4px rgba(0, 0, 0, 0.8),
                2px 2px 8px rgba(255, 100, 0, 0.3)
              `,
              letterSpacing: '0.05em',
              fontFamily: 'Georgia, serif'
            }}>
            {t('home.title')}
          </h1>
          
          <div className="flex justify-center gap-2 mb-2">
            <span className="text-amber-600 text-base">✦</span>
            <span className="text-amber-600 text-base">✦</span>
            <span className="text-amber-600 text-base">✦</span>
          </div>

          <p className="text-lg md:text-xl text-amber-200 font-light tracking-widest mb-2"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            {t('home.tagline')}
          </p>
          
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>
            {t('home.description')}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/draw')}
          className="relative px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-amber-700 to-amber-600 rounded-lg hover:from-amber-600 hover:to-amber-500 transition transform hover:scale-105 active:scale-95 shadow-2xl mb-4"
          style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
            boxShadow: `
              0 0 30px rgba(255, 215, 0, 0.4),
              0 10px 30px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `
          }}
        >
          {t('home.beginReading')}
        </button>

        {/* Footer text - Compact */}
        <div className="mt-2 text-xs text-gray-500">
          <p>{t('home.divination')}</p>
        </div>

        {/* Rune of the Day */}
        {runeOfDay && (
          <div className="mt-8 p-6 bg-slate-900 bg-opacity-80 border-2 border-amber-700 rounded-lg max-w-xl mx-auto backdrop-blur-sm">
            <p className="text-amber-300 text-sm font-bold text-center mb-6">{t('home.runeOfDay')}</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Stone */}
              <div 
                style={{
                  width: 110,
                  height: 130,
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
                  justifyContent: 'center'
                }}
                className="flex-shrink-0"
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
                    fontSize: '3rem',
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
                  {runeOfDay.symbol}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-100 mb-1">{runeOfDay.name}</h3>
                {runeOfDay.reversed && (
                  <p className="text-red-400 text-sm font-bold mb-2">⬇️ REVERSED</p>
                )}
                <p className="text-xs text-amber-200 mb-4">
                  <span className="font-bold text-amber-100">{runeOfDay.reversed ? t('reading.reversed') : t('reading.upright')}:</span> {runeOfDay.reversed ? runeOfDay.reversed : runeOfDay.meaning}
                </p>
                <button
                  onClick={() => navigate('/rune-of-day')}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold text-sm rounded-lg transition"
                >
                  {t('home.learnMore')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer - Full */}
        <div className="mt-4 p-4 bg-slate-900 bg-opacity-70 border border-amber-900 rounded text-xs text-amber-300 max-w-2xl mx-auto">
          <p>{t('home.disclaimer')}</p>
        </div>

        {/* Navigation Buttons Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
          <button
            onClick={() => navigate('/history')}
            className="text-amber-300 hover:text-amber-200 text-base font-bold bg-slate-900 bg-opacity-80 px-4 py-3 rounded-lg border-2 border-amber-700 hover:border-amber-500 transition backdrop-blur-sm hover:bg-opacity-100"
          >
            {t('home.historyBtn')}
          </button>

          <button
            onClick={() => navigate('/runes')}
            className="text-amber-300 hover:text-amber-200 text-base font-bold bg-slate-900 bg-opacity-80 px-4 py-3 rounded-lg border-2 border-amber-700 hover:border-amber-500 transition backdrop-blur-sm hover:bg-opacity-100"
          >
            {t('home.viewRunesBtn')}
          </button>

          <button
            onClick={() => navigate('/about')}
            className="text-amber-300 hover:text-amber-200 text-base font-bold bg-slate-900 bg-opacity-80 px-4 py-3 rounded-lg border-2 border-amber-700 hover:border-amber-500 transition backdrop-blur-sm hover:bg-opacity-100"
          >
            {t('home.aboutBtn')}
          </button>

          <button
            onClick={() => navigate('/help')}
            className="text-amber-300 hover:text-amber-200 text-base font-bold bg-slate-900 bg-opacity-80 px-4 py-3 rounded-lg border-2 border-amber-700 hover:border-amber-500 transition backdrop-blur-sm hover:bg-opacity-100"
          >
            {t('home.helpBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
