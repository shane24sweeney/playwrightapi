import { test, expect } from '@playwright/test';
//remove page fixture
//add request fixture instead of page fixture
test('has title', async ({ request }) => {
    const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
    const tagsResponseJSON = await tagsResponse.json()


    expect(tagsResponse.status()).toEqual(200)
    expect(tagsResponseJSON.tags[0]).toEqual('Test')
    expect(tagsResponseJSON.tags.length).toBeLessThan(11)
    console.log(tagsResponseJSON)
});

test('has articles', async ({request}) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4MTg4NH0sImlhdCI6MTc5MTk5Mzc2MSwiZXhwIjoxNzk3MTc3NzYxfQ.-sjFSzQA9CbMPyGZJIAQveKYHm6YQibKgbDlU3TOfGE'
    const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles/feed?limit=10&offset=0', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
     });
        const articlesResponseJSON = await articlesResponse.json()
       expect(articlesResponse.status()).toEqual(200)
       console.log(articlesResponseJSON)
} );

test('login is successful', async ({request}) => {
  const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', 
    {
    data: 
      {"user":{"email":"shane24sweeney@yahoo.com","password":"Corcai!!22"}} 
  })
  const loginResponseJSON = await loginResponse.json();
  expect(loginResponse.status()).toEqual(200);
  console.log(loginResponseJSON);
  const authToken = loginResponseJSON.user.token
  console.log(authToken)
});


