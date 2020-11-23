const { User } = require('../../model/signup')
const jwt = require('jsonwebtoken')
require('dotenv').config()

describe('Verifies valid jwt token', () => {
  it('Should verify the returned token is a valid jwt token', () => {
    const testuser = new User()
    const token = testuser.generateAuthToken()
    const decoded_token = jwt.verify(token, process.env.JWTPRIVATEKEY)
    expect(decoded_token.id).toMatch(testuser._id.toString())
  })
})
