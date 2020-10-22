import { Inject, Injectable } from "@nestjs/common";
import { Logger, createLogger } from "winston";
import { ConfigType } from "@nestjs/config";
import rTracer from "cls-rtracer";
import { LoggerModuleConfig } from "@config";

@Injectable()
export class LoggerService {
    private readonly logger: Logger;

    constructor(
        @Inject(LoggerModuleConfig.KEY)
        config: ConfigType<typeof LoggerModuleConfig>
    ) {
        this.logger = createLogger(config);
    }

    info(message: string, meta: Record<string, any>) {
        const requestId = rTracer.id();
        meta.requestId = requestId ? requestId : undefined;
        this.logger.info({ message, meta });
    }

    error(message: string, meta: Record<string, any>) {
        const requestId = rTracer.id();
        meta.requestId = requestId ? requestId : undefined;
        this.logger.error({ message, meta });
    }

    log(level: string, message: string, meta: Record<string, any>) {
        const requestId = rTracer.id();
        meta.requestId = requestId ? requestId : undefined;
        this.logger.log(level, message, { meta });
    }

    warn(message: string, meta: Record<string, any>) {
        const requestId = rTracer.id();
        meta.requestId = requestId ? requestId : undefined;
        this.logger.warn({ message, meta });
    }

    errorStream = {
        write: (message: string): void => {
            const requestId = rTracer.id();
            this.logger.error(message, { requestId });
        }
    };
}
