import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT') || 5000;
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const logger = new PinoLogger({});
  logger.setContext('bootstrap');
  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  const swaggerUrlPath = configService.get<string>('SWAGGER_URL_PATH');

  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('WebShop API')
      .setDescription('WebShop API description')
      .setVersion('1.0')
      .addServer('http://localhost:' + SERVER_PORT, 'WebShop Local')
      .addBearerAuth()
      .build();
    const swaggerCustomOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        docExpansion: 'none',
      },
    };
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(swaggerUrlPath, app, swaggerDocument, swaggerCustomOptions);
    fs.writeFileSync('swagger.json', JSON.stringify(swaggerDocument), {
      encoding: 'utf8',
    });
  }

  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        value: true,
        target: true,
      },
    })
  );

  await app.listen(SERVER_PORT, () => {
    if (!isProduction) {
      logger.info(`Application is connected to the database: ${configService.get<string>('DATABASE_URL')}`);
      logger.info(`WebShop API Documentation on: http://localhost:${SERVER_PORT}/${swaggerUrlPath}`);
    }

    logger.info(`Application listen on: http://localhost:${SERVER_PORT}`);
  });
}

bootstrap();
