export const logger = (title: string, args: any[]) => {
  console.log(`> ${title}: `, ...args, '\n\n');
};
