import { HttpException, ValidationError } from '@nestjs/common';

/**
 * Additional data that can be passed to the `BaseException`.
 */
export type BaseExceptionExtra = {
  validationErrors?: ValidationError[];
};

/**
 * exception class for custom exceptions.
 * All custom exceptions should extend this class.
 */
export class BaseException extends HttpException {
  errorCode: string;
  extra: BaseExceptionExtra;

  constructor(
    errorCode: string,
    statusCode: number,
    extra?: BaseExceptionExtra,
  ) {
    const fullErrorCode = ['RECRIT', errorCode].join(':');
    super(fullErrorCode, statusCode);

    this.errorCode = fullErrorCode;
    this.extra = extra ?? {};
  }
}
