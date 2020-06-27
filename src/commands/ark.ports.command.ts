import { Message } from "discord.js";
import { logger } from "../utils/logger";
import { ArkServerApi } from "../utils/arkServer.api";

export const arkPortCommand = (message: Message) => {
  logger('Getting ARK Server active ports', [`invoked by '@${message.author.username}'`]);
  message.reply('Espera un momento en lo que obtengo los puertos usados por ARK Server...').then((initialMessage) => {
    ArkServerApi.getPortsInformation().then((activePorts) => {
      const totalPorts = activePorts.split('\n').length;
      logger('Ports used by ARK Server', [`\n${activePorts}`]);
      initialMessage.delete();
      message.reply(`Hay ${totalPorts} puertos activos:\n\n${activePorts}`);
    }).catch((error) => {
      logger('There are no active ports for ARK Server', []);
      initialMessage.delete();
      message.reply('No hay puertos activos para ARK Server. ¿Estás seguro de que está activo el servidor? Usa el comando "!ark status" para averiguarlo.');
    });
  });
}