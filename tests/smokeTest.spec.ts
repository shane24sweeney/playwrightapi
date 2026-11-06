import { test, expect } from '@playwright/test';
import { RequestHandler } from '../utils/requestHandler'

test('first test', async ({}) => {
const api = new RequestHandler()

api
.url('https://conduit-api.bondaracademy.com/api')
.path('/articles')
.params({ limit: 10, offset: 0 })
.headers({ Authorization: 'authToken' })
.body({'body': 'hello there how are you',})

});