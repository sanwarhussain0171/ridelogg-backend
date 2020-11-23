const Mongoose = require('mongoose')
const { User } = require('../../model/signup')

describe('/api/signup', () => {
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
  it('Should create a new user and verify it exists', async () => {
    const user = new User({
      callsign: 'test',
      email: 'test@test.com',
      password: 'test1234',
    })
    await user.save()

    let fetchedUser = await User.findOne({ email: user.email })
    expect(fetchedUser.email).toBe(user.email)
  })
})
