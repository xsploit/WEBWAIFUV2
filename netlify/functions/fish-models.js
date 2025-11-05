// Netlify serverless function to fetch Fish Audio voice models

export async function handler(event) {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
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
        // Fetch models from Fish Audio API
        const response = await fetch('https://api.fish.audio/model', {
            headers: { 
                'Authorization': `Bearer ${apiKey}` 
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fish Audio API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Error fetching Fish Audio models:', error);
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

