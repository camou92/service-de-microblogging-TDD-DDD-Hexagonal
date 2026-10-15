import { CraftyModule } from '@app/crafty';
import { PrismaMessageRepository} from '@app/crafty/infra/message.prisma.repository'
import { PrimaFolloweeRepository } from '@app/crafty/infra/followee.prisma.repository'
import { StubDateProvider } from '@app/crafty/infra/stub-date-provider'
import { PrismaService } from '@app/crafty/infra/prisma/prisma.service'
import { Module } from '@nestjs/common';
import { CliTimelinePresenter } from './cli.timeline.presenter';
import { CustomConsoleLogger } from './custom.console.logger';
import { DefaultTimelinePresenter } from './default.timeline.presenter';
import { commands } from './command';

@Module({
  imports: [
    CraftyModule.register({
      MessageRepository: PrismaMessageRepository,
      FolloweeRepository: PrimaFolloweeRepository,
      DateProvider: StubDateProvider,
      PrismaClient: PrismaService,
    }),
  ],
  providers: [
    ...commands,
    CliTimelinePresenter,
    CustomConsoleLogger,
    DefaultTimelinePresenter,
  ],
})
export class CliModule {}