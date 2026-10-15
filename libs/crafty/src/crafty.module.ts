import { ClassProvider, DynamicModule, Module } from '@nestjs/common';
import { PostMessageUseCase } from './application/usecase/post-message.usecase';
import { EditMessageUseCase } from './application/usecase/edit-message.usecase';
import { FollowUserUseCase } from './application/usecase/follow-user.usecase';
import { ViewTimelineUseCase } from './application/usecase/view-timeline.usecase';
import { ViewWallUseCase } from './application/usecase/view-wall.usecase';
import { DefaultTimelinePresenter } from './apps/timeline.default.presenter';
import { MessageRepository } from './application/message.repository';
import { FolloweeRepository } from './application/followee.repository';
import { DateProvider } from './application/date-provider';
import { PrismaClient } from "@prisma/client";

@Module({})
export class CraftyModule {
  static register(providers: {
    MessageRepository: ClassProvider<MessageRepository>['useClass'];
    FolloweeRepository: ClassProvider<FolloweeRepository>['useClass'];
    DateProvider: ClassProvider<DateProvider>['useClass'];
    PrismaClient: ClassProvider<PrismaClient>['useClass'];
  }): DynamicModule {
    return {
      module: CraftyModule,
      providers: [
        PostMessageUseCase,
        EditMessageUseCase,
        FollowUserUseCase,
        ViewTimelineUseCase,
        ViewWallUseCase,
        DefaultTimelinePresenter,
        {
          provide: MessageRepository,
          useClass: providers.MessageRepository
        },
        {
          provide: FolloweeRepository,
          useClass: providers.FolloweeRepository
        },
        {
          provide: DateProvider,
          useClass: providers.DateProvider
        },
        {
          provide: PrismaClient,
          useClass: providers.PrismaClient
        }
      ],
      exports: [
        PostMessageUseCase,
        EditMessageUseCase,
        FollowUserUseCase,
        ViewTimelineUseCase,
        ViewWallUseCase,
        DefaultTimelinePresenter
      ]
    }
  }
}

