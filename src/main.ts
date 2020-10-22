import "cross-fetch/polyfill";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { logger, errorStream } from "@common/winston";
import { AppModule } from "@src/app.module";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "@config";
import rTracer from "cls-rtracer";

async function bootstrap() {
    try {
        const app = await NestFactory.create<NestExpressApplication>(
            AppModule,
            {
                // httpsOptions: {
                //     key: fs.readFileSync(`./ssl/product/server.key`),
                //     cert: fs.readFileSync(`./ssl/product/server.crt`)
                // },
            }
        );
        const documentOptions = new DocumentBuilder()
            .setTitle(config.appTitle)
            .setDescription(config.appDescription)
            .setVersion(config.apiVersion)
            .build();
        const document = SwaggerModule.createDocument(app, documentOptions);

        app.setGlobalPrefix(config.apiVersion);

        app.use(rTracer.expressMiddleware());

        // added security
        app.use(helmet()); // 4 버전의 경우 무한 로딩 이슈가 발생함, 3 버전으로 사용

        // rateLimit
        app.use(
            rateLimit({
                // TODO: 각 IP에 대해서 LIMIT가 걸리는지 확인하기
                windowMs: 1000 * 60 * 60, // an hour
                max: config.rateLimitMax, // limit each IP to 100 requests per windowMs
                message:
                    "⚠️  Too many request created from this IP, please try again after an hour"
            })
        );

        app.use(
            morgan("tiny", {
                skip(req, res) {
                    return res.statusCode < 400;
                },
                stream: errorStream
            })
        );

        SwaggerModule.setup(config.swaggerPath, app, document);

        await app.listen(config.port, () => {
            !config.isProduction
                ? logger.info(
                      `🚀  Server ready at http://${config.host}:${config.port}`,
                      { context: "BootStrap" }
                  )
                : logger.info(
                      `🚀  Server is listening on port ${config.port}`,
                      { context: "BootStrap" }
                  );

            !config.isProduction &&
                logger.info(
                    `🚀  Subscriptions ready at ws://${config.host}:${config.port}`,
                    { context: "BootStrap" }
                );
        });
    } catch (error) {
        logger.error(`❌  Error starting server, ${error}`, {
            context: "BootStrap"
        });
        process.exit();
    }
}
bootstrap();
