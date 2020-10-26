class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.message = message;
  }
}
module.exports = ValidationError;
