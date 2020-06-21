import * as seedrandom from 'seedrandom';
import { Message } from 'discord.js';
import { logger } from '../utils/logger';

interface AddictedLevel {
  level: any;
  levelText: string;
}

const isBetween = (numberToTest: number, initialNumber: number, endNumber: number): boolean => {
  return numberToTest >= initialNumber && numberToTest < endNumber;
};

const parseLevel = (level: number): string => {
  return String(level).split('.')[0];
};

const addictedLevel = (username: string): AddictedLevel => {
  let level = seedrandom(`${username} jeje`).double() * 100;
  let levelText = '';
  if (isBetween(level, 0, 20)) {
    levelText = 'Tu si eres sano. Te vas a ir al cielo.';
  }
  if (isBetween(level, 20, 40)) {
    levelText = 'Krnal, juegale un poquito mas, sino como chingados quieres ser pro.';
  }
  if (isBetween(level, 40, 60)) {
    levelText = 'Balanceado, como todo debe de ser.';
  }
  if (isBetween(level, 60, 80)) {
    levelText = 'Wey, te pasas de verga. Tu si te conoces todos los pinches trucos del GTA.';
  }
  if (isBetween(level, 80, 100)) {
    levelText = 'Nombre, hijo, tu si te pasas de verga. Deja la compu y sal a jalartela un rato.';
  }
  if (username === 'Ivantollica') {
    level = 10000;
    levelText = 'Ya we, neta te pasas de verga. Tu si eres bien pinche vicio, nomames, no se como no te duele el culo.';
  }
  return { level, levelText };
};

export const executeAddictedLevel = (message: Message) => {
  const mentionedUser = message.mentions.users.first();
  if (mentionedUser) {
    const userAdictedLevel = addictedLevel(mentionedUser.username);
    logger('ADDICTED_LEVEL_FOR_USER', [
      `'${message.author.username}' asked for the addicted level for ${mentionedUser.username} (${mentionedUser.id}).\n`,
      userAdictedLevel,
    ]);
    message.reply(
      `${mentionedUser.username} es ${parseLevel(userAdictedLevel.level)}% vicio.
      \n<@${mentionedUser.id}>: ${userAdictedLevel.levelText}`
    );
  } else {
    const userAdictedLevel = addictedLevel(message.author.username);
    logger('USER_ADDICTED_LEVEL', [`'${message.author.username}' asked for his addicted level.\n`, userAdictedLevel]);
    message.reply(`Eres ${parseLevel(userAdictedLevel.level)}% vicio. ${userAdictedLevel.levelText}`);
  }
};
