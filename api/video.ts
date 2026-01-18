import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const { video } = req.query;

    if (!video || typeof video !== 'string') {
        return res.status(400).json({ error: 'Video parameter is required' });
    }

    const CLOUDINARY_CLOUD_NAME = 'de5jsf8pj';
    const API_KEY = process.env.CLOUDINARY_API_KEY;
    const API_SECRET = process.env.CLOUDINARY_API_SECRET;

    if (!API_KEY || !API_SECRET) {
        return res.status(500).json({ error: 'Cloudinary credentials not configured' });
    }

    try {
        // Gerar assinatura para URL autenticada
        const timestamp = Math.round(Date.now() / 1000);
        const crypto = await import('crypto');

        const stringToSign = `timestamp=${timestamp}&type=authenticated${API_SECRET}`;
        const signature = crypto
            .createHash('sha256')
            .update(stringToSign)
            .digest('hex');

        // Construir URL autenticada
        const authenticatedUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/s--${signature}--/t_${timestamp}/${video}`;

        // Fazer proxy do vídeo
        const videoResponse = await fetch(authenticatedUrl);

        if (!videoResponse.ok) {
            return res.status(videoResponse.status).json({ error: 'Failed to fetch video' });
        }

        // Copiar headers relevantes
        const contentType = videoResponse.headers.get('content-type');
        const contentLength = videoResponse.headers.get('content-length');

        if (contentType) res.setHeader('Content-Type', contentType);
        if (contentLength) res.setHeader('Content-Length', contentLength);

        // Headers de cache
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        // Stream do vídeo
        const buffer = await videoResponse.arrayBuffer();
        return res.send(Buffer.from(buffer));

    } catch (error) {
        console.error('Error proxying video:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
