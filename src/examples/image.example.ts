import dotenv from 'dotenv';
dotenv.config({ path: './environments/.env' });

import { Image } from '../easyOpenAI/core/image/image';

const main = async () => {
  const i = new Image({ description: 'yoda na praia' });
  const resp = await i.generate({ numberImages: 1, size: '256x256' });
  console.info(JSON.stringify(resp.data));
};

main();
