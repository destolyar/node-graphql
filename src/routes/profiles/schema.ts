export const createProfileBodySchema = {
  type: 'object',
  required: [
    'avatar',
    'sex',
    'birthday',
    'country',
    'street',
    'city',
    'userId',
    'memberTypeId',
  ],
  properties: {
    avatar: { type: 'string' },
    sex: { type: 'string' },
    birthday: { type: 'number' },
    country: { type: 'string' },
    street: { type: 'string' },
    city: { type: 'string' },
    userId: { type: 'string', format: 'uuid' },
    memberTypeId: {
      type: 'string',
    },
  },
  additionalProperties: false,
} as const;

export const changeProfileBodySchema = {
  type: 'object',
  properties: {
    avatar: { type: 'string' },
    sex: { type: 'string' },
    birthday: { type: 'number' },
    country: { type: 'string' },
    street: { type: 'string' },
    city: { type: 'string' },
    memberTypeId: {
      type: 'string',
    },
  },
  additionalProperties: false,
} as const;
