import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { BaseException } from 'src/common/exceptions/base.exception';
import { UnhandledException } from '../exceptions/unhandled.exception';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let res;
    if (exception instanceof BaseException) {
      res = exception;
    } else if (exception instanceof HttpException) {
      res = new BaseException(exception.message, exception.getStatus());
    } else {
      res = new UnhandledException();
    }
    if (process.env.ENVIRONMENT === 'local')
      // TODO: local 환경 아니여도 에러 로깅을 할 수 있도록 수정
      console.error('Unhandled error occured: ', exception);

    response.status(res.getStatus()).json({
      errorCode: res.errorCode,
      timeStamp: dayjs().toISOString(),
      path: request.url,
      ...res.extra,
    });
  }
}
