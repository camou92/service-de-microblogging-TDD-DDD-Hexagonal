import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(CliModule, ['error'])
}
bootstrap();
