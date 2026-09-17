import crypto from 'crypto'

export default function handler(req, res) {
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