import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { SampleModule } from "@sample/sample.module";

@Module({
    imports: [SampleModule],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        }
    ]
})
export class AppModule {}
