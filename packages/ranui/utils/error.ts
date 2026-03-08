export interface CustomErrorType {
  new (m: string): void;
}

export function createCustomError(msg: string = ''): CustomErrorType {
  return class CustomError {
    message: string;
    constructor(message: string = msg) {
      this.message = message;
    }
  };
}
