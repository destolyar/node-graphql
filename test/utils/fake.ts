import { faker } from '@faker-js/faker';

export const generate_createUserDTO = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
});

export const generate_createProfileDTO = (
  userId: string,
  memberTypeId: string
) => ({
  userId,
  memberTypeId,
  avatar: faker.image.avatar(),
  sex: faker.name.sexType(),
  birthday: faker.date.birthdate().getTime(),
  country: faker.address.country(),
  street: faker.address.street(),
  city: faker.address.city(),
});

export const generate_createPostDTO = (userId: string) => ({
  userId,
  title: faker.lorem.sentence(),
  content: faker.lorem.sentences(5),
});
