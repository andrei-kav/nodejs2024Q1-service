import {Injectable, NestMiddleware} from "@nestjs/common";
import {LoggingService} from "../logging/logging.service";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(
        private loggingService: LoggingService,
    ) {}

    use(req: Request, res: Response, next: NextFunction): any {
        const { baseUrl, body, params } = req
        res.on('finish', async () => {
            const { statusCode } = res
            await this.loggingService.log(`Request: url: ${baseUrl}, query parameters: ${JSON.stringify(params)}, body: ${JSON.stringify(body)}`)
            await this.loggingService.log(`Response: status code ${statusCode}`)
        })

        next()
    }
}