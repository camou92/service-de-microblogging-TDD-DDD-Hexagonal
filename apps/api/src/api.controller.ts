import type { FastifyReply } from 'fastify';
import { BadRequestException, Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import {
  PostMessageCommand,
  PostMessageUseCase,
} from '@app/crafty/application/usecase/post-message.usecase';
import {
  EditMessageCommand,
  EditMessageUseCase,
} from '@app/crafty/application/usecase/edit-message.usecase';
import {
  FollowUserCommand,
  FollowUserUseCase,
} from '@app/crafty/application/usecase/follow-user.usecase';
import { ViewTimelineUseCase } from '@app/crafty/application/usecase/view-timeline.usecase';
import { ViewWallUseCase} from "@app/crafty/application/usecase/view-wall.usecase"
import { ApiTimelinePresenter } from './api.timeline.presenter';

@Controller()
export class ApiController {
  constructor(
    private readonly postMessageUseCase: PostMessageUseCase,
    private readonly editMessageUseCase: EditMessageUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly viewTimelineUseCase: ViewTimelineUseCase,
    private readonly viewWallUseCase: ViewWallUseCase,
  ) {}

  @Post('/post')
  async postMessage(@Body() body: { user: string; message: string }) {
    const postMessageCommand: PostMessageCommand = {
      id: `${Math.floor(Math.random() * 10000)}`,
      author: body.user,
      text: body.message,
    };

    try {
      await this.postMessageUseCase.handle(postMessageCommand);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('/edit')
  async editMessage(
    @Body() body: { user: string; messageId: string; message: string },
  ) {
    const editMessageCommand: EditMessageCommand = {
      messageId: body.messageId,
      text: body.message,
    };

    try {
      await this.editMessageUseCase.handle(editMessageCommand);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('/follow')
  async followUser(@Body() body: { user: string; followee: string }) {
    const followUserCommand: FollowUserCommand = {
      user: body.user,
      userToFollow: body.followee,
    };

    await this.followUserUseCase.handle(followUserCommand);
  }

  @Get('/view')
  async viewTimeline(
    @Query() query: { user: string },
    @Res() response: FastifyReply,
  ) {
    const presenter = new ApiTimelinePresenter(response);
    await this.viewTimelineUseCase.handle(query, presenter);
  }

  @Get('/wall')
  async viewWall(
    @Query() query: { user: string },
    @Res() response: FastifyReply,
  ) {
    const presenter = new ApiTimelinePresenter(response);
    await this.viewWallUseCase.handle(query, presenter);
  }
}
