import { test } from 'tap';
import { build } from '../helper';
import {
  createUser,
  createPost,
  createProfile,
  getUser,
  getProfile,
  getPost,
} from '../utils/requests';

test('users', async (t) => {
  const app = await build(t);

  await t.test('GET /users/:id => failure; fake params.id', async (t) => {
    const { res: resReceivedUser } = await getUser(app, 'fakeId');

    t.ok(resReceivedUser.statusCode === 404);
  });

  await t.test('POST /users => success', async (t) => {
    const { body: user1 } = await createUser(app);
    const { body: receivedUser1 } = await getUser(app, user1.id);

    t.ok(receivedUser1.id === user1.id);
  });

  await t.test('PATCH /users/:id => failure; fake params.id', async (t) => {
    const responsePatch = await app.inject({
      url: `/users/fakeId`,
      method: 'PATCH',
      payload: {},
    });

    t.ok(responsePatch.statusCode === 400);
  });

  await t.test('PATCH /users/:id => success', async (t) => {
    const { body: user1 } = await createUser(app);

    const changedEmail = 'qwe@gmail.com';
    await app.inject({
      url: `/users/${user1.id}`,
      method: 'PATCH',
      payload: {
        email: changedEmail,
      },
    });

    const { body: receivedUser } = await getUser(app, user1.id);

    t.ok(receivedUser.email === changedEmail);
  });

  await t.test('POST /users/:id/subscribeTo => success', async (t) => {
    const { body: user1 } = await createUser(app);
    const { body: user2 } = await createUser(app);
    const { body: user3 } = await createUser(app);

    await app.inject({
      url: `/users/${user1.id}/subscribeTo`,
      method: 'POST',
      payload: {
        userId: user3.id,
      },
    });
    await app.inject({
      url: `/users/${user2.id}/subscribeTo`,
      method: 'POST',
      payload: {
        userId: user3.id,
      },
    });

    const { body: receivedUser3 } = await getUser(app, user3.id);
    t.ok(
      receivedUser3.subscribedToUserIds.includes(user1.id) &&
        receivedUser3.subscribedToUserIds.includes(user2.id)
    );
  });

  await t.test(
    'POST /users/:id/unsubscribeFrom => failure; fake params.id',
    async (t) => {
      const responseUnsubscribeFrom = await app.inject({
        url: `/users/fakeId/unsubscribeFrom`,
        method: 'POST',
        payload: {
          userId: 'fakeId',
        },
      });

      t.ok(responseUnsubscribeFrom.statusCode === 400);
    }
  );

  await t.test(
    'POST /users/:id/unsubscribeFrom => failure; fake body.userId',
    async (t) => {
      const { body: user1 } = await createUser(app);

      const responseUnsubscribeFrom = await app.inject({
        url: `/users/${user1.id}/unsubscribeFrom`,
        method: 'POST',
        payload: {
          userId: 'fakeId',
        },
      });

      t.ok(responseUnsubscribeFrom.statusCode === 400);
    }
  );

  await t.test(
    'POST /users/:id/unsubscribeFrom => failure; body.userId is valid but our user is not following him',
    async (t) => {
      const { body: user1 } = await createUser(app);
      const { body: user2 } = await createUser(app);

      const responseUnsubscribeFrom = await app.inject({
        url: `/users/${user1.id}/unsubscribeFrom`,
        method: 'POST',
        payload: {
          userId: user2.id,
        },
      });

      t.ok(responseUnsubscribeFrom.statusCode === 400);
    }
  );

  await t.test('POST /users/:id/unsubscribeFrom => success', async (t) => {
    const { body: user1 } = await createUser(app);
    const { body: user2 } = await createUser(app);
    const { body: user3 } = await createUser(app);

    await app.inject({
      url: `/users/${user1.id}/subscribeTo`,
      method: 'POST',
      payload: {
        userId: user3.id,
      },
    });
    await app.inject({
      url: `/users/${user2.id}/subscribeTo`,
      method: 'POST',
      payload: {
        userId: user3.id,
      },
    });
    await app.inject({
      url: `/users/${user1.id}/unsubscribeFrom`,
      method: 'POST',
      payload: {
        userId: user3.id,
      },
    });

    const { body: receivedUser3 } = await getUser(app, user3.id);
    t.ok(
      receivedUser3.subscribedToUserIds.includes(user2.id) &&
        !receivedUser3.subscribedToUserIds.includes(user1.id)
    );
  });

  await t.test('DELETE /users/:id => failure; fake params.id', async (t) => {
    const responseDeleteUser = await app.inject({
      url: `/users/fakeId`,
      method: 'DELETE',
    });

    t.ok(responseDeleteUser.statusCode === 400);
  });

  await t.test(
    'DELETE /users/:id => success; user with relations',
    async (t) => {
      const { body: user1 } = await createUser(app);
      const { body: user2 } = await createUser(app);
      const { body: post1 } = await createPost(app, user1.id);
      const { body: profile1 } = await createProfile(app, user1.id, 'basic');

      await app.inject({
        url: `/users/${user1.id}/subscribeTo`,
        method: 'POST',
        payload: {
          userId: user2.id,
        },
      });

      await app.inject({
        url: `/users/${user1.id}`,
        method: 'DELETE',
      });

      const { res: resReceivedUser1 } = await getUser(app, user1.id);
      t.ok(resReceivedUser1.statusCode === 404);

      const { body: receivedUser2 } = await getUser(app, user2.id);
      t.ok(!receivedUser2.subscribedToUserIds.includes(user1.id));

      const { res: resReceivedProfile1 } = await getProfile(app, profile1.id);
      t.ok(resReceivedProfile1.statusCode === 404);

      const { res: resReceivedPost1 } = await getPost(app, post1.id);
      t.ok(resReceivedPost1.statusCode === 404);
    }
  );
});
