import path from 'path';
import { Assistant, Chat } from '../../../easyOpenAI';
import {
  ChatRepository,
  ImageRepository,
  MessageRepository,
} from '../../../infrastructure';
import { IImageMetadata } from '../../../infrastructure/image';

import {
  createChatCompletionMock,
  createImageMock,
} from '../../utils/mocks/createChatCompletion.mock';
import { deleteDir, deleteFiles } from '../../utils/util';

describe('Assistant', () => {
  const testBaseDir = path.join(__dirname, '/tmp', 'tests');
  const chatRepository = new ChatRepository();
  const messageRepository = new MessageRepository();
  const imageRepository = new ImageRepository(testBaseDir);

  const assistant = new Assistant({
    repositories: {
      chatRepository,
      messageRepository,
      imageRepository,
    },
  });
  const openAIApi = assistant.getOpenAIApi();

  (jest.spyOn(openAIApi, 'createChatCompletion') as any).mockImplementation(
    createChatCompletionMock,
  );
  (jest.spyOn(openAIApi, 'createImage') as any).mockImplementation(
    createImageMock,
  );
  beforeAll(async () => {
    await deleteFiles(testBaseDir);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await deleteFiles(testBaseDir);
    await deleteDir(path.join(__dirname, '/tmp'));
    jest.clearAllMocks();
  });

  it('Should be possible to send message to GPT and store the response into the right chat messages', async () => {
    const chat = new Chat({
      _id: 'My_Chat_ID',
      ownerId: 'Almera',
      title: 'My Subject',
      description: 'My Description',
    });
    assistant.addChat({ chat });

    const myChat = (await assistant.getChat({ chatId: chat.id })) as Chat;

    assistant.addMessage({
      content: 'content 01',
      role: 'user',
      ownerId: myChat.ownerId,
      chatId: myChat.id,
    });
    assistant.addMessage({
      content: 'content 02',
      role: 'user',
      ownerId: myChat.ownerId,
      chatId: myChat.id,
    });
    assistant.addMessage({
      content: 'content 03',
      role: 'user',
      ownerId: myChat.ownerId,
      chatId: myChat.id,
    });

    await assistant.sendChat(chat.id);

    const messages = await assistant.getMessages({
      chatId: myChat.id,
      ownerId: myChat.ownerId,
    });

    expect(messages.length).toBeGreaterThan(3);

    const lastMessage = messages[messages.length - 1];

    expect(lastMessage).toMatchObject({
      id: 'chatcmpl-6tRmsVIkx7HGLTcuq6u7oTN5fg2u2',
      object: 'chat.completion',
      created: 1678672874,
      content: 'Give me more context!',
      role: 'assistant',
      ownerId: 'Almera',
      usage: { prompt_tokens: 60, completion_tokens: 17, total_tokens: 77 },
    });
  });

  it('Should be possible create an Image', async () => {
    // Generating an image based on the given description
    const imgMetadata = (await assistant.createImages({
      description: 'The master Yoda with white beard in the beach ',
      numberImages: 1,
      chatId: 'chat001',
      ownerId: 'Whitebeard',
    })) as IImageMetadata[];

    expect(imgMetadata.length).toBeGreaterThan(0);
    const img = await assistant.getImage({
      imageId: imgMetadata[0].id,
      ownerId: imgMetadata[0].ownerId,
      chatId: imgMetadata[0].chatId,
    });

    expect(img?.b64Data).toBeTruthy();
  });
});
