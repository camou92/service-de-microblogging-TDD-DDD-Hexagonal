import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    new FastifyAdapter()
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
