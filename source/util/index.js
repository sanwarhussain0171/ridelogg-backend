function getObjectIndex(array, objectId) {
  return array.findIndex((item) => item._id.toString() == objectId)
}

module.exports = { getObjectIndex }
