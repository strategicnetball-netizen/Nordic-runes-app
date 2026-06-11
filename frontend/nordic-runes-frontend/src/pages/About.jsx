import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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
        {t('common.back')}
      </button>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-100 mb-4">{t('about.heading')}</h1>
          <p className="text-xl text-amber-200">{t('about.subheading')}</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* What are Runes */}
          <section className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">{t('about.whatAreRunes')}</h2>
            <p className="text-amber-100 leading-relaxed mb-4">
              {t('about.runesDesc1')}
            </p>
            <p className="text-amber-100 leading-relaxed">
              {t('about.runesDesc2')}
            </p>
          </section>

          {/* The Elder Futhark */}
          <section className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">{t('about.elderFuthark')}</h2>
            <p className="text-amber-100 leading-relaxed mb-4">
              {t('about.elderDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 bg-opacity-80 border border-amber-700 rounded p-4">
                <h3 className="text-amber-300 font-bold mb-2">{t('about.firstAett')}</h3>
                <p className="text-sm text-amber-100">{t('about.firstAettDesc')}</p>
              </div>
              <div className="bg-slate-800 bg-opacity-80 border border-amber-700 rounded p-4">
                <h3 className="text-amber-300 font-bold mb-2">{t('about.secondAett')}</h3>
                <p className="text-sm text-amber-100">{t('about.secondAettDesc')}</p>
              </div>
              <div className="bg-slate-800 bg-opacity-80 border border-amber-700 rounded p-4">
                <h3 className="text-amber-300 font-bold mb-2">{t('about.thirdAett')}</h3>
                <p className="text-sm text-amber-100">{t('about.thirdAettDesc')}</p>
              </div>
            </div>
          </section>

          {/* How to Use This App */}
          <section className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-amber-100 mb-6">{t('about.howToUse')}</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="text-xl font-bold text-amber-200 mb-2">{t('about.step1Title')}</h3>
                <p className="text-amber-100 mb-2">{t('about.step1Desc')}</p>
                <p className="text-sm text-amber-300">{t('about.step1Sub')}</p>
              </div>

              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="text-xl font-bold text-amber-200 mb-2">{t('about.step2Title')}</h3>
                <p className="text-amber-100 mb-2">{t('about.step2Desc')}</p>
                <p className="text-sm text-amber-300">{t('about.step2Sub')}</p>
              </div>

              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="text-xl font-bold text-amber-200 mb-2">{t('about.step3Title')}</h3>
                <p className="text-amber-100 mb-2">{t('about.step3Desc')}</p>
                <p className="text-sm text-amber-300">{t('about.step3Sub')}</p>
              </div>

              <div className="border-l-4 border-amber-500 pl-6">
                <h3 className="text-xl font-bold text-amber-200 mb-2">{t('about.step4Title')}</h3>
                <p className="text-amber-100 mb-2">{t('about.step4Desc')}</p>
                <p className="text-sm text-amber-300">{t('about.step4Sub')}</p>
              </div>
            </div>
          </section>

          {/* Reading Types */}
          <section className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-amber-100 mb-6">{t('about.readingTypes')}</h2>
            
            <div className="space-y-4">
              <div className="bg-slate-800 bg-opacity-80 border border-amber-700 rounded p-4">
                <h3 className="text-lg font-bold text-amber-200 mb-2">{t('about.singleRuneTitle')}</h3>
                <p className="text-amber-100 text-sm">{t('about.singleRuneDesc')}</p>
              </div>

              <div className="bg-slate-800 bg-opacity-80 border border-amber-700 rounded p-4">
                <h3 className="text-lg font-bold text-amber-200 mb-2">{t('about.twoRuneTitle')}</h3>
                <p className="text-amber-100 text-sm">{t('about.twoRuneDesc')}</p>
              </div>

              <div className="bg-slate-800 bg-opacity-80 border border-amber-700 rounded p-4">
                <h3 className="text-lg font-bold text-amber-200 mb-2">{t('about.threeRuneTitle')}</h3>
                <p className="text-amber-100 text-sm">{t('about.threeRuneDesc')}</p>
              </div>
            </div>
          </section>

          {/* Upright vs Reversed */}
          <section className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">{t('about.uprightVsReversed')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-amber-300 font-bold mb-3 text-lg">{t('about.uprightTitle')}</h3>
                <p className="text-amber-100 leading-relaxed">
                  {t('about.uprightDesc')}
                </p>
              </div>
              <div>
                <h3 className="text-red-400 font-bold mb-3 text-lg">{t('about.reversedTitle')}</h3>
                <p className="text-amber-100 leading-relaxed">
                  {t('about.reversedDesc')}
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-amber-100 mb-4">{t('about.importantNotice')}</h2>
            <p className="text-amber-100 leading-relaxed">
              {t('about.disclaimer')}
            </p>
          </section>
        </div>

        {/* Navigation to other pages */}
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
            {t('draw.title')}
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

export default About
