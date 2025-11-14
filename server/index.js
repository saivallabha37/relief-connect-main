import express from 'express'
import { GoogleAuth } from 'google-auth-library'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
})

const MODEL = process.env.GENAI_MODEL || 'gemini-1.5-mini'

app.post('/api/gemini/generate', async (req, res) => {
  const { prompt, model: clientModel, generationConfig } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  try {
    const client = await auth.getClient()
    const tokenResponse = await client.getAccessToken()
    const accessToken = tokenResponse?.token || tokenResponse

    const targetModel = clientModel || MODEL
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/${encodeURIComponent(targetModel)}:generateText`

    const body = {
      prompt: { text: prompt },
      // Allow client to forward generation config but keep server-side defaults
      ...(generationConfig ? { maxOutputTokens: generationConfig.maxOutputTokens || 1024 } : { maxOutputTokens: 1024 }),
    }

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await apiResponse.json()
    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: data })
    }

    return res.json(data)
  } catch (err) {
    console.error('Error calling Gemini API:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
