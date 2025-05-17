const STORAGE_PREFIX = 'pollshare_'

export const savePoll = (pollId, pollData) => {
  try {
    const key = `${STORAGE_PREFIX}${pollId}`
    localStorage.setItem(key, JSON.stringify(pollData))
    // Create a shareable version of the poll data
    const shareableData = {
      question: pollData.question,
      options: pollData.options,
      votes: pollData.votes,
      voters: pollData.voters,
      createdAt: pollData.createdAt
    }
    // Convert to base64 to make it URL-safe
    const encodedData = btoa(JSON.stringify(shareableData))
    return encodedData
  } catch (error) {
    console.error('Error saving poll:', error)
    return null
  }
}

export const getPoll = (pollId) => {
  try {
    // First try to get from localStorage
    const key = `${STORAGE_PREFIX}${pollId}`
    const localData = localStorage.getItem(key)
    if (localData) {
      return JSON.parse(localData)
    }
    
    // If not in localStorage, try to get from URL
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get('data')
    if (encodedData) {
      const decodedData = JSON.parse(atob(encodedData))
      // Save to localStorage for future use
      localStorage.setItem(key, JSON.stringify(decodedData))
      return decodedData
    }
    
    return null
  } catch (error) {
    console.error('Error getting poll:', error)
    return null
  }
}