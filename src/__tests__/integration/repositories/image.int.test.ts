import { randomUUID } from 'crypto';
import path from 'path';
import { ImageRepository } from '../../../infrastructure';
import { createDir, deleteDir, deleteFiles } from '../../utils/util';

describe('Image Repository', () => {
  const testBaseDir = path.join(__dirname, '/tmp', 'tests');
  const imageRepository = new ImageRepository(testBaseDir);
  const chatId = 'chat001';
  const ownerId = 'Whitebeard';

  beforeAll(async () => {
    await deleteFiles(testBaseDir);
    await createDir(testBaseDir);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await deleteFiles(testBaseDir);
    await deleteDir(path.join(__dirname, '/tmp'));
    jest.clearAllMocks();
  });

  it('Should be possible get image from id', async () => {
    const imageId = randomUUID();
    const createdAt = new Date().getTime();
    await imageRepository.addImage(
      { ownerId, chatId },
      {
        id: imageId,
        b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
        description: 'Yoda in the beach',
        createdAt,
      },
    );

    const img = await imageRepository.get({ imageId, chatId, ownerId });

    expect(img).toMatchObject({
      id: imageId,
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Yoda in the beach',
      createdAt,
    });
  });

  it('Should be possible delete an image', async () => {
    const id = 'idToDelete';
    const createdAt = Date.now();
    await imageRepository.addImage(
      { chatId, ownerId },
      {
        id: randomUUID(),
        b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
        description: 'Whitebeard 01',
        createdAt: Date.now(),
      },
    );
    await imageRepository.addImage(
      { ownerId, chatId },
      {
        id,
        b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
        description: 'Whitebeard 02',
        createdAt,
      },
    );
    await imageRepository.addImage(
      { ownerId, chatId },
      {
        id: randomUUID(),
        b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
        description: 'Whitebeard 03',
        createdAt: Date.now(),
      },
    );

    const imageDeleted = await imageRepository.delete({
      imageId: id,
      ownerId,
      chatId,
    });

    expect(imageDeleted).toMatchObject({
      id,
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Whitebeard 02',
      createdAt,
    });
  });
});
