export const getShareableUrl = (pollId) => {
  // Use the Vercel deployment URL in production, localhost in development
  const baseUrl = import.meta.env.PROD ? 'https://pollsharelive.vercel.app' : 'http://localhost:5173'
  return `${baseUrl}/poll/${pollId}`
}