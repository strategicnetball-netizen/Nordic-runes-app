import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import LandingSlate from './pages/LandingSlate'
import LandingPurple from './pages/LandingPurple'
import LandingIndigo from './pages/LandingIndigo'
import Home from './pages/Home'
import DrawRunes from './pages/DrawRunes'
import ReadingResult from './pages/ReadingResult'
import RunesReference from './pages/RunesReference'
import RuneOfDay from './pages/RuneOfDay'
import About from './pages/About'
import ReadingHistory from './pages/ReadingHistory'
import Help from './pages/Help'

function AppContent() {
  const [reading, setReading] = useState(null)
  const navigate = useNavigate()

  const handleStartReading = () => {
    navigate('/draw')
  }

  const handleReadingComplete = (readingData) => {
    setReading(readingData)
    navigate('/reading')
  }

  const handleBackHome = () => {
    navigate('/home')
    setReading(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-norse-900 via-norse-800 to-norse-900">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/draw" element={<DrawRunes onReadingComplete={handleReadingComplete} onBack={handleBackHome} />} />
        <Route path="/reading" element={<ReadingResult reading={reading} onBack={handleBackHome} />} />
        <Route path="/runes" element={<RunesReference onBack={handleBackHome} />} />
        <Route path="/rune-of-day" element={<RuneOfDay />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<ReadingHistory />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
