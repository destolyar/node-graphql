export const changeMemberTypeBodySchema = {
  type: 'object',
  properties: {
    discount: { type: 'number' },
    monthPostsLimit: { type: 'number' },
  },
  additionalProperties: false,
} as const;
