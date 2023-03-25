import {
  ChatRepository,
  ImageRepository,
  MessageRepository,
} from '../../infrastructure';
import { Assistant, EHumor, EModel, Chat } from '../..';

describe('Assistant', () => {
  beforeAll(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('Should be possible to create an Assistant', async () => {
    const chatRepository = new ChatRepository();
    const messageRepository = new MessageRepository();
    const imageRepository = new ImageRepository('./tmpTests');

    const assistant = new Assistant({
      repositories: {
        chatRepository,
        messageRepository,
        imageRepository,
      },
    });
    expect(assistant.context.length).toBe(1);
    expect(assistant.humor).toBe(EHumor.SARCASTIC);
    expect(assistant.model).toBe(EModel['GPT-3.5-TURBO']);
    expect(assistant.name).toBe('Whitebeard');
    expect(assistant.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('Should be possible add different chats', async () => {
    const chatRepository = new ChatRepository();
    const messageRepository = new MessageRepository();
    const imageRepository = new ImageRepository('./');

    const chat = new Chat({
      _id: 'My_Chat_ID_01',
      ownerId: 'Almera',
      title: 'My Subject Almera',
      description: 'My Description Almera',
    });

    const chat2 = new Chat({
      _id: 'My_Chat_ID_02',
      ownerId: 'Andre',
      title: 'My Subject Andre',
      description: 'My Description Andre',
    });

    const assistant = new Assistant({
      repositories: {
        chatRepository,
        messageRepository,
        imageRepository,
      },
    });
    assistant.addChat({ chat });
    assistant.addChat({ chat: chat2 });

    expect(await assistant.getChat({ chatId: 'My_Chat_ID_01' })).toMatchObject({
      _id: 'My_Chat_ID_01',
    });

    expect(await assistant.getChat({ chatId: 'My_Chat_ID_02' })).toMatchObject({
      _id: 'My_Chat_ID_02',
    });
  });

  it('Should be possible get chats paginated', async () => {
    const chatRepository = new ChatRepository();
    const messageRepository = new MessageRepository();
    const imageRepository = new ImageRepository('./');

    const chat = new Chat({
      _id: 'My_Chat_ID_01',
      ownerId: 'Almera',
      title: 'My Subject Almera',
      description: 'My Description Almera',
    });

    const chat2 = new Chat({
      _id: 'My_Chat_ID_02',
      ownerId: 'Almera',
      title: 'My Subject Almera 02',
      description: 'My Description Almera 02',
    });

    const chat3 = new Chat({
      _id: 'My_Chat_ID_03',
      ownerId: 'Almera',
      title: 'My Subject Almera 03',
      description: 'My Description Almera 03',
    });

    const otherUserChat = new Chat({
      _id: 'My_Chat_ID_Andre',
      ownerId: 'Andre',
      title: 'My Subject Andre 02',
      description: 'My Description Andre 02',
    });

    const assistant = new Assistant({
      repositories: {
        chatRepository,
        messageRepository,
        imageRepository,
      },
    });
    assistant.addChat({ chat });
    assistant.addChat({ chat: chat2 });
    assistant.addChat({ chat: otherUserChat });
    assistant.addChat({ chat: chat3 });

    const chatsAlmera = await assistant.getChats('Almera', {
      skip: 0,
      limit: 10,
    });
    const chatsAndre = await assistant.getChats('Andre', {
      skip: 0,
      limit: 10,
    });

    const chatsAndreSkipped = await assistant.getChats('Andre', {
      skip: 1,
      limit: 10,
    });

    const chatsAlmeraSkipped = await assistant.getChats('Almera', {
      skip: 1,
      limit: 1,
    });

    expect(chatsAlmera.length).toBe(3);
    expect(chatsAndre.length).toBe(1);
    expect(chatsAndreSkipped.length).toBe(0);
    expect(chatsAlmeraSkipped.length).toBe(1);
    expect(chatsAlmeraSkipped[0].id).toBe('My_Chat_ID_02');
  });
});