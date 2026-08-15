// Client-side image compressor helper returning a Blob via URL.createObjectURL (Zero Base64 processing)
export const compressImageBlob = async (file: File, maxDimension = 800, maxQuality = 0.75): Promise<Blob> => {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > maxDimension || h > maxDimension) {
        const ratio = Math.min(maxDimension / w, maxDimension / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
      }
      canvas.toBlob(
        (blob) => {
          resolve(blob || file);
        },
        'image/jpeg',
        maxQuality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

export async function uploadToR2(file: File, folder = 'media'): Promise<string> {
  const compressedBlob = await compressImageBlob(file, 800, 0.75);
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanFileName}`;

  // Read binary arrayBuffer directly from Blob (no base64 string involved)
  const arrayBuffer = await compressedBlob.arrayBuffer();

  const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: arrayBuffer,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed with status ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  if (!data.url) {
    throw new Error('Upload response missing url');
  }

  return data.url;
}
