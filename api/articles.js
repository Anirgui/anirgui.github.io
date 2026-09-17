import crypto from 'crypto'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

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

export default async function handler(req, res) {
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

  // POST — шинэ нийтлэл хадгалах
  if (req.method === 'POST') {
    try {
      const {
        id,
        title,
        author,
        category,
        content,
        status,
        date
      } = req.body

      const rows = await sql`
        INSERT INTO articles
        (id, title, author, category, content, status, date)
        VALUES
        (${id}, ${title}, ${author}, ${category}, ${content}, ${status}, ${date})
        RETURNING *
      `

      return res.status(201).json({
        success: true,
        message: 'Нийтлэл Neon database-д хадгалагдлаа',
        article: rows[0]
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        success: false,
        error: 'Нийтлэл database-д хадгалахад алдаа гарлаа'
      })
    }
  }

  // GET — нийтлэлүүдийг Neon-оос унших
  if (req.method === 'GET') {
    try {
      const articles = await sql`
        SELECT *
        FROM articles
        ORDER BY id DESC
      `

      return res.status(200).json({
        success: true,
        articles
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        success: false,
        error: 'Articles database-оос уншихад алдаа гарлаа'
      })
    }
  }

  // Бусад method
  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
}