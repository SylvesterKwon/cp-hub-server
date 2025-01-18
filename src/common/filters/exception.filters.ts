import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import dayjs from 'dayjs';
import { BaseException } from 'src/common/exceptions/base.exception';
import { UnhandledException } from 'src/common/exceptions/unhandled.exception';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let res;
    if (exception instanceof BaseException) {
      res = exception;
    } else {
      res = new UnhandledException();
      if (process.env.ENVIRONMENT === 'local')
        console.error('Unhandled error occured: ', exception);
    }

    response.status(res.getStatus()).json({
      errorCode: res.errorCode,
      timeStamp: dayjs().toISOString(),
      path: request.url,
      ...res.extra,
    });
  }
}
