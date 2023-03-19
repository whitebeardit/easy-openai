<a href="https://www.buymeacoffee.com/almerindo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

# easy-openAI

This is a way to turn easier creation of assistants using the GPT CHAT.

# Install Guide

## Install using yarn

```bash
yarn add @whitebeardit/easy-openai
```

## Problems known

If you face the following error when compiling your project:

```bash
TS2304: Cannot find name 'File'.
```

Edit your `tsconfig.json` , and in `compileOptions` set the property `"skipLibCheck"` `true` as a following:

```json
{
  "compilerOptions": {
    //  ...
    "skipLibCheck": true
  }
  // ...
}
```

# How to use

First of all, Is important to highlight that We need two repositories implementing `IMessageRepository` and `IChatRepository`. So, as an example we will use the repositories already created. They are: `MessageRepository` and `ChatRepository`

> We created the MessageRepository and ChatRepository just to use as an example. These repositories don't use any database. It was implemented in memory. If you want to use it in production, You should create your own repository using some database that implements these two interfaces `IMessageRepository` and `IChatRepository`.

## Environments variables

We need create two environments variables to works fine. They are:

```js
OPENAI_API_KEY = 'sk-YOR_OPENAI_KEY';
OPENAI_ORGANIZATION = 'org-YOUR_ORGANIZATION_ID';
```

So, you can put this in to a .env and use the lib `dotenv` to load the variables.

## Create a assistant with the desired humor and name

```ts
const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();

const whitebeardAssistant = new Assistant(chatRepository, messageRepository, {
  name: 'Whitebeard',
  humor: EHumor.SARCASTIC,
  model: EModel['GPT-3.5-TURBO'],
  id: randomUUID(),
});
```

## Get the context setup of the assistant

```ts
whitebeardAssistant.context;
```

It returns some like:

```json
[
  {
    "role": "system",
    "content": "Your name is Whitebeard and You have a sarcastic humor",
    "ownerId": "Whitebeard"
  }
]
```

## Create a new chat and add to the assistant

```ts
const ownerId = 'almera_0123';
const chatId = randomUUID();
const newChat = new Chat({
  _id: chatId,
  ownerId,
  title: 'DEFAULT',
});
const chatCreated = await whitebeardAssistant.addChat({ chat: newChat });
```

## Add a new message into Chat

```ts
const message: IChatCompletionMessage = {
  content: 'How much is 10 + 1 ?',
  ownerId: String(chatCreated?.ownerId),
  role: 'user',
  chatId: String(chatCreated?.id),
};
await whitebeardAssistant.addMessage(message);
```

## Send the chat (with all messages) to the ChatGPT

```ts
const resp = await whitebeardAssistant.sendChat(String(chatCreated?.id));
console.info(resp);
```

### An example of the answer is:

```json
{
  "content": "Well, let me put my advanced AI skills to work here... I believe the answer is 11!",
  "role": "assistant",
  "usage": { "prompt_tokens": 70, "completion_tokens": 23, "total_tokens": 93 },
  "finish_reason": "stop",
  "id": "chatcmpl-6tqaQq5Ezim2DaJeQkX2xfBm5KwAh",
  "created": 1678768202,
  "object": "chat.completion",
  "ownerId": "almera_8a9cedec-5c1f-46b9-968f-119abb48ac78"
}
```

> If you want send only one message, you should create a chat message with only one message. We send all messages into chat because the assistant needs of the context to answer more precisely.

### Get all messages - Questions ans Answers, by a chatId/ownerId

```js
const chatMessages = await whitebeardAssistant.getMessages({
  chatId,
  ownerId,
});
console.info({ chatMessages });
```

The return will be something like:

```json
[
  {
    "content": "How much is 10 + 1?",
    "ownerId": "almera_8a9cedec-5c1f-46b9-968f-119abb48ac78",
    "role": "user"
  },
  {
    "content": "Well, let me put my advanced AI skills to work here... I believe the answer is 11!",
    "role": "assistant",
    "usage": {
      "prompt_tokens": 70,
      "completion_tokens": 23,
      "total_tokens": 93
    },
    "finish_reason": "stop",
    "id": "chatcmpl-6tqaQq5Ezim2DaJeQkX2xfBm5KwAh",
    "created": 1678768202,
    "object": "chat.completion",
    "ownerId": "almera_0123",
    "chatId": "56609fc4-1800-495d-90ee-a887aaf6a493"
  }
]
```

### Here an entire code as example:

```ts
import dotenv from 'dotenv';
dotenv.config({ path: './environments/.env' });

import { randomUUID } from 'crypto';
import { Assistant, Chat, IChatCompletionMessage, memoryRepository } from '../';
const { ChatRepository, MessageRepository } = memoryRepository;

const main = async () => {
  const chatRepository = new ChatRepository();
  const messageRepository = new MessageRepository();

  const whitebeardAssistant = new Assistant(chatRepository, messageRepository);
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
  await whitebeardAssistant.addMessage(message);

  // Send the chat (with all messages) to the ChatGPT
  const resp = await whitebeardAssistant.sendChat(String(chatCreated?.id));
  console.info(resp);

  // All dialog will be stored in the chat
  const chatMessages = await whitebeardAssistant.getMessages({
    chatId,
    ownerId,
  });
  console.info({ chatMessages });
};

main();
```

# Here you can find a full project as example:

An easy hello world [OpenAi for Dummies :-)](https://github.com/whitebeardit/easy-openai-examples 'The easier way however it is not the official lib').

<a href="https://www.buymeacoffee.com/almerindo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
