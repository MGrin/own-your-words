import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors:
      process.env.NODE_ENV === 'production'
        ? undefined
        : {
            origin: '*',
          },
  });
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
