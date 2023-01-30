export const createUserBodySchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email'],
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const changeUserBodySchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const subscribeBodySchema = {
  type: 'object',
  required: ['userId'],
  properties: {
    userId: { type: 'string', format: 'uuid' },
  },
  additionalProperties: false,
} as const;
