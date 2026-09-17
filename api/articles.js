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

function authenticate(req, res) {
  const auth = req.headers.authorization

  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Token шаардлагатай'
    })

    return null
  }

  const token = auth.substring(7)

  const user = verifyToken(token)

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'Token буруу эсвэл хугацаа дууссан'
    })

    return null
  }

  return user
}

export default async function handler(req, res) {

  // CORS
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://anirgui.github.io'
  )

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  // OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // =========================
  // GET
  // =========================

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

  // =========================
  // AUTHENTICATION
  // =========================

  if (
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE'
  ) {

    const user = authenticate(req, res)

    if (!user) {
      return
    }

    try {

      // =========================
      // POST — шинэ нийтлэл
      // =========================

      if (req.method === 'POST') {

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
          (
            id,
            title,
            author,
            category,
            content,
            status,
            date
          )
          VALUES
          (
            ${id},
            ${title},
            ${author},
            ${category},
            ${content},
            ${status},
            ${date}
          )
          RETURNING *
        `

        return res.status(201).json({
          success: true,
          message: 'Нийтлэл Neon database-д хадгалагдлаа',
          article: rows[0]
        })
      }

      // =========================
      // PUT — нийтлэл засах
      // =========================

      if (req.method === 'PUT') {

        const {
          id,
          title,
          author,
          category,
          content
        } = req.body

        const rows = await sql`
          UPDATE articles
          SET
            title = ${title},
            author = ${author},
            category = ${category},
            content = ${content}
          WHERE id = ${id}
          RETURNING *
        `

        if (rows.length === 0) {

          return res.status(404).json({
            success: false,
            error: 'Нийтлэл олдсонгүй'
          })
        }

        return res.status(200).json({
          success: true,
          message: 'Нийтлэл шинэчлэгдлээ',
          article: rows[0]
        })
      }

      // =========================
      // DELETE — нийтлэл устгах
      // =========================

      if (req.method === 'DELETE') {

        const { id } = req.body

        const rows = await sql`
          DELETE FROM articles
          WHERE id = ${id}
          RETURNING *
        `

        if (rows.length === 0) {

          return res.status(404).json({
            success: false,
            error: 'Нийтлэл олдсонгүй'
          })
        }

        return res.status(200).json({
          success: true,
          message: 'Нийтлэл устгагдлаа',
          article: rows[0]
        })
      }

    } catch (error) {

      console.error(error)

      return res.status(500).json({
        success: false,
        error: 'Database үйлдэлд алдаа гарлаа'
      })
    }
  }

  // =========================
  // METHOD NOT ALLOWED
  // =========================

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
}