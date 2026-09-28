# Home App Launcher Bot

A deliberately small Discord bot that opens the Task Prioritizer and Stitch Counter. It does not access browser storage or collect task data.

## Setup

1. Create a Discord application and add a bot at <https://discord.com/developers/applications>.
2. Copy `.env.example` to `.env` and set `DISCORD_TOKEN` and `DISCORD_APPLICATION_ID`.
3. During testing, set `DISCORD_GUILD_ID` to the server ID. This makes command changes appear immediately.
4. Install dependencies and register commands:

   ```bash
   npm install
   npm run register
   npm run dev
   ```

5. Invite the bot using the OAuth2 URL Generator with the `bot` and `applications.commands` scopes. It needs only `Send Messages` and `Use Application Commands` permissions.

## Commands

- `/apps` — shows both launch buttons.
- `/tasks` — opens the Task Prioritizer.
- `/stitch` — opens the Stitch Counter.

The app URLs are configurable in `.env`; this prevents hosting details from being baked into the bot.

## License

[MIT](LICENSE)

## Deployment

### Local gateway bot

`npm run dev` starts a long-running local process. It goes offline when that computer or process stops.

### Always-on Cloudflare Worker

The Worker implementation receives signed Discord interaction webhooks, so it does not need a permanent server or the Discord bot token. It requires only the Discord application's public key, stored as a Cloudflare Worker secret.

Run the guided setup from the project directory:

```bash
bash /tmp/home-app-launcher-bot-cloudflare-setup.sh
```

The wizard deploys the Worker, stores the verification key, and walks through setting the Discord **Interaction Endpoint URL** to `<worker-url>/interactions`. Once that URL is saved successfully, stop the local `npm run dev` process.
