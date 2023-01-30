import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { validate as uuidValidate } from 'uuid';


const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return reply.status(200).send(this.db.posts)
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params

      const findedPost = await this.db.posts.findOne({ key: "id", equals: id })
      if(!findedPost) {
        return reply.status(404).send({ message: "Post not found" })
      }

      return reply.status(200).send(findedPost)
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const createdPost = await this.db.posts.create(request.body)
      
      return reply.status(200).send(createdPost)
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params
      const isUuid = uuidValidate(id)
      if (!id || !isUuid) {
        return reply.status(400).send({ message: "Bad request" })
      }

      const deletedPost = await this.db.posts.delete(id)
      if (!deletedPost) {
        return reply.status(404).send({ message: "Bad request" })
      }

      return reply.status(200).send(deletedPost)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params
      const newPostInfo = request.body

      const isUuid = uuidValidate(id)
      if (!newPostInfo || !id || !isUuid) {
        return reply.code(400).send({ message: "Bad request" })
      }

      const changedPost = await this.db.posts.change(id, newPostInfo)
      if (!changedPost) {
        return reply.status(400).send({ message: "Bad requested" })
      }

      return reply.status(200).send(changedPost)
    }
  );
};

export default plugin;
