import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import supertest from 'supertest'
import mongoose from 'mongoose'
import express from 'express'
import usersRouter from '../controllers/users'
import User from '../models/user'
import '../models/submission'

const app = express()
app.use(express.json())
app.use('/api/users', usersRouter)

const api = supertest(app)

describe('Users API', () => {
  before(async () => {
    const mongoUrl = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/test_react_royale'
    await mongoose.connect(mongoUrl)
    await User.deleteMany({})
  })

  after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  it('GET /api/users returns empty array initially', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(Array.isArray(response.body), true)
    assert.strictEqual(response.body.length, 0)
  })

  it('POST /api/users creates a new user', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.name, newUser.name)
    assert.strictEqual(response.body.passwordHash, undefined)
    assert.ok(response.body.id)
  })

  it('POST /api/users rejects short password', async () => {
    const newUser = {
      username: 'testuser2',
      name: 'Test User 2',
      password: '123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.ok(response.body.error.includes('Password'))
  })

  it('GET /api/users returns all users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 1)
  })

  it('GET /api/users/:id returns a specific user', async () => {
    const users = await User.find({})
    const userToView = users[0]

    const response = await api
      .get(`/api/users/${userToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, userToView.username)
  })

  it('GET /api/users/:id returns 404 for non-existent user', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    await api
      .get(`/api/users/${nonExistentId}`)
      .expect(404)
  })
})
