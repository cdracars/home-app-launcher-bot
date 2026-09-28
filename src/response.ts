import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { apps, type AppLink } from './apps.js';

function linkButton(app: AppLink): ButtonBuilder {
  return new ButtonBuilder()
    .setLabel(app.label)
    .setStyle(ButtonStyle.Link)
    .setURL(app.url);
}

export function appLauncher(app?: AppLink) {
  const shownApps = app ? [app] : apps;
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(app ? app.label : 'Home apps')
    .setDescription(
      app
        ? app.description
        : 'Choose an app to open. This bot only launches links; it does not read app data.'
    );

  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        shownApps.map(linkButton)
      ),
    ],
  };
}
