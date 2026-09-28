import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token || !applicationId) {
  throw new Error('DISCORD_TOKEN and DISCORD_APPLICATION_ID are required.');
}

const commands = [
  new SlashCommandBuilder()
    .setName('apps')
    .setDescription('Open one of the home apps.'),
  new SlashCommandBuilder()
    .setName('tasks')
    .setDescription('Open the task prioritizer.'),
  new SlashCommandBuilder()
    .setName('stitch')
    .setDescription('Open the stitch counter.'),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);
const guildId = process.env.DISCORD_GUILD_ID;

await rest.put(
  guildId
    ? Routes.applicationGuildCommands(applicationId, guildId)
    : Routes.applicationCommands(applicationId),
  { body: commands }
);

console.log(
  guildId
    ? `Registered commands for guild ${guildId}.`
    : 'Registered global commands.'
);
