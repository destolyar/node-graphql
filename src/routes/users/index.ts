import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { validate as uuidValidate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return reply.status(200).send(this.db.users)
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params

      const findedUser = await this.db.users.findOne({ key: "id", equals: id })
      if (!findedUser) {
        return reply.status(404).send({ message: "User not found" })
      }

      return reply.status(200).send(findedUser)
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { email, firstName, lastName } = request.body
      const createdUser = await this.db.users.create({ email, firstName, lastName })

      return reply.status(200).send(createdUser)
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params
      const isUuid = uuidValidate(id)
      if (!id || !isUuid) {
        return reply.status(400).send({ message: "Bad request" })
      }

      const deletedUser = await this.db.users.delete(id)

      const followers = await this.db.users.findMany({
        key: 'subscribedToUserIds',
        equals: [deletedUser.id],
      })
      const posts = await this.db.posts.findMany({
        key: 'userId',
        equals: deletedUser.id,
      })
      
      const profile = await this.db.profiles.findOne({
        key: 'userId',
        equals: deletedUser.id,
      })
      
      if (profile) {
        await this.db.profiles.delete(profile.id);
      }

      followers.forEach(
        async (follower) =>
          await this.db.users.change(follower.id, {
            subscribedToUserIds: [...follower.subscribedToUserIds].filter(
              (fId) => fId !== deletedUser.id
            ),
          })
      );

      posts.forEach(async (post) => await this.db.posts.delete(post.id));

      return reply.status(200).send(deletedUser)
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params
      const { userId } = request.body
      if (!id || !userId || !uuidValidate(id) || !uuidValidate(userId)) {
        return reply.status(400).send({ message: "Bad request" })
      }

      const user: UserEntity | null = await this.db.users.findOne({ key: "id", equals: userId })
      if (!user) {
        return reply.status(404).send({ message: "User was not found" });
      }
      user.subscribedToUserIds.push(id)
      const subscribedUser = await this.db.users.change(userId, user)

      return reply.status(200).send(subscribedUser)
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params
      const { userId } = request.body
      if (!id || !userId || !uuidValidate(id) || !uuidValidate(userId)) {
        return reply.code(400).send({ message: "Bad request" })
      }

      const user = await this.db.users.findOne({ key: "id", equals: userId })
      if (!user) {
        return reply.status(404).send({ message: "User was not found" })
      }

      const indexOfSubscription = user.subscribedToUserIds.indexOf(id)
      if (indexOfSubscription === -1) {
        return reply.status(400).send({ message: "User not folowing" })
      }

      user.subscribedToUserIds.splice(indexOfSubscription, 1)
      const unsubscribedUser = await this.db.users.change(userId, user)

      return reply.status(200).send(unsubscribedUser)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params
      const newUserInfo = request.body

      const isUuid = uuidValidate(id)

      if (!newUserInfo || !id || !isUuid) {
        return reply.code(400).send({ message: "Bad request" })
      }

      const changedUser = await this.db.users.change(id, newUserInfo)
      if (!changedUser) {
        return reply.code(400).send({ message: "Bad request" })
      }

      return reply.status(200).send(changedUser)
    }
  );
};

export default plugin;
