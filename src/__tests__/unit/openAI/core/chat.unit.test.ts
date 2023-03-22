import { MessageRepository } from '../../../../infrastructure';
import { Chat } from '../../../../';
import { randomUUID } from 'crypto';

describe('Chat messages', () => {
  beforeAll(async () => {});

  afterAll(async () => {});

  it('Should be possible add messages', async () => {
    const messageRepository = new MessageRepository();

    const chatId = randomUUID();
    const ownerId = 'almera';
    const myChat = new Chat({
      _id: chatId,
      ownerId,
      title: 'my Subject',
      description: 'my descriptio',
    });

    messageRepository.addMessage({
      content: 'content 01',
      role: 'user',
      ownerId,
      chatId,
      isCommand: false,
    });
    messageRepository.addMessage({
      content: 'content 02',
      role: 'user',
      ownerId,
      chatId,
      isCommand: false,
    });
    messageRepository.addMessage({
      content: 'content 03',
      role: 'user',
      ownerId,
      chatId,
      isCommand: false,
    });

    expect(
      (await messageRepository.getMessages(ownerId, chatId, false)).length,
    ).toBe(3);
  });

  it('Should be possible get messages paginated', async () => {
    const messageRepository = new MessageRepository();
    const chatId = randomUUID();
    const ownerId = 'almera';
    const myChat = new Chat({
      _id: chatId,
      ownerId,
      title: 'my Subject',
      description: 'my descriptio',
    });

    messageRepository.addMessage({
      content: 'content 01',
      role: 'user',
      ownerId,
      chatId,
      isCommand: false,
    });
    messageRepository.addMessage({
      content: 'content 02',
      role: 'user',
      ownerId,
      chatId,
      isCommand: false,
    });
    messageRepository.addMessage({
      content: 'content 03',
      role: 'user',
      ownerId,
      chatId,
      isCommand: false,
    });

    const messages = await messageRepository.getMessages(
      ownerId,
      chatId,
      false,
      {
        skip: 0,
        limit: 1,
      },
    );
    const messages1 = await messageRepository.getMessages(
      ownerId,
      chatId,
      false,
      {
        skip: 1,
        limit: 1,
      },
    );
    const messages2 = await messageRepository.getMessages(
      ownerId,
      chatId,
      false,
      {
        skip: 2,
        limit: 1,
      },
    );
    const messages3 = await messageRepository.getMessages(
      ownerId,
      chatId,
      false,
      {
        skip: 3,
        limit: 1,
      },
    );

    const messages4 = await messageRepository.getMessages(
      ownerId,
      chatId,
      false,
      {
        skip: 0,
        limit: 100,
      },
    );
    const messages5 = await messageRepository.getMessages(
      ownerId,
      chatId,
      false,
      {
        skip: 1,
        limit: 100,
      },
    );

    expect(messages.length).toBe(1);
    expect(messages[0].content).toBe('content 01');
    expect(messages1.length).toBe(1);
    expect(messages1[0].content).toBe('content 02');
    expect(messages2.length).toBe(1);
    expect(messages2[0].content).toBe('content 03');
    expect(messages3.length).toBe(0);

    expect(messages4.length).toBe(3);
    expect(messages5.length).toBe(2);
  });
});
