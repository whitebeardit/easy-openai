import '../configurations/dotenv';

import { randomUUID } from 'crypto';
import { ChatRepository } from '../infrastructure/chat.repository';
import { MessageRepository } from '../infrastructure/message.repository';
import { Logger } from 'traceability';
import {
  Assistant,
  Chat,
  EHumor,
  EModel,
  IChatCompletionMessage,
} from '../openAI';

import { loggerConfiguration } from '../configurations/log.conf';
Logger.configure(loggerConfiguration);

const ownerId = `almera_${randomUUID()}`;

const setup = () => {
  const chatRepository = new ChatRepository();
  const whitebeardAssistant = new Assistant(chatRepository, {
    name: 'Whitebeard',
    humor: EHumor.SARCASTIC,
    model: EModel['GPT-3.5-TURBO'],
    id: randomUUID(),
  });

  const messageRepository = new MessageRepository();
  const newChat = new Chat(
    {
      _id: randomUUID(),
      ownerId,
      title: 'DEFAULT',
    },
    messageRepository,
  );
  whitebeardAssistant.addChat({ chat: newChat });

  return whitebeardAssistant;
};

const working = async () => {
  const whitebeardAssistant = setup();
  const chats = await whitebeardAssistant.getChats(ownerId);
  Logger.info('Retrieve all chats by ownerId', {
    eventName: 'whitebeardAssistant.getChats(ownerId)',
    eventData: chats,
  });

  const { id } = chats[0];
  Logger.info('Retrieve id of first chat', {
    eventName: 'chats[0].id',
    eventData: id,
  });

  const chatFound = await whitebeardAssistant.getChat({ chatId: id });
  Logger.info('Getting chat by Id', {
    eventName: 'whitebeardAssistant.getChat({ chatId: id })',
    eventData: chatFound,
  });

  const message: IChatCompletionMessage = {
    content: 'How much is 10 + 1?',
    ownerId,
    role: 'user',
  };
  chatFound.addMessage(message);
  Logger.info('Add a new message to the chat', {
    eventName: 'chatFound.addMessage()',
    eventData: message,
  });

  const resp = await whitebeardAssistant.sendMessage({ chatId: id });
  Logger.info('Sending all chat messages and getting the answer', {
    eventName: 'whitebeardAssistant.sendMessage({ chatId: id })',
    eventData: resp,
  });

  const allMessages = await chatFound.getMessages();
  Logger.info('Getting all chat messages - history', {
    eventName: 'chatFound.getMessages()',
    eventData: allMessages,
  });

  Logger.info('Getting the assistant context setup', {
    eventName: 'whitebeardAssistant.context',
    eventData: whitebeardAssistant.context,
  });
};

working();
