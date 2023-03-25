import { randomUUID } from 'crypto';
import path from 'path';
import { ImageRepository } from '../../../infrastructure';
import { createDir, deleteFiles } from '../../utils/util';

describe('Image Repository', () => {
  const testBaseDir = path.join(__dirname, '/tmp', 'tests');
  const imageRepository = new ImageRepository(testBaseDir);

  beforeAll(async () => {
    await createDir(testBaseDir);
    await deleteFiles(testBaseDir);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await deleteFiles(testBaseDir);
    jest.clearAllMocks();
  });

  it('Should be possible get image from id', async () => {
    const id = randomUUID();
    const createdAt = new Date().getTime();
    await imageRepository.addImage({
      id,
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Yoda in the beach',
      createdAt,
    });

    const img = await imageRepository.get(id);

    expect(img).toMatchObject({
      id,
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Yoda in the beach',
      createdAt,
    });
  });

  it('Should be possible delete an image', async () => {
    const id = 'idToDelete';
    const createdAt = Date.now();
    await imageRepository.addImage({
      id: randomUUID(),
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Whitebeard 01',
      createdAt: Date.now(),
    });
    await imageRepository.addImage({
      id,
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Whitebeard 02',
      createdAt,
    });
    await imageRepository.addImage({
      id: randomUUID(),
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Whitebeard 03',
      createdAt: Date.now(),
    });

    const imageDeleted = await imageRepository.delete(id);

    expect(imageDeleted).toMatchObject({
      id,
      b64Data: 'V2hpdGViZWFyZCBpcyB0aGUgYmVzdCE=',
      description: 'Whitebeard 02',
      createdAt,
    });
  });
});
