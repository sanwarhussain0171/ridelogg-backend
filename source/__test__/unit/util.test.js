const { getObjectIndex } = require('../../util')

describe('Find object using id ', () => {
  it('Should find object using object id and return its index', () => {
    const objectArray = [
      { _id: 'TestId2343234', value: {} },
      { _id: 'TestId2323423434', value: {} },
    ]
    const objectId = 'TestId2323423434'
    expect(getObjectIndex(objectArray, objectId)).toBe(1)
  })
})
