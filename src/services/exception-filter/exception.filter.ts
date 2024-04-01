import {HttpAdapterHost} from "@nestjs/core";
import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";
import {LoggingService} from "../logging/logging.service";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {

    constructor(
        private httpAdapterHost: HttpAdapterHost,
        private loggingService: LoggingService,
    ) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        console.log('catch exception filter')
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        this.loggingService.error(
            exception,
            exception instanceof Error ? exception.stack : ''
        )

        const isHttpException = exception instanceof HttpException;
        const httpStatus = isHttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const ctx = host.switchToHttp();
        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message: isHttpException
                ? exception.message || 'internal server error'
                : 'unknown error'
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

}