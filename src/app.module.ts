import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { HttpExceptionFilter } from "@common/filters/http-exception.filter";
import { LoggerModule } from "@shared/modules/logger/logger.module";
import { SampleModule } from "@sample/sample.module";

@Module({
    imports: [LoggerModule, SampleModule],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}
