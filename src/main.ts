import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      cors: true,
    });

    // Configuração global de pipes
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false, // Mantém mensagens de erro detalhadas
    }));

    // Filtro global de exceções
    app.useGlobalFilters(new HttpExceptionFilter());

    // Configuração do Swagger
    const config = new DocumentBuilder()
      .setTitle('Gerenciamento de Pedidos')
      .setDescription('API para autenticação, produtos e pedidos')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Habilita shutdown hooks
    app.enableShutdownHooks();

    await app.listen(3000, '0.0.0.0');
    
    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.log(`Swagger docs available at: ${await app.getUrl()}/api`);
    
  } catch (error) {
    logger.error('Error during application startup', error.stack);
    process.exit(1);
  }
}

bootstrap();