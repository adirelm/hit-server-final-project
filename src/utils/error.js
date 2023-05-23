class ApiError extends Error {
  constructor(status, message, data = {}) {
    // Call the parent class 'Error' constructor with the provided error message
    super(message);

    // Store the status code of the API error
    this.status = status;
    // Store additional data associated with the error
    this.data = data;
  }
}

module.exports = { ApiError };
