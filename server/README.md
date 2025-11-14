# Gemini proxy server

This server provides a secure proxy endpoint for calling Google Gemini / Generative Language API. It uses Application Default Credentials (service account) and does not store API keys in source control.

Usage
- Place your service account JSON on the server and set GOOGLE_APPLICATION_CREDENTIALS to its path (or configure ADC another supported way).
- Copy `server/.env.example` to `server/.env` and adjust `GENAI_MODEL` if needed.
- Install dependencies and run the server.

Endpoints
- POST /api/gemini/generate
  - body: { prompt: string }
  - returns: the raw response from the Generative Language API
