import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

function LandingSlate() {
  const navigate = useNavigate()
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err)
      })
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-12 relative overflow-hidden" style={{ backgroundImage: 'url(/runes-landing.jpg)', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#0a0a14' }}>
      <audio ref={audioRef} loop>
        <source src="/landing-music.mp3" type="audio/mpeg" />
      </audio>

      <div className="w-full relative z-10 flex justify-end pt-4">
        <button
          onClick={toggleMute}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
        >
          {isMuted ? t('common.unmute') : t('common.mute')}
        </button>
      </div>

      <div className="relative z-10 text-center flex-1 flex items-center justify-center">
        <p className="text-2xl text-amber-100 font-semibold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', maxWidth: '600px' }}>
          {t('landing.headline')}
        </p>
      </div>

      <div className="relative z-10 pb-8">
        <button
          onClick={() => navigate('/home')}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
        >
          {t('landing.cta')}
        </button>
      </div>
    </div>
  )
}

export default LandingSlate
