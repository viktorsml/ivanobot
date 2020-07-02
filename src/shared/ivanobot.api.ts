require('dotenv').config();

const pjson = require('./../../package.json');
import * as crypto from 'crypto-js';

export const botVersion: string = pjson.version;
export const discordToken = process.env.TOKEN;
export const enviroment = process.env.NODE_ENV;
export const daemonPort = 49249;
export const daemonApiUrl = enviroment === 'development' ? `http://localhost:${daemonPort}` : `http://caguamoland.team:${daemonPort}`;
export const restApiToken = crypto.SHA256(discordToken).toString(crypto.enc.Hex);

export const logger = {
  action: (title: string, args: any[] = []) => {
    const logAction = `> ${title}: `;
    console.log(logAction, ...args);
  },
  error: (title: string, args: any[] = []) => {
    const logAction = `> ${title}: `;
    console.error(logAction, ...args);
  },
};

export const friendlyErrorMessage = (errorTag: string, errorCode: string | number = null): string => {
  const errorCodeText = errorCode ? `${errorCode} (${errorTag})` : errorTag;
  return `Lo siento pero ocurrió un error. :sob:\n\n> [Error code: ${errorCodeText}]`;
};
