import dotenv from 'dotenv';
dotenv.config({ path: './environments/.env' });

import { Image } from '../easyOpenAI/core/image/image';
import { ImageRepository } from '../infrastructure/image/image.repository';
const main = async () => {
  const i = new Image({
    description: 'Símbolo PSI desenhado na areia',
  });
  const resp = await i.generate({ numberImages: 4, size: '256x256' });
  const images = resp.data;
  const imgRepository = new ImageRepository('./');

  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    if (image.b64_json) await imgRepository.save(image.b64_json);
  }
};

main();
