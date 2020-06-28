import { rejects } from 'assert';
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
