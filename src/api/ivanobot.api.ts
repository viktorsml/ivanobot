export const logger = (title: string, args: any[] = []) => {
  console.log(`(${new Date()}) > ${title}: `, ...args);
};
