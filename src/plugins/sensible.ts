import fp from 'fastify-plugin';
import sensible from '@fastify/sensible';

export default fp(async (fastify): Promise<void> => {
  fastify.register(sensible);
});
