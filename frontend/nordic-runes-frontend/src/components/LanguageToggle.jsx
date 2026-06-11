import { useTranslation } from 'react-i18next'

function LanguageToggle() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
    >
      {i18n.language === 'en' ? 'Tiếng Việt' : 'English'}
    </button>
  )
}

export default LanguageToggle
