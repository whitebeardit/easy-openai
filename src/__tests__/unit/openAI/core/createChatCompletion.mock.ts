// eslint-disable-next-line import/no-extraneous-dependencies
import { AxiosRequestConfig } from 'axios';
import {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from 'openai';

export const createChatCompletionMock = (
  _createChatCompletionRequest: CreateChatCompletionRequest,
  _options?: AxiosRequestConfig,
): any => {
  const resp: CreateChatCompletionResponse = {
    choices: [
      {
        message: {
          role: 'assistant',
          content: 'Give me more context!',
        },
        finish_reason: 'stop',
        index: 0,
      },
    ],
    id: 'chatcmpl-6tRmsVIkx7HGLTcuq6u7oTN5fg2u2',
    object: 'chat.completion',
    created: 1678672874,
    model: 'gpt-3.5-turbo-0301',
    usage: { prompt_tokens: 60, completion_tokens: 17, total_tokens: 77 },
  };
  return { data: resp };
};
