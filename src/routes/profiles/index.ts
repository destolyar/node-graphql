import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import { validate as uuidValidate } from 'uuid';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return reply.status(200).send(this.db.profiles)
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params

      const findedProfile = await this.db.profiles.findOne({ key: "id", equals: id })
      if (!findedProfile) {
        return reply.status(404).send({ message: "Profile not found" })
      }

      return reply.status(200).send(findedProfile)
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { userId, memberTypeId } = request.body

      const isUuid = uuidValidate(userId)
      const isMemberTypeIdValid = await this.db.memberTypes.findOne({ key: "id", equals: memberTypeId })

      if (!isUuid || !isMemberTypeIdValid) {
        return reply.status(400).send({ message: "Bad request" })
      }

      const isProfileExists = await this.db.profiles.findOne({ key: "userId", equals: userId })
      if (isProfileExists) {
        return reply.status(400).send({ message: "Profile already exist" })
      }

      const createdProfile = await this.db.profiles.create(request.body)
      return reply.status(200).send(createdProfile)
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params
      const isUuid = uuidValidate(id)
      if (!isUuid) {
        return reply.status(400).send({ message: "Bad request" })
      }

      const deletedProfile = await this.db.profiles.delete(id)
      if (!deletedProfile) {
        return reply.status(404).send({ message: "Profile not found" })
      }

      return reply.status(200).send(deletedProfile)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params
      const newProfileInfo = request.body

      const isUuid = uuidValidate(id)

      if (!newProfileInfo || !id || !isUuid) {
        return reply.status(400).send({ message: "Bad request" })
      }

      const changedProfile = await this.db.profiles.change(id, newProfileInfo)
      if (!changedProfile) {
        return reply.status(404).send({ message: "Profile not found" })
      }

      return reply.status(200).send(changedProfile)
    }
  );
};

export default plugin;
