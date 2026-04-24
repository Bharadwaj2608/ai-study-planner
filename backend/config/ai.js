import Anthropic from '@anthropic-ai/sdk';

export const AI_MODEL = 'claude-sonnet-4-20250514';

export const openai = new Proxy({}, {
  get(_, prop) {
    return getClient()[prop];
  }
});

let _client;
export function getClient() {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}