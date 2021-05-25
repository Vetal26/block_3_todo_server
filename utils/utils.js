function updatePosition(pos) {
  return pos + Math.random().toString(36).slice(-1);
}

module.exports = {
  updatePosition: updatePosition,
}