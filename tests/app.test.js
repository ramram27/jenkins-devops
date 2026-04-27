const request = require('supertest')
const app = require('../index')


describe('test the api', () =>{
    
    test('test get method api', async () =>{
        const res = await request(app).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.text.replace(/\s+/g, " ").trim()).toBe(
      "<h1>Welcome to the app</h1> <h2>Name: Rohit Kumar</h2>"
    );
    })
});