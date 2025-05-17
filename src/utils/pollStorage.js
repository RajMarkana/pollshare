const STORAGE_PREFIX = 'pollshare_'

export const savePoll = (pollId, pollData) => {
  try {
    const key = `${STORAGE_PREFIX}${pollId}`
    const encodedData = btoa(JSON.stringify(pollData))
    localStorage.setItem(key, JSON.stringify(pollData))
    // Update URL with latest data
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('data', encodedData)
    window.history.replaceState({}, '', newUrl)
    return true
  } catch (error) {
    console.error('Error saving poll:', error)
    return false
  }
}

export const getPoll = (pollId) => {
  try {
    // Try to get from URL first
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get('data')
    let pollData = null

    if (encodedData) {
      try {
        pollData = JSON.parse(atob(encodedData))
      } catch (e) {
        console.error('Error parsing URL data:', e)
      }
    }

    // If no URL data, try localStorage
    if (!pollData) {
      const key = `${STORAGE_PREFIX}${pollId}`
      const localData = localStorage.getItem(key)
      if (localData) {
        pollData = JSON.parse(localData)
      }
    }

    return pollData
  } catch (error) {
    console.error('Error getting poll:', error)
    return null
  }
}