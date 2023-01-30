import { MemberTypeEntity } from '../../src/utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../src/utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../src/utils/DB/entities/DBProfiles';
import { UserEntity } from '../../src/utils/DB/entities/DBUsers';
import {
  generate_createUserDTO,
  generate_createPostDTO,
  generate_createProfileDTO,
} from './fake';

export async function getUser(app: any, id: string) {
  const res = await app.inject({
    url: `/users/${id}`,
    method: 'GET',
  });
  const body = (await res.json()) as UserEntity;
  return { res, body };
}

export async function getProfile(app: any, id: string) {
  const res = await app.inject({
    url: `/profiles/${id}`,
    method: 'GET',
  });
  const body = (await res.json()) as ProfileEntity;
  return { res, body };
}

export async function getPost(app: any, id: string) {
  const res = await app.inject({
    url: `/posts/${id}`,
    method: 'GET',
  });
  const body = (await res.json()) as PostEntity;
  return { res, body };
}

export async function getMemberType(app: any, id: string) {
  const res = await app.inject({
    url: `/member-types/${id}`,
    method: 'GET',
  });
  const body = (await res.json()) as MemberTypeEntity;
  return { res, body };
}

export async function createUser(app: any) {
  const res = await app.inject({
    url: '/users',
    method: 'POST',
    payload: generate_createUserDTO(),
  });
  const body = (await res.json()) as UserEntity;
  return { res, body };
}

export async function createProfile(
  app: any,
  userId: string,
  memberTypeId: string
) {
  const res = await app.inject({
    url: '/profiles',
    method: 'POST',
    payload: generate_createProfileDTO(userId, memberTypeId),
  });
  const body = (await res.json()) as ProfileEntity;
  return { res, body };
}

export async function createPost(app: any, userId: string) {
  const res = await app.inject({
    url: '/posts',
    method: 'POST',
    payload: generate_createPostDTO(userId),
  });
  const body = (await res.json()) as PostEntity;
  return { res, body };
}
