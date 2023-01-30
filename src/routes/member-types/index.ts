import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return reply.status(200).send(this.db.memberTypes)
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params

      const findedMemberType = await this.db.memberTypes.findOne({ key: "id", equals: id })
      if (!findedMemberType) {
        return reply.status(404).send({ message: "Type is not found" })
      }

      return reply.status(200).send(findedMemberType)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params
      const newMemberTypeInfo = request.body

      const isValidId = await this.db.memberTypes.findOne({ key: "id", equals: id })
      if (!isValidId) {
        return reply.status(400).send({ message: "Bad request" })
      }

      const changedMemberType = await this.db.memberTypes.change(id, newMemberTypeInfo)
      if (!changedMemberType) {
        return reply.status(404).send({ message: "Type is not found" })
      }

      return reply.status(200).send(changedMemberType)
    }
  );
};

export default plugin;
