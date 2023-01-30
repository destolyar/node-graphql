import { test } from 'tap';
import { build } from '../helper';
import { createUser, createPost, getPost } from '../utils/requests';

test('posts', async (t) => {
  const app = await build(t);

  await t.test('GET /posts/:id => failure; fake params.id', async (t) => {
    const { res: resReceivedProfile } = await getPost(app, 'fakeId');

    t.ok(resReceivedProfile.statusCode === 404);
  });

  await t.test('POST /posts => failure; fake body.userId', async (t) => {
    const { res: resCreatePost } = await createPost(app, 'fakeId');

    t.ok(resCreatePost.statusCode === 400);
  });

  await t.test('POST /posts => success', async (t) => {
    const { body: user1 } = await createUser(app);
    const { body: post11 } = await createPost(app, user1.id);
    const { body: post12 } = await createPost(app, user1.id);

    t.ok(post11.userId === user1.id && post12.userId === user1.id);
  });

  await t.test('PATCH /posts/:id => failure; fake params.id', async (t) => {
    const resPatchPost = await app.inject({
      url: `/posts/fakeId`,
      method: 'PATCH',
      payload: {},
    });

    t.ok(resPatchPost.statusCode === 400);
  });

  await t.test('PATCH /posts/:id => success', async (t) => {
    const { body: user1 } = await createUser(app);
    const { body: post1 } = await createPost(app, user1.id);

    const changedTitle = 'HelloWorld';
    await app.inject({
      url: `/posts/${post1.id}`,
      method: 'PATCH',
      payload: {
        title: changedTitle,
      },
    });

    const { body: receivedPost1 } = await getPost(app, post1.id);

    t.ok(receivedPost1.title === changedTitle);
  });

  await t.test('DELETE /posts/:id => failure; fake params.id', async (t) => {
    const resDeletePost = await app.inject({
      url: `/posts/fakeId`,
      method: 'DELETE',
    });

    t.ok(resDeletePost.statusCode === 400);
  });

  await t.test('DELETE /posts/:id => success', async (t) => {
    const { body: user1 } = await createUser(app);
    const { body: post1 } = await createPost(app, user1.id);

    await app.inject({
      url: `/posts/${post1.id}`,
      method: 'DELETE',
    });

    const { res: resReceivedPost1 } = await getPost(app, post1.id);

    t.ok(resReceivedPost1.statusCode === 404);
  });
});
