import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LoggerService } from "@shared/modules/logger/logger.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const {
            url,
            method,
            _remoteAddress,
            headers
        } = context.switchToHttp().getRequest();

        const ip = headers["x-forwarded-for"] || _remoteAddress;

        this.logger.info(`${method} ${url}`, {
            context: "Interceptor",
            ip
        });

        const now = Date.now();
        return next.handle().pipe(
            tap(() =>
                this.logger.info(`${Date.now() - now}ms time elapsed`, {
                    context: "Interceptor",
                    ip
                })
            )
        );
    }
}
