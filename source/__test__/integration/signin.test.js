const jwt = require('jsonwebtoken')
const { User } = require('../../model/signup')
const Mongoose = require('mongoose')

describe('/api/signin', () => {
  beforeAll(() => {
    Mongoose.connect(process.env.TEST_DB_URL, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
    }).then(() => console.log('test connetion started'))
  })
  afterEach(async () => {
    await User.remove({})
  })
  afterAll(async () => {
    await Mongoose.disconnect()
    console.log('test connection closed')
  })
  it('Should get a valid jwt token on signin', async () => {
    const user = new User({
      callsign: 'test',
      email: 'test@test.com',
      password: 'test1234',
    })
    await user.save()

    let fetchedUser = await User.findOne({ email: user.email })
    let token = fetchedUser.generateAuthToken()
    let decryptToken = jwt.verify(token, process.env.JWTPRIVATEKEY)
    expect(user._id.toString()).toBe(decryptToken.id)
  })
})
