import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {
    }
    use(req: Request, res: Response, next: NextFunction) {

        if (this.configService.get('DEBUG')) {
            const start = Date.now();
            const { method, originalUrl, body } = req;
            console.log(`[REQUEST], [${method}], ${originalUrl}, ${JSON.stringify(body)}`);

            res.on('finish', () => {
                const status = res.statusCode;
                const duration = Date.now() - start;
                console.log(`[RESPONSE],${status},${duration}ms`);
            });
        }
        next();
    }
} 