import fp from 'fastify-plugin';
import DB from '../utils/DB/DB';

export default fp(async (fastify): Promise<void> => {
  const db = new DB();
  fastify.decorate('db', db);
});

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB;
  }
}
