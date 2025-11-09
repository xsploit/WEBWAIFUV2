/**
 * Fish Audio WebSocket Server for Local Development
 *
 * Run this server locally for ultra-fast Fish Audio TTS streaming
 * Usage: node fish-websocket-server.js
 *
 * Production (Netlify) uses REST API instead
 */

import { FishAudioClient, RealtimeEvents } from 'fish-audio';
import { WebSocketServer } from 'ws';
import http from 'http';

const PORT = 8765;

// Create minimal HTTP server (just for WebSocket upgrade)
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Fish Audio WebSocket Server Running\n');
});

const wss = new WebSocketServer({ server, path: '/fish-ws' });

console.log('🐟 Fish Audio WebSocket Server Starting...');

wss.on('connection', (clientWs) => {
    console.log('✅ Client connected');

    let fishAudioClient = null;
    let apiKey = null;
    let modelId = null;

    clientWs.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());

            // Initialize Fish Audio credentials
            if (data.type === 'init') {
                console.log('🐟 Saving Fish Audio credentials...');
                apiKey = data.apiKey;
                modelId = data.modelId || undefined;

                fishAudioClient = new FishAudioClient({ apiKey: apiKey });

                clientWs.send(JSON.stringify({
                    type: 'ready',
                    timestamp: Date.now()
                }));
            }

            // Start streaming a new message
            else if (data.type === 'start') {
                console.log('🚀 Starting new Fish Audio stream...');

                const textChunks = [];
                let streamComplete = false;

                async function* messageTextGenerator() {
                    console.log('📝 Message generator started');
                    while (!streamComplete || textChunks.length > 0) {
                        if (textChunks.length > 0) {
                            const chunk = textChunks.shift();
                            console.log(`📤 Yielding: "${chunk.substring(0, 50)}..."`);
                            yield chunk;
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 10));
                        }
                    }
                    console.log('✅ Message generator complete');
                }

                try {
                    const request = {
                        text: '',
                        reference_id: modelId,
                        format: 'mp3',
                        latency: 'balanced',
                        chunk_length: 100
                    };

                    const connection = await fishAudioClient.textToSpeech.convertRealtime(
                        request,
                        messageTextGenerator()
                    );

                    connection.on(RealtimeEvents.AUDIO_CHUNK, (audio) => {
                        const audioBuffer = Buffer.isBuffer(audio) ? audio : Buffer.from(audio);
                        console.log(`🎵 Audio chunk: ${audioBuffer.length} bytes`);
                        clientWs.send(audioBuffer, { binary: true });
                    });

                    connection.on(RealtimeEvents.ERROR, (err) => {
                        console.error('❌ Fish Audio error:', err);
                        clientWs.send(JSON.stringify({ type: 'error', message: err.message || String(err) }));
                    });

                    connection.on(RealtimeEvents.CLOSE, () => {
                        console.log('🔌 Fish Audio connection closed');
                        clientWs.send(JSON.stringify({ type: 'fish-closed', timestamp: Date.now() }));
                    });

                    // Store for adding text chunks
                    clientWs.currentStream = { textChunks, streamComplete: () => { streamComplete = true; } };

                } catch (error) {
                    console.error('❌ Failed to start stream:', error);
                    clientWs.send(JSON.stringify({ type: 'error', message: error.message || String(error) }));
                }
            }

            // Add text to current stream
            else if (data.type === 'text') {
                if (clientWs.currentStream) {
                    console.log(`📝 Adding text: "${data.text.substring(0, 50)}..."`);
                    clientWs.currentStream.textChunks.push(data.text);
                } else {
                    console.warn('⚠️ No active stream - ignoring text');
                }
            }

            // Stop streaming
            else if (data.type === 'stop') {
                console.log('⏹️ Stopping stream');
                if (clientWs.currentStream) {
                    clientWs.currentStream.streamComplete();
                    clientWs.currentStream = null;
                }
            }

        } catch (error) {
            console.error('❌ Error processing message:', error);
            clientWs.send(JSON.stringify({
                type: 'error',
                message: error.message
            }));
        }
    });

    clientWs.on('close', () => {
        console.log('👋 Client disconnected');
        clientWs.currentStream = null;
    });

    clientWs.on('error', (error) => {
        console.error('❌ Client WebSocket error:', error);
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Fish Audio WebSocket Server running on ws://localhost:${PORT}/fish-ws`);
    console.log(`📡 Waiting for connections...\n`);
});
