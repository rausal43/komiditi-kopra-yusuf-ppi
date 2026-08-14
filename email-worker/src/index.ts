import PostalMime from 'postal-mime';

export interface Env {
  EMAIL: {
    send: (message: {
      to: string;
      from: { email: string; name?: string } | string;
      subject: string;
      text?: string;
      html?: string;
    }) => Promise<void>;
  };
}

export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[Email Received] From: ${message.from} | To: ${message.to}`);

    try {
      // 1. Buffer raw MIME content (message.raw is single-use)
      const rawBuffer = await new Response(message.raw).arrayBuffer();

      // 2. Parse MIME content (subject, text, html, attachments)
      const parsed = await PostalMime.parse(rawBuffer);

      console.log(`Subject: ${parsed.subject || '(No Subject)'}`);
      console.log(`Text Body Preview: ${(parsed.text || parsed.html || '').substring(0, 150)}...`);
      console.log(`Attachments Count: ${parsed.attachments ? parsed.attachments.length : 0}`);

      // 3. Example Auto-Reply (Uncomment & replace domain if onboarded with Email Sending)
      /*
      await env.EMAIL.send({
        to: message.from,
        from: { email: message.to, name: 'Kopra Sejati System' },
        subject: `Re: ${parsed.subject || 'Pesan Anda'}`,
        text: `Terima kasih! Pesan Anda telah kami terima dan sedang diproses secara otomatis.\n\nSubjek: ${parsed.subject}`,
        html: `<p>Terima kasih! Pesan Anda telah kami terima dan sedang diproses secara otomatis.</p><p><strong>Subjek:</strong> ${parsed.subject}</p>`,
      });
      */

    } catch (err) {
      console.error('Error processing incoming email:', err);
    }
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response(
      JSON.stringify({
        status: 'active',
        service: 'Komoditi Kopra Email Worker',
        timestamp: new Date().toISOString(),
        message: 'Worker is running. Inbound email handler ready.',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
