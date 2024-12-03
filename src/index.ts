import { Hono } from 'hono';

interface Env {
  STABLE_DIFFUSION_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

let lastRequestTime: number | null = null;

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('/generate-image', async (c) => {
  const currentTime = Date.now();
  const stableDiffusionAPIKey = c.env.STABLE_DIFFUSION_API_KEY;

  // Check for the last request time
  if (lastRequestTime && (currentTime - lastRequestTime) < 10000) {
    return c.json(
      { error: '10秒以内にリクエストが送信されました。しばらくお待ちください。' },
      429
    );
  }

  // Update last request time
  lastRequestTime = currentTime;

  // Get the query from the request body
  const { query } = await c.req.json();

  // Validate that query is present
  if (!query) {
    return c.json({ error: 'クエリが指定されていません。' }, 400);
  }

  const payload = {
    prompt: query,
    output_format: 'jpeg',
    style_preset: 'digital-art',
  };

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  try {
    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${stableDiffusionAPIKey}`,
          Accept: 'image/*',
        },
      }
    );

    if (!response.ok) {
      console.error('Error occurred:', response.statusText);
      return c.json(
        { error: 'Stable Diffusion API failed to generate the image.' },
        500
      );
    }

    // Convert image response to base64
    const imageArrayBuffer = await response.arrayBuffer();
    const imageBase64 = arrayBufferToBase64(imageArrayBuffer);

    // Update last request time
    lastRequestTime = currentTime;

    return c.json({ image: imageBase64 });
  } catch (error) {
    console.error('Error occurred while fetching:', error);
    return c.json({ error: 'An unexpected error occurred.' }, 500);
  }
});

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default app;
