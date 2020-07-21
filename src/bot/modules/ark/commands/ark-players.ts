import { Message, MessageEmbed } from 'discord.js';

import { executeCommand } from '../functions/execute-command';

export const arkOnlinePlayersCommand = async (message: Message): Promise<void> => {
  try {
    const playerList = await executeCommand('arkmanager rconcmd "listplayers"', { runOnDocker: true });
    const cleanedPlayerList = playerList.filter((line) => /(\d{17})/.test(line)).map((line) => /(\. ([a-zA-Z!-_ñ]*),)/.exec(line)[2]);
    message.channel.send(new MessageEmbed().setColor('GREEN').setTitle('Jugadores online').setDescription(cleanedPlayerList));
  } catch (error) {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Whops! No puedo obtener los jugadores online. :disappointed_relieved:')
        .setFooter('UNABLE_TO_RETRIEVE_PLAYERS')
    );
  }
};
