import { test, expect } from '@playwright/test';
//remove page fixture
//add request fixture instead of page fixture
test('has title', async ({ request }) => {
  request.get('https://conduit-api.bondaracademy.com/api/user')
});


