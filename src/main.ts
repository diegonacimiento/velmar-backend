import { NestFactory, Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import apiKeyMiddleware from './middlewares/api-key.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Velmar API')
    .setDescription('Documentation Velmar API')
    .setVersion('1.0.0')
    .addTag('E-commerce')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: (origin, callback) => {
      if ([process.env.FRONTEND_URL].includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Access not allowed by CORS'));
      }
    },
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.use(apiKeyMiddleware);

  await app.listen(3001);
}
bootstrap();
