
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreatePoll from './components/CreatePoll'
import ViewPoll from './components/ViewPoll'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<ViewPoll />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App