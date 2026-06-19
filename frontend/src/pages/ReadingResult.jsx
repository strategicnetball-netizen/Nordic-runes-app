import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { saveReading } from '../utils/api'
import { getTranslatedRune, translateReading } from '../utils/runeTranslations'
import ReactMarkdown from 'react-markdown'
import LanguageToggle from '../components/LanguageToggle'

function ReadingResult({ reading, onBack }) {
  const { t, i18n } = useTranslation()
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [expandedMeanings, setExpandedMeanings] = useState({})
  const [translatedReading, setTranslatedReading] = useState(reading)
  const navigate = useNavigate()

  const availableTags = [
    t('reading.love'),
    t('reading.career'),
    t('reading.health'),
    t('reading.finances'),
    t('reading.personal'),
    t('reading.family'),
    t('reading.creativity'),
    t('reading.spirituality')
  ]

  // Update translated reading when language changes
  useEffect(() => {
    if (reading && reading.stones) {
      const translatedStones = reading.stones.map(stone => 
        getTranslatedRune(stone, i18n.language)
      )
      const translatedComprehensiveReading = translateReading(reading.comprehensiveReading, i18n.language)
      setTranslatedReading({
        ...reading,
        stones: translatedStones,
        comprehensiveReading: translatedComprehensiveReading
      })
    }
  }, [i18n.language, reading])

  // Scroll to top when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // If no reading data, redirect back to home
  if (!reading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
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
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-amber-100 mb-6">{t('reading.noReading')}</h1>
          <p className="text-amber-200 text-lg mb-8">{t('reading.noReadingMsg')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {t('reading.returnHome')}
          </button>
        </div>
      </div>
    )
  }

  const handleSaveReading = async () => {
    setSaving(true)
    try {
      const readingToSave = {
        id: Date.now(),
        ...reading,
        notes,
        tags: selectedTags,
        timestamp: new Date().toISOString()
      }
      
      // Get existing readings from localStorage
      const existingReadings = localStorage.getItem('savedReadings')
      const readingsArray = existingReadings ? JSON.parse(existingReadings) : []
      
      // Add new reading
      readingsArray.push(readingToSave)
      
      // Save back to localStorage
      localStorage.setItem('savedReadings', JSON.stringify(readingsArray))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save reading:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCopyReading = () => {
    const readingText = `${reading.context.title}\n${reading.readingType}\n\n${reading.comprehensiveReading}`
    navigator.clipboard.writeText(readingText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => console.error('Failed to copy:', err))
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const toggleMeanings = (stoneIndex) => {
    setExpandedMeanings(prev => ({
      ...prev,
      [stoneIndex]: !prev[stoneIndex]
    }))
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Dark Viking background with image overlay - same as home page */}
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
        onClick={onBack}
        className="absolute top-6 left-6 text-amber-300 hover:text-amber-200 text-lg font-bold z-20"
      >
        {t('common.newReading')}
      </button>

      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center justify-start">
        {/* Context */}
        <div className="text-center mb-12 w-full">
          <h1 className="text-5xl font-bold text-amber-100 mb-2">{reading.context.title}</h1>
          <p className="text-xl text-amber-200">{reading.readingType}</p>
          <p className="text-lg text-amber-300 mt-2">{reading.readingDescription}</p>
        </div>

        {/* Rune Stones - actual rounded stones, not cards */}
        <div className="flex flex-wrap justify-center gap-12 mb-12 py-8">
          {translatedReading.stones && translatedReading.stones.map((stone, index) => {
            // Different stone shapes and sizes for organic feel
            const stoneShapes = [
              { width: 140, height: 160, borderRadius: '45% 55% 52% 48%' },      // Organic oval
              { width: 130, height: 155, borderRadius: '48% 52% 45% 55%' },      // Tilted oval
              { width: 145, height: 165, borderRadius: '52% 48% 53% 47%' },      // Rounded pebble
              { width: 135, height: 150, borderRadius: '47% 53% 48% 52%' },      // Smooth stone
              { width: 140, height: 160, borderRadius: '50% 50% 48% 52%' },      // Classic pebble
              { width: 135, height: 158, borderRadius: '53% 47% 52% 48%' },      // Natural shape
            ];
            
            const shape = stoneShapes[index % stoneShapes.length];
            
            // Stone colors - earthy and natural
            const stoneColors = [
              { primary: '#5a4a3a', secondary: '#6b5a4a', accent: '#4a3a2a' },   // Dark brown
              { primary: '#6b7280', secondary: '#7b8290', accent: '#5b6270' },   // Gray
              { primary: '#7a5c3a', secondary: '#8a6c4a', accent: '#6a4c2a' },   // Terracotta
              { primary: '#5b6b7a', secondary: '#6b7b8a', accent: '#4b5b6a' },   // Slate
              { primary: '#6a5a4a', secondary: '#7a6a5a', accent: '#5a4a3a' },   // Warm brown
              { primary: '#5a5a5a', secondary: '#6a6a6a', accent: '#4a4a4a' },   // Charcoal
            ];
            
            const colors = stoneColors[index % stoneColors.length];

            return (
              <div
                key={index}
                className="flex flex-col items-center transform transition hover:scale-110 duration-300 hover:-translate-y-2 group"
              >
                {/* Actual stone - organic rounded shape */}
                <div 
                  style={{
                    width: shape.width,
                    height: shape.height,
                    borderRadius: shape.borderRadius,
                    background: `radial-gradient(ellipse 35% 45% at 35% 35%, ${colors.secondary}, ${colors.primary}, ${colors.accent})`,
                    boxShadow: `
                      0 12px 28px rgba(0, 0, 0, 0.7),
                      inset -4px -6px 12px rgba(0, 0, 0, 0.5),
                      inset 6px 6px 12px rgba(255, 255, 255, 0.1),
                      inset -2px 2px 8px rgba(0, 0, 0, 0.6)
                    `,
                    position: 'relative',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  className="group-hover:shadow-lg"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `
                      0 12px 28px rgba(0, 0, 0, 0.7),
                      inset -4px -6px 12px rgba(0, 0, 0, 0.5),
                      inset 6px 6px 12px rgba(255, 255, 255, 0.1),
                      inset -2px 2px 8px rgba(0, 0, 0, 0.6),
                      0 0 30px rgba(255, 215, 0, 0.6),
                      0 0 60px rgba(255, 215, 0, 0.3)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `
                      0 12px 28px rgba(0, 0, 0, 0.7),
                      inset -4px -6px 12px rgba(0, 0, 0, 0.5),
                      inset 6px 6px 12px rgba(255, 255, 255, 0.1),
                      inset -2px 2px 8px rgba(0, 0, 0, 0.6)
                    `;
                  }}
                  className="group-hover:shadow-lg flex items-center justify-center relative"
                >
                  {/* Stone texture */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: shape.borderRadius,
                      backgroundImage: `
                        radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.12) 0.5px, transparent 1px),
                        radial-gradient(circle at 70% 65%, rgba(0, 0, 0, 0.2) 1px, transparent 2px),
                        radial-gradient(circle at 85% 30%, rgba(0, 0, 0, 0.12) 0.5px, transparent 1px),
                        radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.08) 0.5px, transparent 1px)
                      `,
                      backgroundSize: '12px 12px, 18px 18px, 15px 15px, 10px 10px',
                      opacity: 0.6,
                    }}
                  />

                  {/* Rune symbol - scratched into stone */}
                  <div 
                    className={`text-8xl font-bold transition ${stone.reversed ? 'transform rotate-180' : ''}`}
                    style={{
                      color: '#d4af6a',
                      position: 'relative',
                      zIndex: 10,
                      textShadow: `
                        -1px -1px 0px rgba(255, 255, 255, 0.3),
                        1px 1px 2px rgba(0, 0, 0, 0.8),
                        inset -1px -1px 0px rgba(0, 0, 0, 0.5)
                      `,
                      filter: 'drop-shadow(-1px -1px 1px rgba(255, 255, 255, 0.2))',
                      WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {stone.symbol}
                  </div>
                </div>

                {/* Info below stone - minimal and clean */}
                <div className="text-center mt-6 w-full px-2">
                  {/* Rune name */}
                  <h3 className="text-amber-100 font-bold text-lg" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                    {stone.name}
                  </h3>
                  
                  {/* Position label */}
                  <p className="text-amber-300 text-sm font-semibold mt-1" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                    {translatedReading.stones.length === 1 && t('reading.current')}
                    {translatedReading.stones.length === 2 && (index === 0 ? t('reading.current') : t('reading.outcome'))}
                    {translatedReading.stones.length === 3 && (index === 0 ? t('reading.past') : index === 1 ? t('reading.present') : t('reading.future'))}
                  </p>

                  {/* Reversed indicator */}
                  {stone.reversed && (
                    <p className="text-red-400 text-xs font-bold mt-2" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                      ⬇️ REVERSED
                    </p>
                  )}

                  {/* Meaning text */}
                  <p className="text-amber-100 text-xs leading-relaxed mt-3 font-medium max-w-xs mx-auto" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                    {stone.interpretation}
                  </p>

                  {/* Quick Reference: Both Upright & Reversed Meanings */}
                  <button
                    onClick={() => toggleMeanings(index)}
                    className="mt-3 text-amber-300 hover:text-amber-200 text-xs font-bold transition"
                  >
                    {expandedMeanings[index] ? t('reading.hideMeanings') : t('reading.showMeanings')}
                  </button>

                  {expandedMeanings[index] && (
                    <div className="mt-3 p-3 bg-slate-800 bg-opacity-90 rounded border border-amber-700 text-left space-y-3">
                      <div>
                        <h5 className="font-bold text-amber-300 text-xs mb-1">{t('reading.upright')}</h5>
                        <p className="text-amber-100 text-xs leading-relaxed">{stone.meaning}</p>
                        <p className="text-amber-200 text-xs mt-1">{stone.upright_guidance}</p>
                      </div>
                      <div className="border-t border-amber-700 pt-2">
                        <h5 className="font-bold text-red-400 text-xs mb-1">{t('reading.reversed')}</h5>
                        <p className="text-amber-100 text-xs leading-relaxed">{stone.reversedMeaning}</p>
                        <p className="text-amber-200 text-xs mt-1">{stone.reversed_guidance}</p>
                      </div>
                    </div>
                  )}

                  {/* Always visible Guidance Details */}
                  <div className="mt-4 p-4 bg-slate-800 bg-opacity-80 rounded border border-amber-700 text-left max-w-sm mx-auto">
                    <div className="text-amber-200 text-sm leading-relaxed space-y-3">
                      {stone.reversed ? (
                        <>
                          <div>
                            <h4 className="font-bold text-amber-100 mb-2">{t('reading.reversedGuidance')}</h4>
                            <p className="text-amber-100 text-xs">{stone.reversed_guidance}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-100 mb-2">{t('reading.reversedMeaning')}</h4>
                            <p className="text-amber-100 text-xs">{stone.reversedMeaning}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-100 mb-2">{t('reading.reversedDescription')}</h4>
                            <p className="text-amber-100 text-xs">{stone.reversed_description}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-bold text-amber-100 mb-2">{t('reading.uprightGuidance')}</h4>
                            <p className="text-amber-100 text-xs">{stone.upright_guidance}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-100 mb-2">{t('reading.fullDescription')}</h4>
                            <p className="text-amber-100 text-xs">{stone.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comprehensive Reading */}
        <div className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 mb-12 max-w-none backdrop-blur-sm">
          <div className="text-amber-100">
            <ReactMarkdown 
              components={{
                h1: ({node, ...props}) => <h1 style={{margin: '0'}} className="text-5xl font-bold text-yellow-300 text-center" {...props} />,
                h2: ({node, ...props}) => <h2 style={{margin: '0'}} className="text-2xl font-bold text-amber-100 text-center" {...props} />,
                h3: ({node, ...props}) => <h3 style={{margin: '0'}} className="text-3xl font-bold text-yellow-300 text-center" {...props} />,
                p: ({node, ...props}) => <p style={{margin: '0'}} className="text-amber-100" {...props} />,
                strong: ({node, ...props}) => <strong className="text-amber-200 font-bold" {...props} />,
                ul: ({node, ...props}) => <ul style={{margin: '0'}} className="text-amber-100 list-disc list-inside" {...props} />,
                li: ({node, ...props}) => <li className="text-amber-100 mb-2" {...props} />,
              }}
            >
              {translatedReading.comprehensiveReading}
            </ReactMarkdown>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 mb-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-amber-100 mb-4 text-center">{t('reading.yourReflections')}</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('reading.reflectionsPlaceholder')}
            className="w-full h-32 p-4 rounded-lg bg-slate-800 bg-opacity-90 text-amber-100 placeholder-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 border border-slate-600 mb-6"
          />

          {/* Tags Section */}
          <div className="mb-6">
            <label className="block text-amber-100 font-bold mb-3">{t('reading.addTags')}</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition ${
                    selectedTags.includes(tag)
                      ? 'bg-amber-600 text-white border-2 border-amber-400'
                      : 'bg-slate-800 text-amber-300 border-2 border-amber-700 hover:border-amber-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button
              onClick={handleSaveReading}
              disabled={saving}
              className="bg-amber-700 hover:bg-amber-600 disabled:bg-amber-800 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
            >
              {saving ? t('reading.saving') : t('reading.save')}
            </button>
            <button
              onClick={handleCopyReading}
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
            >
              {copied ? t('reading.copied') : t('reading.copy')}
            </button>
            <button
              onClick={() => navigate('/draw')}
              className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
            >
              {t('reading.new')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
            >
              {t('common.home')}
            </button>
          </div>
          {saved && (
            <p className="text-green-400 mt-3 font-semibold">✓ {t('reading.savedSuccess')}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReadingResult
