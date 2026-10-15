import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { CraftyModule } from '@app/crafty';
import { PrismaMessageRepository} from '@app/crafty/infra/prisma/message.prisma.repository'
import { PrimaFolloweeRepository } from '@app/crafty/infra/prisma/followee.prisma.repository'
import { StubDateProvider } from '@app/crafty/infra/stub-date-provider'
import { PrismaService } from '@app/crafty/infra/prisma/prisma.service'

@Module({
  imports: [
    CraftyModule.register({
      MessageRepository: PrismaMessageRepository,
      FolloweeRepository: PrimaFolloweeRepository,
      DateProvider: StubDateProvider,
      PrismaClient: PrismaService,
    }),
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
