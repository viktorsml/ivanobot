import { Message } from "discord.js";
import { logger } from "../utils/logger";
import { ArkServerApi } from "../utils/arkServer.api";

export const arkStartCommand = (message: Message) => {
  logger('Trying to start ARK Server.', [`invoked by '@${message.author.username}'`]);
  message.reply('Iniciando servidor de ark.').then((initialMessage) => {
    ArkServerApi.isActiveServer().then((isActive) => {
      if (isActive) {
        initialMessage.delete();
        message.reply('El servidor de ARK ya se encuentra activado. Si quires reiniciar el servidor usa el comando "!ark restart".');
      } else {
        ArkServerApi.startServer().then((commandResponse) => {
          logger('Successfully started ARK Server.', [commandResponse]);
          initialMessage.delete();
          message.reply('Listo, el servidor se inicio correctamente. Espera unos minutos para que te aparezca en la lista de servidores de ARK.');
        });
      }
    }).catch((error) => {
      logger('Error while trying to start ARK Server.', [error]);
      initialMessage.delete();
      message.reply('Lo sentimos pero hubo un error al iniciar el servidor de ARK. Revisa los logs del servidor.');
    });
  });
}