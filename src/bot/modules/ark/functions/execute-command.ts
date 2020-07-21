import { exec } from 'child_process';

import { commandPrefix, enviroment } from '../../../../shared/ivanobot.api';

const removeUnwantedCharacters = (line: string): string => {
  return line
    .replace('\u001b[1;32m', '')
    .replace('\u001b[0;39m', '')
    .replace('\u001b[0;39m', '')
    .replace('\u001b[1;31m', '')
    .replace(/ {1,}/g, ' ')
    .trim();
};

interface ExecuteCommandOptions {
  runOnDocker: boolean;
}

export const executeCommand = (command: string, { runOnDocker }: ExecuteCommandOptions = { runOnDocker: false }): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const dockerPrefix = runOnDocker ? 'docker exec -i CaguamoArk' : '';
    const commandToExecute = enviroment === 'production' ? `${dockerPrefix} ${command}` : `${commandPrefix} ${dockerPrefix} "${command}"`;
    exec(commandToExecute, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        const transformedStdout = stdout
          .split('\n')
          .map((line) => removeUnwantedCharacters(line))
          .filter((val) => val.length > 0);
        resolve(transformedStdout);
      }
    });
  });
};
