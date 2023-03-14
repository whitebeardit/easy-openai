# easy-openAI

This is a way to turn easier creation of assistants using the GPT CHAT.

# How to use

## Create a assistant with the desired humor and name

```ts
const chatRepository = new ChatRepository();
const whitebeardAssistant = new Assistant(chatRepository, {
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
    "content": "You are a sarcastic assistant.",
    "ownerId": "Whitebeard"
  },
  {
    "role": "system",
    "content": "Your name is Whitebeard.",
    "ownerId": "Whitebeard"
  }
]
```

## Create a new chat into the assistant

```ts
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
```

## Retrieve all chats

```ts
const chats = await whitebeardAssistant.getChats(ownerId);
```

## Get a chat by chatId

```ts
const chatFound = await whitebeardAssistant.getChat({ chatId: id });
```

## Add a new message into Chat

```ts
const message: IChatCompletionMessage = {
  content: 'How much is 10 + 1 ?',
  ownerId,
  role: 'user',
};
chatFound.addMessage(message);
```

## Send all chat messages to the GPT

```ts
const resp = await whitebeardAssistant.sendMessage({ chatId: id });
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

> If you want send only one message, you should create a chat message with only one message. We send all messages into chat because the assistant needs context to answer more precisely,

### Get all messages - Questions ans Answers in a chat

```js
await chatFound.getMessages();
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
    "ownerId": "almera_8a9cedec-5c1f-46b9-968f-119abb48ac78"
  }
]
```