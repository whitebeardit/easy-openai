import fs from 'node:fs/promises';
import path from 'node:path';
import rimraf from 'rimraf';

export const deleteFiles = async (directory: string) => {
  try {
    for (const file of await fs.readdir(directory)) {
      await fs.unlink(path.join(directory, file));
    }
  } catch (error) {
    console.error({ error });
  }
};

export const createDir = async (directory: string) => {
  return await fs.mkdir(directory, { recursive: true });
};

export const deleteDir = async (directory: string) => {
  console.info({ directory });
  rimraf.sync(directory);
};
