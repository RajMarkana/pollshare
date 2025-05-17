const STORAGE_PREFIX = 'pollshare_'

export const savePoll = (pollId, pollData) => {
  try {
    const key = `${STORAGE_PREFIX}${pollId}`
    localStorage.setItem(key, JSON.stringify(pollData))
    return true
  } catch (error) {
    console.error('Error saving poll:', error)
    return false
  }
}

export const getPoll = (pollId) => {
  try {
    const key = `${STORAGE_PREFIX}${pollId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error getting poll:', error)
    return null
  }
}