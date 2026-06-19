import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getContexts, drawRunes } from '../utils/api'
import LanguageToggle from '../components/LanguageToggle'

function DrawRunes({ onReadingComplete, onBack }) {
  const { t } = useTranslation()
  const [contexts, setContexts] = useState({})
  const [selectedContext, setSelectedContext] = useState('')
  const [stoneCount, setStoneCount] = useState(1)
  const [customQuestion, setCustomQuestion] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contextsLoading, setContextsLoading] = useState(true)

  useEffect(() => {
    // Scroll to top when page loads (with small delay for rendering)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    
    const loadContexts = async () => {
      try {
        setContextsLoading(true)
        const response = await getContexts()
        setContexts(response.data)
        const firstKey = Object.keys(response.data)[0]
        setSelectedContext(firstKey)
      } catch (err) {
        setError(t('draw.errorFailed'))
        console.error(err)
      } finally {
        setContextsLoading(false)
      }
    }
    loadContexts()
    
    return () => clearTimeout(timer)
  }, [t])

  const handleDraw = async () => {
    if (!useCustom && !selectedContext) {
      setError(t('draw.errorNoContext'))
      return
    }
    
    if (useCustom && !customQuestion.trim()) {
      setError(t('draw.errorNoQuestion'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const contextToUse = useCustom ? 'custom' : selectedContext
      // Pass customQuestion regardless of whether using custom or predefined context
      const response = await drawRunes(stoneCount, contextToUse, customQuestion || null)
      onReadingComplete(response.data)
    } catch (err) {
      setError(t('draw.errorFailed'))
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
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

      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-amber-300 hover:text-amber-200 text-lg font-bold z-20"
      >
        {t('common.back')}
      </button>

      <div className="max-w-2xl w-full relative z-10">
        <h1 className="text-4xl font-bold text-amber-100 mb-8 text-center">{t('draw.title')}</h1>

        {error && (
          <div className="bg-red-900 bg-opacity-80 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        {contextsLoading ? (
          <div className="bg-slate-900 bg-opacity-80 rounded-lg p-12 space-y-8 backdrop-blur-sm border border-amber-900 flex flex-col items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-6">
              <div className="animate-spin">
                <div className="text-6xl text-amber-300">✦</div>
              </div>
              <p className="text-amber-200 text-lg font-semibold">{t('draw.drawing')}</p>
              <p className="text-amber-300 text-sm">Connecting to the runes...</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 bg-opacity-80 rounded-lg p-8 space-y-8 backdrop-blur-sm border border-amber-900">
            {/* Toggle between predefined categories and custom question */}
          <div>
            <label className="block text-lg font-bold text-amber-100 mb-4">
              {t('draw.frameQuestion')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUseCustom(false)}
                className={`py-4 px-6 rounded-lg font-bold text-lg transition ${
                  !useCustom
                    ? 'bg-amber-700 text-white border-2 border-amber-400'
                    : 'bg-slate-800 text-amber-200 border-2 border-slate-700 hover:border-amber-600'
                }`}
              >
                {t('draw.chooseCategory')}
              </button>
              <button
                onClick={() => setUseCustom(true)}
                className={`py-4 px-6 rounded-lg font-bold text-lg transition ${
                  useCustom
                    ? 'bg-amber-700 text-white border-2 border-amber-400'
                    : 'bg-slate-800 text-amber-200 border-2 border-slate-700 hover:border-amber-600'
                }`}
              >
                {t('draw.askCustom')}
              </button>
            </div>
          </div>

          {/* Context Selection - shown only if not using custom */}
          {!useCustom && (
            <div>
              <label className="block text-lg font-bold text-amber-100 mb-4">
                {t('draw.whatAbout')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(contexts).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedContext(key)}
                    className={`p-4 rounded-lg text-left transition ${
                      selectedContext === key
                        ? 'bg-amber-700 border-2 border-amber-400 text-white'
                        : 'bg-slate-800 border-2 border-slate-700 text-amber-200 hover:border-amber-600'
                    }`}
                  >
                    <h3 className="font-bold text-lg">{t(`contexts.${key}_title`)}</h3>
                    <div className="border-t border-amber-600 my-2"></div>
                    <p className="text-sm">{t(`contexts.${key}_desc`)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Question - shown only if using custom */}
          {useCustom && (
            <div>
              <label className="block text-lg font-bold text-amber-100 mb-4">
                {t('draw.askSpecific')}
              </label>
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={t('draw.placeholder')}
                className="w-full h-32 p-4 rounded-lg bg-slate-800 text-amber-100 placeholder-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 border border-slate-600 focus:border-amber-500 transition"
              />
              <p className="text-amber-300 text-xs mt-2">
                {t('draw.hint1')}
              </p>
            </div>
          )}

          {/* Stone Count Selection */}
          <div className="text-center">
            <label className="block text-lg font-bold text-amber-100 mb-4">
              {t('draw.stoneCount')}
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => setStoneCount(count)}
                  className={`py-4 px-6 rounded-lg font-bold text-lg transition flex flex-col items-center justify-center ${
                    stoneCount === count
                      ? 'bg-amber-700 text-white border-2 border-amber-400'
                      : 'bg-slate-800 text-amber-200 border-2 border-slate-700 hover:border-amber-600'
                  }`}
                >
                  <span className="text-2xl">{count}</span>
                  <span className="text-sm">{count > 1 ? t('draw.stones') : t('draw.stone')}</span>
                </button>
              ))}
            </div>
            <p className="text-amber-300 text-sm mt-3">
              {stoneCount === 1 && t('draw.hint2Single')}
              {stoneCount === 2 && t('draw.hint2Two')}
              {stoneCount === 3 && t('draw.hint2Three')}
            </p>
          </div>

          {/* Custom Question */}
          <div>
            <label className="block text-lg font-bold text-amber-100 mb-4">
              {t('draw.optionalQuestion')}
            </label>
            <textarea
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder={t('draw.placeholder2')}
              className="w-full h-24 p-4 rounded-lg bg-slate-800 text-amber-100 placeholder-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 border border-slate-600 focus:border-amber-500 transition"
            />
            <p className="text-amber-300 text-xs mt-2">
              {t('draw.hint3')}
            </p>
          </div>

          {/* Draw Button */}
          <div className="pt-6">
            <button
              onClick={handleDraw}
              disabled={loading || !selectedContext}
              className={`w-full py-4 px-6 rounded-lg font-bold text-xl transition ${
                loading || !selectedContext
                  ? 'bg-amber-800 text-amber-600 cursor-not-allowed opacity-50'
                  : 'bg-amber-700 hover:bg-amber-600 text-white cursor-pointer transform hover:scale-105'
              }`}
            >
              {loading ? t('draw.drawing') : t('draw.drawBtn')}
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-slate-800 bg-opacity-80 rounded-lg p-4 text-amber-200 text-sm border border-amber-900">
            <p>{t('draw.instruction')}</p>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DrawRunes
