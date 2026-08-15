import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function r2DevUploadPlugin(): Plugin {
  return {
    name: 'r2-dev-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const url = new URL(req.url || '', `http://${req.headers.host}`);
          let filename = url.searchParams.get('filename') || `media/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;

          const chunks: Uint8Array[] = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const buffer = Buffer.concat(chunks);

          const s3Client = new S3Client({
            region: 'auto',
            endpoint: process.env.VITE_CLOUDFLARE_R2_ENDPOINT || process.env.CLOUDFLARE_R2_ENDPOINT || 'https://9b8d3c83ca55e7273d30228c314b46b0.r2.cloudflarestorage.com',
            credentials: {
              accessKeyId: process.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '5a6c64ef1850cfc2e90dee711190ecf6',
              secretAccessKey: process.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || 'dbe6b580163271dc0120af9ac847d844c71a588085f176d5068e3c679aa7401e',
            },
          });

          const bucketName = process.env.VITE_CLOUDFLARE_R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME || 'komoditi';
          const publicBaseUrl = process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-c8dba5437abe46c48a5fbab48da0b9d6.r2.dev';

          await s3Client.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: filename,
              Body: buffer,
              ContentType: req.headers['content-type'] || 'image/jpeg',
            })
          );

          const publicUrl = `${publicBaseUrl}/${filename}`;

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ url: publicUrl, filename }));
        } catch (err: any) {
          console.error('R2 Dev Upload Middleware Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Dev R2 upload failed' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), r2DevUploadPlugin()],
});
