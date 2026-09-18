import crypto from 'crypto'
import {
  put,
  get,
  del
} from '@vercel/blob'


const BLOB_PATH =
  'background/background.jpg'


// =========================
// Token шалгах
// =========================

function verifyToken(token) {

  if (!token) {
    return false
  }


  const parts =
    token.split('.')


  if (parts.length !== 2) {
    return false
  }


  const [
    data,
    signature
  ] = parts


  const expectedSignature =
    crypto
      .createHmac(
        'sha256',
        process.env.AUTH_SECRET
      )
      .update(data)
      .digest('base64url')


  if (
    signature !==
    expectedSignature
  ) {
    return false
  }


  try {

    const payload =
      JSON.parse(
        Buffer
          .from(
            data,
            'base64url'
          )
          .toString()
      )


    if (
      payload.exp <
      Date.now()
    ) {
      return false
    }


    return true

  } catch {

    return false

  }

}


// =========================
// Authentication
// =========================

function authenticate(
  req,
  res
) {

  const auth =
    req.headers.authorization


  if (
    !auth ||
    !auth.startsWith(
      'Bearer '
    )
  ) {

    res.status(401).json({
      success: false,
      error: 'Token шаардлагатай'
    })

    return false

  }


  const token =
    auth.substring(7)


  if (
    !verifyToken(token)
  ) {

    res.status(401).json({
      success: false,
      error:
        'Token буруу эсвэл хугацаа дууссан'
    })

    return false

  }


  return true

}


// =========================
// API
// =========================

export default async function handler(
  req,
  res
) {

  try {

    // =====================
    // CORS
    // =====================

    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://anirgui.github.io'
    )

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, DELETE, OPTIONS'
    )

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )


    // =====================
    // OPTIONS
    // =====================

    if (
      req.method === 'OPTIONS'
    ) {

      return res
        .status(200)
        .end()

    }


    // =====================
    // GET
    // =====================

    if (
      req.method === 'GET'
    ) {

      const result =
        await get(
          BLOB_PATH,
          {
            access: 'private'
          }
        )


      if (!result) {

        return res
          .status(404)
          .json({
            success: false,
            error:
              'Background зураг олдсонгүй'
          })

      }


      res.setHeader(
        'Content-Type',
        result.blob.contentType ||
        'image/jpeg'
      )


      res.setHeader(
        'Cache-Control',
        'private, no-cache'
      )


      res.setHeader(
        'X-Content-Type-Options',
        'nosniff'
      )


      return result.stream.pipe(res)

    }


    // =====================
    // POST
    // =====================

    if (
      req.method === 'POST'
    ) {

      // Admin token шалгах

      if (
        !authenticate(
          req,
          res
        )
      ) {
        return
      }


      // Image шалгах

      const contentType =
        req.headers[
          'content-type'
        ]


      if (
        !contentType ||
        !contentType.startsWith(
          'image/'
        )
      ) {

        return res
          .status(400)
          .json({
            success: false,
            error:
              'Зөвхөн зураг upload хийнэ үү'
          })

      }


      // Binary data унших

      const chunks = []


      for await (
        const chunk of req
      ) {

        chunks.push(chunk)

      }


      const buffer =
        Buffer.concat(
          chunks
        )


      if (
        buffer.length === 0
      ) {

        return res
          .status(400)
          .json({
            success: false,
            error:
              'Зураг хоосон байна'
          })

      }


      // Blob-д хадгалах

      const blob =
        await put(
          BLOB_PATH,
          buffer,
          {
            access: 'private',

            addRandomSuffix: false,

            contentType:
              contentType
          }
        )


      return res
        .status(200)
        .json({
          success: true,
          message:
            'Background зураг хадгалагдлаа',
          url: blob.url
        })

    }


    // =====================
    // DELETE
    // =====================

    if (
      req.method === 'DELETE'
    ) {

      // Admin token шалгах

      if (
        !authenticate(
          req,
          res
        )
      ) {
        return
      }


      // Blob устгах

      await del(
        BLOB_PATH
      )


      return res
        .status(200)
        .json({
          success: true,
          message:
            'Background зураг устгагдлаа'
        })

    }


    // =====================
    // Бусад method
    // =====================

    return res
      .status(405)
      .json({
        success: false,
        error:
          'Method not allowed'
      })


  } catch (error) {

    console.error(
      'Background API error:',
      error
    )


    return res
      .status(500)
      .json({
        success: false,
        error:
          'Background зураг боловсруулахад алдаа гарлаа'
      })

  }

}