exports.fetchSchema = function (next) {
  // Just bypass schema step
  return next(null, {})
}
