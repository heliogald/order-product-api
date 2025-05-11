import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
  new ValidationPipe({
    transform: true, // transforma automaticamente para o tipo definido no DTO
  }),
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true, // ✅ essencial!
    transformOptions: {
      enableImplicitConversion: true, // ✅ também ajuda
    },
  }));
  
}

  const config = new DocumentBuilder()
    .setTitle('Gerenciamento de Pedidos')
    .setDescription('API para autenticação, produtos e pedidos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // acessível em /api

  await app.listen(3000, '0.0.0.0');
}
bootstrap();



