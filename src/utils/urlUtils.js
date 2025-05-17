export const getShareableUrl = (pollId) => {
  const baseUrl = import.meta.env.PROD ? 'https://pollsharelive.vercel.app' : 'http://localhost:5173'
  const poll = localStorage.getItem(`pollshare_${pollId}`)
  if (!poll) return `${baseUrl}/poll/${pollId}`
  
  const encodedData = btoa(poll)
  return `${baseUrl}/poll/${pollId}?data=${encodedData}`
}