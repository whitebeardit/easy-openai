import dotenv from 'dotenv';
dotenv.config({ path: './environments/.env' });

import { randomUUID } from 'crypto';
import {
  Assistant,
  Chat,
  EHumor,
  EModel,
  IChatCompletionMessage,
  memoryRepository,
} from '../';
import { ImageRepository } from '../infrastructure';
const { ChatRepository, MessageRepository } = memoryRepository;

const main = async () => {
  const chatRepository = new ChatRepository();
  const messageRepository = new MessageRepository();
  const imageRepository = new ImageRepository('./tmp');

  const whitebeardAssistant = new Assistant({
    repositories: {
      chatRepository,
      messageRepository,
      imageRepository,
    },
    params: {
      humor: EHumor.SARCASTIC,
      model: EModel['GPT-3.5-TURBO'],
      name: 'Whitebeard',
      id: randomUUID(),
    },
  });
  console.info(whitebeardAssistant.context);

  // Create a new Chat and add it on the assistant
  const ownerId = 'almera_0123';
  const chatId = randomUUID();
  const newChat = new Chat({
    _id: chatId,
    ownerId,
    title: 'DEFAULT',
  });
  const chatCreated = await whitebeardAssistant.addChat({ chat: newChat });

  //Create messages and add into the chat created
  const message: IChatCompletionMessage = {
    content: 'How much is 10 + 1 ?',
    ownerId: String(chatCreated?.ownerId),
    role: 'user',
    chatId: String(chatCreated?.id),
  };
  const m = await whitebeardAssistant.addMessage(message);
  console.info({ m });

  // Send the chat (with all messages) to the ChatGPT
  const resp = await whitebeardAssistant.sendChat(String(chatCreated?.id));
  console.info(resp);

  const img = await whitebeardAssistant.createImages({
    description: 'The master Yoda in the beach',
    numberImages: 4,
  });

  console.info(img);

  // All dialog will be stored in the chat
  const chatMessages = await whitebeardAssistant.getMessages({
    chatId,
    ownerId,
  });
  console.info({ chatMessages });
};

main();
