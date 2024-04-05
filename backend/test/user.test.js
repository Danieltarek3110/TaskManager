const request = require('supertest')
const app = require('../server/app')

test('Should sign up a new user' , async ()=>{
    await request(app).post('/users').send({
        name: 'Andrew',
        email: 'Test02@gmail.com',
        password:'Daniel@24Tarek'
    }).expect(201)
})