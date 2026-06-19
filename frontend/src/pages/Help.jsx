import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Help() {
  const { t } = useTranslation()
  const [expandedFaq, setExpandedFaq] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const faqs = [
    {
      id: 1,
      question: t('help.q1'),
      answer: t('help.a1')
    },
    {
      id: 2,
      question: t('help.q2'),
      answer: t('help.a2')
    },
    {
      id: 3,
      question: t('help.q3'),
      answer: t('help.a3')
    },
    {
      id: 4,
      question: t('help.q4'),
      answer: t('help.a4')
    },
    {
      id: 5,
      question: t('help.q5'),
      answer: t('help.a5')
    },
    {
      id: 6,
      question: t('help.q6'),
      answer: t('help.a6')
    },
    {
      id: 7,
      question: t('help.q7'),
      answer: t('help.a7')
    },
    {
      id: 8,
      question: t('help.q8'),
      answer: t('help.a8')
    },
    {
      id: 9,
      question: t('help.q9'),
      answer: t('help.a9')
    },
    {
      id: 10,
      question: t('help.q10'),
      answer: t('help.a10')
    }
  ]

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
          <h1 className="text-5xl font-bold text-amber-100 mb-4">{t('help.heading')}</h1>
          <p className="text-xl text-amber-200">{t('help.subheading')}</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg backdrop-blur-sm overflow-hidden"
            >
              {/* Question - Clickable */}
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full p-5 text-left hover:bg-slate-800 hover:bg-opacity-50 transition flex justify-between items-center"
              >
                <p className="font-bold text-amber-100 text-lg pr-4">
                  {faq.question}
                </p>
                <span className="text-amber-300 text-2xl flex-shrink-0">
                  {expandedFaq === faq.id ? '▼' : '▶'}
                </span>
              </button>

              {/* Answer - Expanded */}
              {expandedFaq === faq.id && (
                <div className="border-t border-amber-900 p-5 bg-slate-800 bg-opacity-50">
                  <p className="text-amber-100 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-slate-900 bg-opacity-80 border border-amber-900 rounded-lg p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-amber-100 mb-4">{t('help.needMoreHelp')}</h2>
          <p className="text-amber-100 leading-relaxed mb-6">
            {t('help.helpDesc')}
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/about')}
              className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded transition"
            >
              {t('help.learnMore')}
            </button>
            <button
              onClick={() => navigate('/runes')}
              className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded transition"
            >
              {t('help.viewRunes')}
            </button>
          </div>
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

export default Help
