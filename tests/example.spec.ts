import { test, expect, APIRequestContext } from '@playwright/test';

test.beforeAll('run before all tests' , async ({ request }) => {
console.log('Running before all tests')
});

test.afterEach('run after all tests' , async ({ request }) => {
console.log('Running after all tests')
});

const API_URL = 'https://conduit-api.bondaracademy.com/api';

const USER = {
  email: 'shane24sweeney@yahoo.com',
  password: 'Corcai!!22',
};

// Logs in and returns the Authorization header value for later requests
async function logIn(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post(`${API_URL}/users/login`, {
    data: { user: USER },
  });
  expect(loginResponse.status()).toEqual(200);

  const loginResponseJSON = await loginResponse.json();
  return `Token ${loginResponseJSON.user.token}`;
}

function newArticle(title: string) {
  return {
    article: {
      title,
      description: 'Test Articles',
      body: 'hello there how are you',
      tagList: [],
    },
  };
}

test('get tags', async ({ request }) => {
  const tagsResponse = await request.get(`${API_URL}/tags`);
  const tagsResponseJSON = await tagsResponse.json();

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual('Test');
  expect(tagsResponseJSON.tags.length).toBeLessThan(11);
});

test('get articles feed', async ({ request }) => {
  const authToken = await logIn(request);

  const articlesResponse = await request.get(`${API_URL}/articles/feed?limit=10&offset=0`, {
    headers: { Authorization: authToken },
  });

  expect(articlesResponse.status()).toEqual(200);
});

test('log in and create article', async ({ request }) => {
  const authToken = await logIn(request);
  const articleTitle = `Test2 ${Date.now()}`;

  // Create
  const createResponse = await request.post(`${API_URL}/articles/`, {
    data: newArticle(articleTitle),
    headers: { Authorization: authToken },
  });
  const createResponseJSON = await createResponse.json();

  expect(createResponse.status()).toEqual(201);
  expect(createResponseJSON.article.title).toEqual(articleTitle);
});

test('create and delete article', async ({ request }) => {
  const authToken = await logIn(request);
  const articleTitle = `Test2 ${Date.now()}`;

  // Create
  const createResponse = await request.post(`${API_URL}/articles/`, {
    data: newArticle(articleTitle),
    headers: { Authorization: authToken },
  });
  const createResponseJSON = await createResponse.json();

  expect(createResponse.status()).toEqual(201);
  expect(createResponseJSON.article.title).toEqual(articleTitle);

  // Delete
  const slug = createResponseJSON.article.slug;
  const deleteResponse = await request.delete(`${API_URL}/articles/${slug}`, {
    headers: { Authorization: authToken },
  });

  expect(deleteResponse.status()).toEqual(204);
});

test('create, update and delete article', async ({ request }) => {
  const authToken = await logIn(request);
  const articleTitle = `Test New Article ${Date.now()}`;
  const modifiedTitle = `${articleTitle} Modified`;

  // Create
  const createResponse = await request.post(`${API_URL}/articles/`, {
    data: newArticle(articleTitle),
    headers: { Authorization: authToken },
  });
  const createResponseJSON = await createResponse.json();

  expect(createResponse.status()).toEqual(201);
  expect(createResponseJSON.article.title).toEqual(articleTitle);

  // Update
  const slug = createResponseJSON.article.slug;
  const updateResponse = await request.put(`${API_URL}/articles/${slug}`, {
    data: newArticle(modifiedTitle),
    headers: { Authorization: authToken },
  });
  const updateResponseJSON = await updateResponse.json();

  expect(updateResponse.status()).toEqual(200);
  expect(updateResponseJSON.article.title).toEqual(modifiedTitle);

  // Read back the updated article
  const newSlug = updateResponseJSON.article.slug;
  const getResponse = await request.get(`${API_URL}/articles/${newSlug}`, {
    headers: { Authorization: authToken },
  });
  const getResponseJSON = await getResponse.json();

  expect(getResponse.status()).toEqual(200);
  expect(getResponseJSON.article.title).toEqual(modifiedTitle);

  // Delete
  const deleteResponse = await request.delete(`${API_URL}/articles/${newSlug}`, {
    headers: { Authorization: authToken },
  });

  expect(deleteResponse.status()).toEqual(204);
});
