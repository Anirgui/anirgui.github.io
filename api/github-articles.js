export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(
    'https://api.github.com/repos/Anirgui/anirgui.github.io/contents/public/articles.json?ref=static',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    }
  )

  const data = await response.json()

  return res.status(response.status).json({
    success: response.ok,
    githubStatus: response.status,
    fileSha: data.sha || null
  })
}
