require('dotenv').config();

const pjson = require('./../../package.json');

export const botVersion: string = pjson.version;
export const discordToken = process.env.TOKEN;
export const enviroment = process.env.NODE_ENV;
export const commandPrefix = process.env.SSH_LOGIN;

export const logger = {
  action: (title: string, args: any[] = []) => {
    const logAction = `> ${title}: `;
    console.log(logAction, ...args);
  },
  error: (title: string, error: any = null) => {
    const logAction = `> ${title}`;
    console.error('\x1b[31m%s\x1b[0m', logAction);
    console.error(error);
  },
};

export const friendlyErrorMessage = (friendlyErrorMessage: string, errorCode: string): string => {
  return `${friendlyErrorMessage}\n\n>>> \`\`\`diff\n- ${errorCode}\n\`\`\``;
};
