// Netlify serverless function for Fish Audio Text-to-Speech

export async function handler(event) {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, x-fish-api-key',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Get API key from headers
    const apiKey = event.headers['x-fish-api-key'];
    
    if (!apiKey) {
        return {
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'API key required' })
        };
    }

    try {
        // Parse request body
        const requestBody = JSON.parse(event.body);
        
        const {
            text,
            reference_id,
            prosody,
            chunk_length = 100,
            latency = 'balanced',
            format = 'mp3',
            mp3_bitrate = 128
        } = requestBody;

        if (!text) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Text is required' })
            };
        }

        // Make request to Fish Audio TTS API
        const ttsResponse = await fetch('https://api.fish.audio/v1/tts', {
            method: 'POST',
            headers: {
                'model': 's1',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                reference_id: reference_id || null,
                latency: latency,
                chunk_length: chunk_length,
                normalize: true,
                format: format,
                mp3_bitrate: mp3_bitrate,
                prosody: prosody || { speed: 1, volume: 0 },
                temperature: 0.9,
                top_p: 0.9
            })
        });

        if (!ttsResponse.ok) {
            const errorText = await ttsResponse.text();
            throw new Error(`Fish Audio TTS error: ${ttsResponse.status} - ${errorText}`);
        }

        // Get audio blob and convert to base64
        const audioBuffer = await ttsResponse.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'audio/mpeg'
            },
            body: audioBase64,
            isBase64Encoded: true
        };

    } catch (error) {
        console.error('Error in Fish Audio TTS:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
}

