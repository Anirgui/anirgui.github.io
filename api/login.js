import crypto from 'crypto'

export default function handler(req, res) {
  // CORS
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://anirgui.github.io'
  )

  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, OPTIONS'
  )

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  )

  // Browser-ийн CORS preflight хүсэлт
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Зөвхөн POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  const { username, password } = req.body

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      error: 'Username эсвэл password буруу'
    })
  }

  const payload = {
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000
  }

  const data = Buffer
    .from(JSON.stringify(payload))
    .toString('base64url')

  const signature = crypto
    .createHmac('sha256', process.env.AUTH_SECRET)
    .update(data)
    .digest('base64url')

  const token = `${data}.${signature}`

  return res.status(200).json({
    success: true,
    message: 'Login амжилттай',
    token
  })
}