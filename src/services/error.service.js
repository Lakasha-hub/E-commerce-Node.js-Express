export default class ErrorService {
  static create({ name = "Error", cause, message, code, status }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    error.status = status;

    throw error;
  }
}
