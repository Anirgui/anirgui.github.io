const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 3001

const serverFilePath = path.join(
  __dirname,
  'articles.json'
)

const publicFilePath = path.join(
  __dirname,
  '..',
  'public',
  'articles.json'
)

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':
      'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type'
  })

  res.end(JSON.stringify(data))
}

const server = http.createServer(
  (req, res) => {

    // OPTIONS
    if (req.method === 'OPTIONS') {
      sendJSON(res, 200, {})
      return
    }

    // =========================
    // GET /api/articles
    // =========================
    if (
      req.method === 'GET' &&
      req.url === '/api/articles'
    ) {
      try {
        const articles = JSON.parse(
          fs.readFileSync(
            serverFilePath,
            'utf8'
          )
        )

        sendJSON(res, 200, articles)
      } catch (error) {
        console.error(error)

        sendJSON(res, 500, {
          error: 'Нийтлэл уншихад алдаа гарлаа'
        })
      }

      return
    }

    // =========================
    // POST /api/articles
    // =========================
    if (
      req.method === 'POST' &&
      req.url === '/api/articles'
    ) {
      let body = ''

      req.on('data', chunk => {
        body += chunk
      })

      req.on('end', () => {
        try {
          const newArticle = JSON.parse(body)

          const articles = JSON.parse(
            fs.readFileSync(
              serverFilePath,
              'utf8'
            )
          )

          articles.unshift(newArticle)

          const json = JSON.stringify(
            articles,
            null,
            2
          )

          fs.writeFileSync(
            serverFilePath,
            json
          )

          fs.writeFileSync(
            publicFilePath,
            json
          )

          sendJSON(
            res,
            201,
            newArticle
          )

        } catch (error) {
          console.error(error)

          sendJSON(res, 400, {
            error:
              'Нийтлэл нэмэхэд алдаа гарлаа'
          })
        }
      })

      return
    }

    // =========================
    // PUT /api/articles
    // =========================
    if (
      req.method === 'PUT' &&
      req.url === '/api/articles'
    ) {
      let body = ''

      req.on('data', chunk => {
        body += chunk
      })

      req.on('end', () => {
        try {
          const updatedArticle =
            JSON.parse(body)

          const articles = JSON.parse(
            fs.readFileSync(
              serverFilePath,
              'utf8'
            )
          )

          const index =
            articles.findIndex(
              article =>
                article.id ===
                updatedArticle.id
            )

          if (index === -1) {
            sendJSON(res, 404, {
              error:
                'Нийтлэл олдсонгүй'
            })

            return
          }

          articles[index] = {
            ...articles[index],
            ...updatedArticle
          }

          const json = JSON.stringify(
            articles,
            null,
            2
          )

          fs.writeFileSync(
            serverFilePath,
            json
          )

          fs.writeFileSync(
            publicFilePath,
            json
          )

          sendJSON(
            res,
            200,
            articles[index]
          )

        } catch (error) {
          console.error(error)

          sendJSON(res, 400, {
            error:
              'Нийтлэл засахад алдаа гарлаа'
          })
        }
      })

      return
    }

    // =========================
    // DELETE /api/articles
    // =========================
    if (
      req.method === 'DELETE' &&
      req.url === '/api/articles'
    ) {
      let body = ''

      req.on('data', chunk => {
        body += chunk
      })

      req.on('end', () => {
        try {
          const data = JSON.parse(body)

          const articles = JSON.parse(
            fs.readFileSync(
              serverFilePath,
              'utf8'
            )
          )

          const newArticles =
            articles.filter(
              article =>
                article.id !== data.id
            )

          const json = JSON.stringify(
            newArticles,
            null,
            2
          )

          fs.writeFileSync(
            serverFilePath,
            json
          )

          fs.writeFileSync(
            publicFilePath,
            json
          )

          sendJSON(res, 200, {
            message:
              'Нийтлэл устгагдлаа'
          })

        } catch (error) {
          console.error(error)

          sendJSON(res, 400, {
            error:
              'Нийтлэл устгахад алдаа гарлаа'
          })
        }
      })

      return
    }

    // =========================
    // Бусад URL
    // =========================
    sendJSON(res, 404, {
      error: 'API route олдсонгүй'
    })
  }
)

server.listen(
  PORT,
  () => {
    console.log(
      `API server: http://localhost:${PORT}`
    )
  }
)