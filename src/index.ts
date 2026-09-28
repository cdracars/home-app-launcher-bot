import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { apps } from './apps.js';
import { appLauncher } from './response.js';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('DISCORD_TOKEN is required. Copy .env.example to .env first.');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Launcher bot is ready as ${readyClient.user.tag}.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const app = apps.find((candidate) => candidate.command === interaction.commandName);
  if (interaction.commandName === 'apps' || app) {
    await interaction.reply({ ...appLauncher(app), ephemeral: true });
  }
});

await client.login(token);
