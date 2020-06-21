import { Client } from 'discord.js';

export const readyListener = (client: Client) => {
  console.info(`Logged in as ${client.user.tag}!\n`);
};
