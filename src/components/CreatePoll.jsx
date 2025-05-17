import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import PollChart from './PollChart'
import { savePoll } from '../utils/pollStorage'

const CreatePoll = () => {
  const navigate = useNavigate()
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', ''],
    id: Date.now().toString(36) + Math.random().toString(36).substr(2)
  })

  const handleQuestionChange = (e) => {
    setPollData({ ...pollData, question: e.target.value })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options]
    newOptions[index] = value
    setPollData({ ...pollData, options: newOptions })
  }

  const addOption = () => {
    setPollData({ ...pollData, options: [...pollData.options, ''] })
  }

  const removeOption = (index) => {
    const newOptions = pollData.options.filter((_, i) => i !== index)
    setPollData({ ...pollData, options: newOptions })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const poll = {
      ...pollData,
      votes: Array(pollData.options.length).fill(0),
      voters: [],
      createdAt: Date.now() // Add timestamp for validation
    }
    savePoll(poll.id, poll)
    navigate(`/poll/${poll.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto grid gap-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-[1.02] transition-all duration-300">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Create Your Poll
          </h1>
          <p className="text-blue-600 mt-2 opacity-80">Create and share polls with your audience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 transform hover:shadow-xl transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-blue-900">Your Question</label>
                <input
                  type="text"
                  value={pollData.question}
                  onChange={handleQuestionChange}
                  placeholder="What would you like to ask?"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all duration-300 text-blue-900 placeholder-blue-300"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-semibold text-blue-900">Options</label>
                <div className="grid gap-3">
                  {pollData.options.map((option, index) => (
                    <div key={index} className="group flex items-center gap-2 transform hover:scale-[1.01] transition-all duration-200">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring focus:ring-blue-200 transition-all duration-300"
                        required
                      />
                      {pollData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addOption}
                  className="w-full py-3 px-4 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Option
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300"
              >
                Create Poll
              </button>
            </form>
          </div>

          {/* Preview Section */}
          {pollData.question && pollData.options.some(opt => opt.trim() !== '') && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Preview</h2>
                <PollChart
                  question={pollData.question}
                  options={pollData.options.filter(opt => opt.trim() !== '')}
                  votes={Array(pollData.options.length).fill(0)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips for Creating Great Polls</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-blue-800">Keep questions clear and concise</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-blue-800">Provide distinct options</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-blue-800">Avoid leading or biased questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePoll