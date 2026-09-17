import crypto from 'crypto'

function verifyToken(token) {
  if (!token) return null

  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [data, signature] = parts

  const expectedSignature = crypto
    .createHmac('sha256', process.env.AUTH_SECRET)
    .update(data)
    .digest('base64url')

  if (signature !== expectedSignature) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, 'base64url').toString()
    )

    if (payload.exp < Date.now()) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export default function handler(req, res) {
  const auth = req.headers.authorization

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Token шаардлагатай'
    })
  }

  const token = auth.substring(7)
  const user = verifyToken(token)

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Token буруу эсвэл хугацаа дууссан'
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Token зөв байна',
    user
  })
}