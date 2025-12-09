import '../utils/config'
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import User from '../models/user'

describe('User Model', () => {
  before(async () => {
    const mongoUrl = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/test_react_royale'
    await mongoose.connect(mongoUrl)
  })

  after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  it('should create a user with valid data', async () => {
    const userData = {
      username: 'testuser',
      name: 'Test User',
      passwordHash: 'hashedpassword123',
      submissions: [],
    }

    const user = new User(userData)
    const savedUser = await user.save()

    assert.strictEqual(savedUser.username, userData.username)
    assert.strictEqual(savedUser.name, userData.name)
    assert.strictEqual(savedUser.passwordHash, userData.passwordHash)
  })

  it('should require username field', async () => {
    const user = new User({
      name: 'Test User',
      passwordHash: 'hashedpassword123',
    })

    await assert.rejects(
      async () => await user.save(),
      (err: Error) => {
        assert.ok(err.message.includes('username'))
        return true
      }
    )
  })

  it('should require name field', async () => {
    const user = new User({
      username: 'testuser2',
      passwordHash: 'hashedpassword123',
    })

    await assert.rejects(
      async () => await user.save(),
      (err: Error) => {
        assert.ok(err.message.includes('name'))
        return true
      }
    )
  })

  it('should require passwordHash field', async () => {
    const user = new User({
      username: 'testuser3',
      name: 'Test User',
    })

    await assert.rejects(
      async () => await user.save(),
      (err: Error) => {
        assert.ok(err.message.includes('passwordHash'))
        return true
      }
    )
  })

  it('should transform user to JSON without sensitive fields', async () => {
    const userData = {
      username: 'jsontest',
      name: 'JSON Test User',
      passwordHash: 'hashedpassword123',
    }

    const user = new User(userData)
    const savedUser = await user.save()
    const jsonUser = savedUser.toJSON()

    assert.ok(jsonUser.id)
    assert.strictEqual(jsonUser._id, undefined)
    assert.strictEqual(jsonUser.__v, undefined)
    assert.strictEqual(jsonUser.passwordHash, undefined)
  })
})
