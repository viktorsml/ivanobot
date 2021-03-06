import { Message, MessageEmbed } from 'discord.js';

import { getArkStatus } from './ark-status.command';

export const arkServerLinkCommand = async (message: Message) => {
  const { currentStatus, arkServersLink } = await getArkStatus();

  if (currentStatus === 'OFFLINE') {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Chale, esa si te la debo. No puedo econtrar el link del server pues está apagado. :pleading_face:')
    );
    return;
  }

  if (currentStatus === 'STARTING') {
    message.channel.send(
      new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('Aguántame poquito. En cuanto el servidor de ARK se inicie completamente podrás revisar el link. :cowboy:')
    );
    return;
  }

  const caguamoArkLink = arkServersLink.replace('ARKServers link: ', '');
  message.channel.send(`Este es el link de estado de CaguamoArk en *ArkServers.net* :wink:\n\n${caguamoArkLink}`);
};
