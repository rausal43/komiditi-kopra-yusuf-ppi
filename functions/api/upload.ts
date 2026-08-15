interface Env {
  R2_BUCKET?: any;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    let filename = url.searchParams.get('filename');

    const contentType = context.request.headers.get('content-type') || 'image/jpeg';
    let arrayBuffer: ArrayBuffer;

    if (contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      const file = formData.get('file') as File;
      const folder = (formData.get('folder') as string) || 'media';
      if (!file) throw new Error('No file provided in form data');
      filename = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      arrayBuffer = await file.arrayBuffer();
    } else {
      if (!filename) {
        filename = `media/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
      }
      arrayBuffer = await context.request.arrayBuffer();
    }

    if (context.env.R2_BUCKET) {
      await context.env.R2_BUCKET.put(filename, arrayBuffer, {
        httpMetadata: { contentType: 'image/jpeg' },
      });
    } else {
      throw new Error('R2_BUCKET binding is missing in environment');
    }

    const publicBaseUrl = 'https://pub-c8dba5437abe46c48a5fbab48da0b9d6.r2.dev';
    const publicUrl = `${publicBaseUrl}/${filename}`;

    return new Response(JSON.stringify({ url: publicUrl, filename }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Upload failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
