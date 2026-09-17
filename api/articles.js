import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

function verifyToken(token) {
  if (!token) return null

  const parts = token.split('.')

  if (parts.length !== 2) {
    return null
  }

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
  // Token шалгах
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

  // POST хүсэлт
  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'POST backend-д ирлээ',
      article: req.body
    })
  }

  // GET-ээс өөр method байвал
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  // articles.json унших
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'articles.json'
    )

    const articles = JSON.parse(
      fs.readFileSync(filePath, 'utf-8')
    )

    return res.status(200).json({
      success: true,
      articles
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Articles уншихад алдаа гарлаа'
    })
  }
}