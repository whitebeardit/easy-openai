import fs from 'node:fs/promises';
import path from 'node:path';
import rimraf from 'rimraf';

export const deleteFiles = async (directory: string) => {
  for (const file of await fs.readdir(directory)) {
    await fs.unlink(path.join(directory, file));
  }
};

export const createDir = async (directory: string) => {
  return await fs.mkdir(directory, { recursive: true });
};

export const deleteDir = async (directory: string) => {
  rimraf.sync(directory);
};
