import { put, get } from '@vercel/blob'

export default async function handler(req, res) {
  try {
    // GET — background зураг авах
    if (req.method === 'GET') {
      const result = await get('background/background.jpg', {
        access: 'private'
      })

      if (!result) {
        return res.status(404).json({
          error: 'Background зураг олдсонгүй'
        })
      }

      res.setHeader(
        'Content-Type',
        result.blob.contentType || 'image/jpeg'
      )

      res.setHeader(
        'Cache-Control',
        'private, no-cache'
      )

      return result.stream.pipe(res)
    }

    // POST — background зураг upload хийх
    if (req.method === 'POST') {
      const chunks = []

      for await (const chunk of req) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)

      const blob = await put(
        'background/background.jpg',
        buffer,
        {
          access: 'private',
          addRandomSuffix: false,
          contentType: 'image/jpeg'
        }
      )

      return res.status(200).json({
        success: true,
        url: blob.url
      })
    }

    return res.status(405).json({
      error: 'Method not allowed'
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: 'Background зураг боловсруулахад алдаа гарлаа'
    })
  }
}