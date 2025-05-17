import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import PollChart from './PollChart'
import { getPoll, savePoll } from '../utils/pollStorage'
import { getShareableUrl } from '../utils/urlUtils'

const ViewPoll = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [poll, setPoll] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [voterName, setVoterName] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [error, setError] = useState('')
  const qrRef = useRef(null)

  useEffect(() => {
    const pollData = getPoll(id)
    if (!pollData) {
      navigate('/')
      return
    }

    // Validate poll data
    if (!pollData.createdAt || !pollData.options || !pollData.votes) {
      navigate('/')
      return
    }

    setPoll(pollData)
  }, [id, navigate])

  const handleVote = (e) => {
    e.preventDefault()
    if (!voterName.trim()) {
      setError('Please enter your name')
      return
    }
    if (!selectedOption) {
      setError('Please select an option')
      return
    }
    if (poll.voters.some(voter => voter.name.toLowerCase() === voterName.toLowerCase())) {
      setError('You have already voted')
      return
    }

    const updatedPoll = { ...poll }
    const optionIndex = poll.options.indexOf(selectedOption)
    updatedPoll.votes[optionIndex] += 1
    updatedPoll.voters.push({ name: voterName, option: selectedOption })
    
    if (savePoll(id, updatedPoll)) {
      setPoll(updatedPoll)
      setVoterName('')
      setSelectedOption('')
      setError('')
    } else {
      setError('Failed to save your vote. Please try again.')
    }
  }

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `poll-${id}-qr.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(getShareableUrl(id))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!poll) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto grid gap-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-[1.02] transition-all duration-300">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            {poll.question}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Share Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 transform hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-900">Share Poll</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              <button
                onClick={copyLink}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-100 text-blue-600 font-medium hover:bg-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            {showQR && (
              <div className="space-y-4">
                <div ref={qrRef} className="flex justify-center p-6 bg-white rounded-xl border-2 border-blue-100">
                  <QRCode value={getShareableUrl(id)} />
                </div>
                <button
                  onClick={downloadQR}
                  className="w-full py-3 px-4 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR Code
                </button>
              </div>
            )}
          </div>

          {/* Vote Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 transform hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-900">Cast Your Vote</h2>
            <form onSubmit={handleVote} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Your Name</label>
                <input
                  type="text"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all duration-300"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-3">
                {poll.options.map((option, index) => (
                  <label key={index} className="flex items-center p-4 rounded-xl border-2 border-blue-100 cursor-pointer transition-all duration-300 hover:border-blue-200 hover:bg-blue-50">
                    <input
                      type="radio"
                      name="poll-option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-blue-900">{option}</span>
                  </label>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300"
              >
                Submit Vote
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Results</h2>
              <PollChart
                question={poll.question}
                options={poll.options}
                votes={poll.votes}
              />
            </div>
          </div>

          {/* Recent Votes Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Recent Votes</h2>
            <div className="space-y-3">
              {poll.voters.slice(-5).reverse().map((voter, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-blue-50 text-blue-900 transform hover:scale-[1.02] transition-all duration-300"
                >
                  <span className="font-medium">{voter.name}</span>
                  <span className="text-blue-600"> voted for </span>
                  <span className="font-medium">{voter.option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPoll