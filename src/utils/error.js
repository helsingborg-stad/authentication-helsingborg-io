
/**
 * DomainError
 *
 * Custom error class to extend with specific codes and messages
 *
 * Shamelessly stolen from https://rclayton.silvrback.com/custom-errors-in-node-js
 * All kudos to the author: Richard Clayton
 */
class DomainError extends Error {
  constructor(msg, status) {
    super(msg);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.status = status;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    // Ssee Node.js reference.
    Error.captureStackTrace(this, this.constructor);
  }
}

class InternalServerError extends DomainError {
  constructor(msg) {
    super(msg, 500);
  }
}

class ValidationError extends DomainError {
  constructor(msg, original) {
    super(msg, 422);
    this.data = {
      // eslint-disable-next-line no-underscore-dangle
      object: original._object,

      // fetch only message and type from each error
      details: original.details.map(({ message, type }) => ({
        message: message.replace(/['"]/g, ''),
        type,
      })),
    };
  }
}

class WeakValidationError extends DomainError {
  constructor(msg) {
    super(msg, 422);
  }
}

module.exports = {
  InternalServerError,
  ValidationError,
  WeakValidationError,
};
