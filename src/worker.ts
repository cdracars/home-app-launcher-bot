import { defaultApps, type AppLink } from './app-links.js';

interface Env {
  DISCORD_PUBLIC_KEY: string;
}

const encoder = new TextEncoder();

function fromHex(value: string): Uint8Array {
  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) {
    throw new Error('Expected an even-length hexadecimal value.');
  }

  return Uint8Array.from(
    Array.from({ length: value.length / 2 }, (_, index) =>
      Number.parseInt(value.slice(index * 2, index * 2 + 2), 16)
    )
  );
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength
  ) as ArrayBuffer;
}

async function verifiesDiscordRequest(
  request: Request,
  body: string,
  publicKey: string
): Promise<boolean> {
  const signature = request.headers.get('X-Signature-Ed25519');
  const timestamp = request.headers.get('X-Signature-Timestamp');
  if (!signature || !timestamp) return false;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      toArrayBuffer(fromHex(publicKey)),
      { name: 'Ed25519' },
      false,
      ['verify']
    );
    return crypto.subtle.verify(
      'Ed25519',
      key,
      toArrayBuffer(fromHex(signature)),
      toArrayBuffer(encoder.encode(timestamp + body))
    );
  } catch {
    return false;
  }
}

function button(app: AppLink) {
  return {
    type: 2,
    style: 5,
    label: app.label,
    url: app.url,
  };
}

function appResponse(app?: AppLink): Response {
  const shownApps = app ? [app] : defaultApps;
  const payload = {
    type: 4,
    data: {
      flags: 64,
      embeds: [
        {
          title: app ? app.label : 'Home apps',
          description: app
            ? app.description
            : 'Choose an app to open. This bot only launches links; it does not read app data.',
          color: 0x5865f2,
        },
      ],
      components: [
        {
          type: 1,
          components: shownApps.map(button),
        },
      ],
    },
  };

  return Response.json(payload);
}

function unknownCommandResponse(): Response {
  return Response.json({
    type: 4,
    data: {
      flags: 64,
      content: 'That command is not available.',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/') {
      return Response.json({ status: 'ok' });
    }

    if (request.method !== 'POST' || url.pathname !== '/interactions') {
      return new Response('Not found', { status: 404 });
    }

    const body = await request.text();
    if (!(await verifiesDiscordRequest(request, body, env.DISCORD_PUBLIC_KEY))) {
      return new Response('Invalid request signature', { status: 401 });
    }

    let interaction: { type?: number; data?: { name?: string } };
    try {
      interaction = JSON.parse(body) as typeof interaction;
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    if (interaction.type === 1) return Response.json({ type: 1 });
    if (interaction.type !== 2) return new Response('Unsupported interaction', { status: 400 });

    const app = defaultApps.find((candidate) => candidate.command === interaction.data?.name);
    return interaction.data?.name === 'apps'
      ? appResponse()
      : app
        ? appResponse(app)
        : unknownCommandResponse();
  },
};
