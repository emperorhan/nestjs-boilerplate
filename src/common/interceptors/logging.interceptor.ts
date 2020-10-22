import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { logger } from "@common/winston";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { url, method } = context.switchToHttp().getRequest();

        logger.info(`${method} ${url}`, { context: "Interceptor" });

        const now = Date.now();
        return next.handle().pipe(
            tap(() =>
                logger.info(`${Date.now() - now}ms time elapsed`, {
                    context: "Interceptor",
                })
            )
        );
    }
}
