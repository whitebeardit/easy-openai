import { MessageRepository } from '../../../../infrastructure/message.repository';
import { Chat } from '../../../../';

describe('Chat messages', () => {
  beforeAll(async () => {});

  afterAll(async () => {});

  it('Should be possible add messages', async () => {
    const messageRepository = new MessageRepository();

    const myChat = new Chat(
      {
        _id: '001',
        ownerId: 'almera',
        title: 'my Subject',
        description: 'my descriptio',
      },
      messageRepository,
    );

    myChat.addMessage({
      content: 'content 01',
      role: 'user',
      ownerId: myChat.ownerId,
    });
    myChat.addMessage({
      content: 'content 02',
      role: 'user',
      ownerId: myChat.ownerId,
    });
    myChat.addMessage({
      content: 'content 03',
      role: 'user',
      ownerId: myChat.ownerId,
    });

    expect((await myChat.getMessages()).length).toBe(3);
  });

  it('Should be possible get messages paginated', async () => {
    const messageRepository = new MessageRepository();

    const myChat = new Chat(
      {
        _id: '001',
        ownerId: 'almera',
        title: 'my Subject',
        description: 'my descriptio',
      },
      messageRepository,
    );

    myChat.addMessage({
      content: 'content 01',
      role: 'user',
      ownerId: myChat.ownerId,
    });
    myChat.addMessage({
      content: 'content 02',
      role: 'user',
      ownerId: myChat.ownerId,
    });
    myChat.addMessage({
      content: 'content 03',
      role: 'user',
      ownerId: myChat.ownerId,
    });

    const messages = await myChat.getMessages({ skip: 0, limit: 1 });
    const messages1 = await myChat.getMessages({ skip: 1, limit: 1 });
    const messages2 = await myChat.getMessages({ skip: 2, limit: 1 });
    const messages3 = await myChat.getMessages({ skip: 3, limit: 1 });

    const messages4 = await myChat.getMessages({ skip: 0, limit: 100 });
    const messages5 = await myChat.getMessages({ skip: 1, limit: 100 });

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
