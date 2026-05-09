exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { text, voiceId } = JSON.parse(event.body || '{}')
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'ELEVENLABS_API_KEY is not available to the Netlify function. Check the Netlify environment variable name and redeploy.',
        }),
      }
    }

    if (!text || !voiceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing text or voiceId' }),
      }
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.42,
          similarity_boost: 0.75,
          style: 0.32,
          use_speaker_boost: true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'ElevenLabs rejected the TTS request.',
          status: response.status,
          details: errorText,
          hint: response.status === 401 ? 'Check that the API key is correct, has Voice Generation access, and that the site was redeployed after adding the variable.' : undefined,
        }),
      }
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
      isBase64Encoded: true,
      body: buffer.toString('base64'),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'TTS generation failed',
        details: String(error),
      }),
    }
  }
}
